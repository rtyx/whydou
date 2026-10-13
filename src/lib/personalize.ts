import type { Explanation } from "@/lib/analyze"
import { CASE_LABEL, GENDER_LABEL, RULES, describeForm, formatMatch } from "@/lib/grammar"
import type { Token } from "@/lib/quiz"

/** A small instruction model, 4-bit quantized. Weights come from the Hugging Face CDN and are cached by the browser. */
export const MODEL = "onnx-community/Qwen2.5-0.5B-Instruct"
const MAX_SENTENCE = 300

export type Facts = { sentence: string; article: string; answer: string; explanation: Explanation }

/** The sentence around each article, with the correct article in place, keyed by token id. */
export function sentencesOf(tokens: Token[]): Record<number, string> {
  const text = tokens.map((token) => (token.kind === "text" ? token.text : token.article)).join("")
  const result: Record<number, string> = {}
  let offset = 0
  for (const token of tokens) {
    if (token.kind === "article") {
      const sentenceStart = text.slice(0, offset).search(/[^.!?]*$/)
      const after = text.slice(offset).search(/[.!?]/)
      const sentenceEnd = after === -1 ? text.length : offset + after + 1
      // Very long sentences are cut to a window around the article, at word boundaries.
      const start = Math.max(sentenceStart, offset - MAX_SENTENCE / 2)
      const end = Math.min(sentenceEnd, offset + MAX_SENTENCE / 2)
      let sentence = text.slice(start, end)
      if (start > sentenceStart) sentence = "…" + sentence.slice(sentence.indexOf(" ") + 1)
      if (end < sentenceEnd) sentence = sentence.slice(0, sentence.lastIndexOf(" ")) + "…"
      result[token.id] = sentence.trim()
    }
    offset += token.kind === "text" ? token.text.length : token.article.length
  }
  return result
}

const SYSTEM =
  "You are a friendly German tutor. In two or three short sentences of plain English, tell a learner why an article " +
  "is correct. Use only the facts you are given: do not add genders, cases or rules that are not in them, and do not " +
  "analyze the sentence yourself. Speak to the learner as you. No lists, no headings."

/** The analyzer's facts as a chat prompt. The model only rephrases them; it never decides the grammar. */
export function promptFor({ sentence, article, answer, explanation }: Facts) {
  const typed = answer.trim()
  const forms = typed ? describeForm(typed) : []
  const lines = [
    `Sentence: "${sentence}"`,
    `Correct article: "${article}" (in "${explanation.phrase}")`,
    typed
      ? `The learner wrote: "${typed}"` +
        (forms.length ? ` (that form is: ${forms.map(formatMatch).join(", ")})` : " (not a form of der, die or das)")
      : "The learner left the gap blank.",
  ]
  if (explanation.gender) lines.push(`Gender: ${GENDER_LABEL[explanation.gender]}`)
  if (explanation.case) lines.push(`Case: ${CASE_LABEL[explanation.case]}`)
  lines.push(`Reasoning: ${explanation.why}`)
  for (const rule of explanation.rules) lines.push(`Rule: ${RULES[rule].title}. ${RULES[rule].summary}`)
  if (!explanation.certain) lines.push("The reasoning is a best guess from the surrounding words; say so briefly.")
  lines.push(`Explain why "${article}" is right here${typed ? ` and why "${typed}" does not fit` : ""}.`)
  return [
    { role: "system", content: SYSTEM },
    { role: "user", content: lines.join("\n") },
  ]
}

type Gpu = { requestAdapter(): Promise<unknown> }

/** Running a model this size on the CPU is too slow to be useful, so only WebGPU is supported. */
export async function hasWebGpu() {
  const gpu = (navigator as Navigator & { gpu?: Gpu }).gpu
  if (!gpu) return false
  try {
    return (await gpu.requestAdapter()) !== null
  } catch {
    return false
  }
}

type Generate = (messages: ReturnType<typeof promptFor>, options: object) => Promise<unknown>
let model: Promise<Generate> | null = null

/** Downloads and starts the model once; later calls share it. `onProgress` gets a fraction between 0 and 1. */
export function loadModel(onProgress: (fraction: number) => void) {
  model ??= (async () => {
    const { pipeline } = await import("@huggingface/transformers")
    const files: Record<string, { loaded: number; total: number }> = {}
    const generator = await pipeline("text-generation", MODEL, {
      dtype: "q4f16",
      device: "webgpu",
      progress_callback: (info) => {
        if (info.status !== "progress") return
        files[info.file] = { loaded: info.loaded, total: info.total }
        const sum = Object.values(files).reduce((acc, file) => [acc[0] + file.loaded, acc[1] + file.total], [0, 0])
        if (sum[1]) onProgress(sum[0] / sum[1])
      },
    })
    return generator as unknown as Generate
  })()
  // Let a failed download be retried.
  model.catch(() => (model = null))
  return model
}

/** The analyzer's explanation rephrased for this sentence. */
export async function personalize(facts: Facts, onProgress: (fraction: number) => void) {
  const generate = await loadModel(onProgress)
  const output = (await generate(promptFor(facts), { max_new_tokens: 160, do_sample: false })) as {
    generated_text: { role: string; content: string }[]
  }[]
  return output[0].generated_text.at(-1)!.content.trim()
}

import { CASE_LABEL, describeForm, formatMatch, GENDER_LABEL } from "@/lib/grammar"
import type { Explanation } from "@/lib/samples"

/** What the learner's own answer would have meant, so they can see why it does not fit. */
export function describeAnswer(answer: string, explanation?: Explanation) {
  const typed = answer.trim()
  if (!typed) return "You left this blank."
  const matches = describeForm(typed)
  if (matches.length === 0) return `"${typed}" is not a form of der, die or das.`
  const forms = matches.map(formatMatch).join(", ")
  if (!explanation) return `"${typed}" is the article for: ${forms}.`
  return `"${typed}" is the article for: ${forms}. Here the sentence needs ${GENDER_LABEL[explanation.gender]} ${CASE_LABEL[explanation.case]}, which is "${explanation.expected}".`
}

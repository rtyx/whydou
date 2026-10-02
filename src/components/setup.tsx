import { useState, type FormEvent } from "react"

import { Button } from "@/components/button"
import { randomSample, SAMPLES } from "@/lib/samples"
import { useQuiz } from "@/stores/quiz-store"

export function Setup() {
  const start = useQuiz((s) => s.start)
  const [text, setText] = useState("")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (text.trim()) start(text)
  }

  const startRandom = () => {
    const sample = randomSample()
    start(sample.text, { source: sample.source, sampleId: sample.id })
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Practise der, die and das in real German
        </h1>
        <p className="mt-3 text-muted">
          Fill in the missing articles of a text. Afterwards you see which ones were wrong, which noun and case they
          belong to and the grammar rule behind each.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <form onSubmit={submit} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <label htmlFor="original" className="text-sm font-medium">
            Paste your own German text
          </label>
          <textarea
            id="original"
            rows={9}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste a German text here…"
            className="block w-full rounded-md border border-border-strong bg-bg p-3 font-serif text-lg leading-relaxed placeholder:text-muted/60 focus:border-ring focus:outline-none"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted">Explanations are written for the built-in texts.</p>
            <Button type="submit" size="lg" disabled={!text.trim()}>
              Start
            </Button>
          </div>
        </form>

        <section aria-labelledby="samples-heading" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 id="samples-heading" className="text-sm font-medium">
              Or choose a built-in text
            </h2>
            <Button variant="ghost" onClick={startRandom} className="-mr-2 h-8">
              Surprise me
            </Button>
          </div>
          <ul className="flex flex-col gap-3">
            {SAMPLES.map((sample) => (
              <li key={sample.id}>
                <button
                  type="button"
                  onClick={() => start(sample.text, { source: sample.source, sampleId: sample.id })}
                  className="flex w-full flex-col gap-1 rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-border-strong hover:bg-surface-2"
                >
                  <span className="font-semibold">{sample.title}</span>
                  <span className="text-xs text-muted">
                    Brothers Grimm · {sample.explanations.length} articles · with explanations
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

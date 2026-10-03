import { useState, type FormEvent } from "react"

import { Button } from "@/components/button"
import { randomSample, type Source } from "@/lib/quiz"

export function TextForm({ onStart }: { onStart(text: string, source?: Source): void }) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const startRandom = async () => {
    setLoading(true)
    const sample = await randomSample()
    onStart(sample.text, sample.source)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (text.trim()) onStart(text)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs tracking-widest text-accent uppercase">Article practice</p>
        <h1 className="font-serif text-5xl leading-[1.05] font-light tracking-tight text-fg sm:text-6xl">
          Read it. <em className="text-sub">Fill in</em> the <em>der, die, das.</em>
        </h1>
        <p className="max-w-xl font-serif text-lg text-sub">
          Paste any German text. Every article becomes a blank, and you bring them back.
        </p>
      </div>

      <textarea
        rows={7}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste a German text…"
        aria-label="German text"
        className="block w-full resize-none rounded-lg bg-bg-deep p-5 font-serif text-xl leading-relaxed text-fg outline-none placeholder:text-sub/70 focus:ring-1 focus:ring-accent/60"
      />

      <div className="flex items-center gap-1 self-center rounded-lg bg-bg-deep p-1">
        <Button type="submit" variant="ghostAccent" disabled={!text.trim()}>
          start
        </Button>
        <Button type="button" variant="outline" onClick={startRandom} disabled={loading}>
          {loading ? "fetching a text…" : "random text"}
        </Button>
      </div>
    </form>
  )
}

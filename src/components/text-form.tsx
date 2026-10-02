import { useState, type FormEvent } from "react"

import { Button } from "@/components/button"
import { randomSample } from "@/lib/quiz"

export function TextForm({ onStart }: { onStart(text: string, source?: string): void }) {
  const [text, setText] = useState("")

  const startRandom = () => {
    const sample = randomSample()
    onStart(sample.text, sample.source)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (text.trim()) onStart(text)
  }

  return (
    <form onSubmit={submit} className="flex flex-col items-stretch gap-2">
      <textarea
        rows={6}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste a German text…"
        aria-label="German text"
        className="block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
      />
      <div className="flex justify-center gap-2">
        <Button type="button" variant="outline" onClick={startRandom}>
          Random
        </Button>
        <Button type="submit" disabled={!text.trim()}>
          Let's go!
        </Button>
      </div>
    </form>
  )
}

import { Button } from "@/components/button"
import { cn } from "@/lib/utils"

type Props = {
  correct: boolean[]
  onRetry(): void
  onNew(): void
}

function verdict(share: number) {
  if (share === 1) return "Perfect. Every article is right."
  if (share >= 0.75) return "Strong result. Check the few below."
  if (share >= 0.5) return "Getting there. Read the explanations below."
  return "Plenty to learn here. Start with the explanations below."
}

export function ResultSummary({ correct, onRetry, onNew }: Props) {
  const total = correct.length
  const score = correct.filter(Boolean).length
  const share = total === 0 ? 0 : score / total

  return (
    <section
      aria-labelledby="result-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Your score</p>
          <h2 id="result-heading" className="text-3xl font-semibold tracking-tight tabular-nums">
            {score} <span className="text-muted">of {total}</span>
          </h2>
        </div>
        <ul className="flex flex-wrap gap-1" aria-label="Result for each article">
          {correct.map((ok, index) => (
            <li key={index}>
              <a
                href={ok ? undefined : `#mistake-${index}`}
                aria-label={`Article ${index + 1}: ${ok ? "correct" : "wrong"}`}
                className={cn("block h-2 w-7 rounded-full", ok ? "bg-good-border" : "bg-bad")}
              />
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">{verdict(share)}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRetry}>
          Retry this text
        </Button>
        <Button onClick={onNew}>New text</Button>
      </div>
    </section>
  )
}

import { Link } from "@tanstack/react-router"

import { CaseBadge, GenderBadge } from "@/components/gender-badge"
import { describeAnswer } from "@/lib/feedback"
import { RULES } from "@/lib/grammar"
import type { Explanation } from "@/lib/samples"
import { cn } from "@/lib/utils"

type Props = {
  order: number
  article: string
  answer: string
  correct: boolean
  context: { before: string; after: string }
  explanation?: Explanation
}

export function MistakeCard({ order, article, answer, correct, context, explanation }: Props) {
  return (
    <article
      id={`mistake-${order}`}
      className={cn(
        "scroll-mt-20 rounded-xl border bg-surface p-5 target:ring-2 target:ring-ring sm:p-6",
        correct ? "border-border" : "border-bad-border",
      )}
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
            correct ? "bg-good-bg text-good" : "bg-bad-bg text-bad",
          )}
        >
          {order + 1}
        </span>
        {explanation && <h3 className="text-base font-semibold">{explanation.phrase}</h3>}
        <div className="flex flex-wrap gap-1.5">
          {explanation && <GenderBadge gender={explanation.gender} />}
          {explanation && <CaseBadge value={explanation.case} />}
          {explanation?.kind === "pronoun" && (
            <span className="inline-flex items-center rounded bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
              pronoun
            </span>
          )}
        </div>
      </header>

      <p className="mt-3 font-serif text-lg text-muted">
        {context.before}{" "}
        <mark className="rounded-sm bg-good-bg px-1 font-sans text-base font-medium text-good">{article}</mark>{" "}
        {context.after}
      </p>

      {!correct && <p className="mt-3 text-sm text-muted">{describeAnswer(answer, explanation)}</p>}

      {explanation ? (
        <p className="mt-3 text-sm leading-relaxed">{explanation.why}</p>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The correct article is <strong className="text-fg">{article}</strong>. Written explanations are available for
          the built-in texts. For your own text, work out the noun's gender and its role in the sentence with the{" "}
          <Link to="/grammar" className="underline underline-offset-2">
            grammar guide
          </Link>
          .
        </p>
      )}

      {explanation && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
          {explanation.rules.map((id) => {
            const rule = RULES[id]
            return (
              <li key={id} className="rounded-md bg-surface-2 px-3 py-2.5 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-medium">{rule.title}</span>
                  <Link to="/grammar" hash={`rule-${id}`} className="text-xs text-muted underline underline-offset-2">
                    More on this rule
                  </Link>
                </div>
                <p className="mt-0.5 text-muted">{rule.summary}</p>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}

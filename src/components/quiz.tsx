import { useMemo } from "react"

import { Button } from "@/components/button"
import { MistakeCard } from "@/components/mistake-card"
import { Passage } from "@/components/passage"
import { ResultSummary } from "@/components/result-summary"
import { articleTokens, contextOf, isCorrect, tokenize } from "@/lib/quiz"
import { sampleById } from "@/lib/samples"
import { useQuiz } from "@/stores/quiz-store"

export function Quiz() {
  const { original, source, sampleId, answers, submitted, setAnswer, submit, retry, reset } = useQuiz()
  const tokens = useMemo(() => tokenize(original), [original])
  const articles = useMemo(() => articleTokens(tokens), [tokens])
  const sample = sampleById(sampleId)

  const results = articles.map((token) => isCorrect(token.article, answers[token.id]))
  const filled = articles.filter((token) => (answers[token.id] ?? "").trim() !== "").length

  const cards = articles.map((token) => (
    <MistakeCard
      key={token.id}
      order={token.order}
      article={token.article}
      answer={answers[token.id] ?? ""}
      correct={results[token.order]}
      context={contextOf(tokens, tokens.indexOf(token))}
      explanation={sample?.explanations[token.order]}
    />
  ))
  const wrong = cards.filter((_, index) => !results[index])
  const right = cards.filter((_, index) => results[index])

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            {submitted ? "Results" : "Fill in der, die or das"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{sample?.title ?? "Your text"}</h1>
          {source && <p className="text-sm text-muted">{source} (public domain)</p>}
        </div>
        {!submitted && (
          <Button variant="ghost" onClick={reset}>
            Choose another text
          </Button>
        )}
      </header>

      {submitted && <ResultSummary correct={results} onRetry={retry} onNew={reset} />}

      <section aria-label="Text" className="rounded-xl border border-border bg-surface p-5 sm:p-10">
        <Passage
          tokens={tokens}
          answers={answers}
          submitted={submitted}
          explanations={sample?.explanations}
          onChange={setAnswer}
        />
      </section>

      {!submitted && (
        <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-4 border-t border-border bg-bg/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <p className="text-sm text-muted tabular-nums" aria-live="polite">
            {filled} of {articles.length} filled
          </p>
          <Button size="lg" onClick={submit} disabled={articles.length === 0}>
            Check answers
          </Button>
        </div>
      )}

      {!submitted && articles.length === 0 && (
        <p className="text-sm text-muted">No articles (der, die, das) found in this text. Choose another one.</p>
      )}

      {submitted && wrong.length > 0 && (
        <section aria-labelledby="wrong-heading" className="flex flex-col gap-4">
          <h2 id="wrong-heading" className="text-lg font-semibold tracking-tight">
            Why these were wrong ({wrong.length})
          </h2>
          {wrong}
        </section>
      )}

      {submitted && right.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-muted select-none hover:text-fg">
            Why the {right.length} correct {right.length === 1 ? "answer is" : "answers are"} right
          </summary>
          <div className="mt-4 flex flex-col gap-4">{right}</div>
        </details>
      )}
    </div>
  )
}

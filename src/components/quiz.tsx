import { useMemo, type FormEvent } from "react"

import { ArticleInput } from "@/components/article-input"
import { Button } from "@/components/button"
import { articlesOf, isCorrect, scoreOf, tokenize } from "@/lib/quiz"
import { useQuiz } from "@/stores/quiz-store"

export function Quiz() {
  const { original, source, answers, submitted, setAnswer, submit, reset } = useQuiz()
  const tokens = useMemo(() => tokenize(original), [original])
  const total = articlesOf(tokens).length

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-stretch gap-4">
      <p className="leading-12">
        {tokens.map((token, index) =>
          token.kind === "text" ? (
            <span key={index}>{token.text}</span>
          ) : (
            <ArticleInput
              key={index}
              article={token.article}
              value={answers[token.id] ?? ""}
              status={!submitted ? "pending" : isCorrect(token.article, answers[token.id]) ? "correct" : "incorrect"}
              disabled={submitted}
              onChange={(value) => setAnswer(token.id, value)}
            />
          ),
        )}
      </p>

      {source && <p className="text-center text-sm text-slate-500">{source} (public domain)</p>}

      {submitted ? (
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-3xl font-semibold">
            Score: {scoreOf(tokens, answers)} / {total}
          </h2>
          <Button type="button" onClick={reset}>
            Try another text
          </Button>
        </div>
      ) : (
        <Button type="submit" className="self-center" disabled={total === 0}>
          Next!
        </Button>
      )}
      {total === 0 && (
        <p className="text-center text-sm text-slate-500">No articles (der, die, das) found in this text.</p>
      )}
    </form>
  )
}

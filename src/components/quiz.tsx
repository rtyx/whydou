import { useMemo, type FormEvent } from "react"

import { ArticleInput } from "@/components/article-input"
import { WrongAnswer } from "@/components/wrong-answer"
import { explainAll, type Explanation } from "@/lib/analyze"
import { Button } from "@/components/button"
import { articlesOf, isCorrect, scoreOf, tokenize } from "@/lib/quiz"
import { useQuiz } from "@/stores/quiz-store"

export function Quiz() {
  const { original, source, answers, submitted, setAnswer, submit, reset } = useQuiz()
  const tokens = useMemo(() => tokenize(original), [original])
  const explanations = useMemo(() => explainAll(tokens), [tokens])
  const total = articlesOf(tokens).length
  const score = scoreOf(tokens, answers)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
      {submitted ? (
        <div className="flex items-end gap-6">
          <p className="font-display text-9xl leading-none font-semibold text-accent">
            {total ? Math.round((score / total) * 100) : 0}
            <span className="text-5xl text-sub">%</span>
          </p>
          <p className="pb-2 text-sm text-sub">
            {score} / {total} correct
          </p>
        </div>
      ) : (
        <p className="text-xs tracking-widest text-sub uppercase">{total} Lücken</p>
      )}

      <article className="font-serif text-4xl leading-[1.8] font-light text-sub">
        {tokens.map((token, index) =>
          token.kind === "text" ? (
            <span key={index}>{token.text}</span>
          ) : (
            <Answer
              key={index}
              article={token.article}
              answer={answers[token.id] ?? ""}
              submitted={submitted}
              explanation={explanations[token.id]}
              onChange={(value) => setAnswer(token.id, value)}
            />
          ),
        )}
      </article>

      {source && (
        <p className="font-serif text-base text-sub italic">
          —{" "}
          {source.url ? (
            <a href={source.url} target="_blank" rel="noreferrer" className="underline hover:text-fg">
              {source.label}
            </a>
          ) : (
            source.label
          )}
          {source.license && (
            <span className="not-italic">
              {" · "}
              {source.licenseUrl ? (
                <a href={source.licenseUrl} target="_blank" rel="noreferrer" className="underline hover:text-fg">
                  {source.license}
                </a>
              ) : (
                source.license
              )}
            </span>
          )}
        </p>
      )}

      <div className="flex items-center gap-1 self-center rounded-lg bg-bg-deep p-1">
        {submitted ? (
          <Button type="button" variant="ghostAccent" onClick={reset}>
            try another text
          </Button>
        ) : (
          <Button type="submit" variant="ghostAccent" disabled={total === 0}>
            check
          </Button>
        )}
      </div>
      {total === 0 && <p className="text-sm text-sub">No articles (der, die, das) found in this text.</p>}
    </form>
  )
}

type AnswerProps = {
  article: string
  answer: string
  submitted: boolean
  explanation: Explanation
  onChange(value: string): void
}

function Answer({ article, answer, submitted, explanation, onChange }: AnswerProps) {
  const correct = isCorrect(article, answer)
  const input = (
    <ArticleInput
      article={article}
      value={answer}
      status={!submitted ? "pending" : correct ? "correct" : "incorrect"}
      disabled={submitted}
      onChange={onChange}
    />
  )
  if (!submitted || correct) return input
  return (
    <WrongAnswer article={article} answer={answer} explanation={explanation}>
      {input}
    </WrongAnswer>
  )
}

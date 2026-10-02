import { ArticleField } from "@/components/article-field"
import { isCorrect, type Token } from "@/lib/quiz"

type Props = {
  tokens: Token[]
  answers: Record<number, string>
  submitted: boolean
  onChange(id: number, value: string): void
}

export function Passage({ tokens, answers, submitted, onChange }: Props) {
  return (
    <p className="font-serif text-xl leading-[2.4] whitespace-pre-line text-fg sm:text-[1.375rem]">
      {tokens.map((token, index) => {
        if (token.kind === "text") return <span key={index}>{token.text}</span>

        const answer = answers[token.id] ?? ""
        if (!submitted) {
          return (
            <ArticleField
              key={index}
              index={token.order}
              value={answer}
              onChange={(value) => onChange(token.id, value)}
            />
          )
        }

        if (isCorrect(token.article, answer)) {
          return (
            <span
              key={index}
              className="rounded-sm border-b-2 border-good-border bg-good-bg px-1.5 font-sans text-base font-medium text-good"
            >
              {token.article}
            </span>
          )
        }

        return (
          <a
            key={index}
            href={`#mistake-${token.order}`}
            title="See why"
            className="mx-0.5 inline-flex items-baseline gap-1.5 rounded-sm border-b-2 border-bad-border bg-bad-bg px-1.5 font-sans text-base font-medium no-underline"
          >
            <s className="text-bad/80">{answer.trim() || "blank"}</s>
            <span className="text-good">{token.article}</span>
          </a>
        )
      })}
    </p>
  )
}

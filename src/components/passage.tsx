import { ArticleField } from "@/components/article-field"
import { WrongArticle } from "@/components/wrong-article"
import { isCorrect, type Token } from "@/lib/quiz"
import type { Explanation } from "@/lib/samples"

type Props = {
  tokens: Token[]
  answers: Record<number, string>
  submitted: boolean
  explanations?: Explanation[]
  onChange(id: number, value: string): void
}

export function Passage({ tokens, answers, submitted, explanations, onChange }: Props) {
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
          <WrongArticle
            key={index}
            order={token.order}
            article={token.article}
            answer={answer}
            explanation={explanations?.[token.order]}
          />
        )
      })}
    </p>
  )
}

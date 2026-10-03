import { cva } from "class-variance-authority"

const input = cva(
  "mx-1 w-[3.4ch] rounded-sm border-b-2 bg-bg-deep px-0.5 text-center align-baseline font-mono text-[0.7em] outline-none placeholder:text-sub/60 focus:border-accent",
  {
    variants: {
      status: {
        pending: "border-sub text-accent",
        correct: "border-ok text-ok",
        incorrect: "border-bad text-bad",
      },
    },
    defaultVariants: { status: "pending" },
  },
)

type Props = {
  article: string
  value: string
  status: "pending" | "correct" | "incorrect"
  disabled: boolean
  onChange(value: string): void
}

export function ArticleInput({ article, value, status, disabled, onChange }: Props) {
  return (
    <input
      type="text"
      value={value}
      placeholder={article[0]}
      disabled={disabled}
      aria-label="Article"
      aria-invalid={status === "incorrect"}
      autoComplete="off"
      spellCheck={false}
      maxLength={3}
      onChange={(event) => onChange(event.target.value)}
      className={input({ status })}
    />
  )
}

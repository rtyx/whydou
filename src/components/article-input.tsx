import { cva } from "class-variance-authority"

const input = cva("m-0.5 w-20 rounded-lg border p-2.5 text-sm focus:ring-2", {
  variants: {
    status: {
      pending:
        "border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400",
      correct: "border-green-500 bg-green-50 text-green-900 focus:ring-green-500 dark:bg-slate-700 dark:text-green-400",
      incorrect: "border-red-500 bg-red-50 text-red-900 focus:ring-red-500 dark:bg-slate-700 dark:text-red-500",
    },
  },
  defaultVariants: { status: "pending" },
})

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
      onChange={(event) => onChange(event.target.value)}
      className={input({ status })}
    />
  )
}

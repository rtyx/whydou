type Props = {
  value: string
  index: number
  onChange(value: string): void
}

/** A blank in the running text. */
export function ArticleField({ value, index, onChange }: Props) {
  return (
    <input
      type="text"
      value={value}
      placeholder="···"
      aria-label={`Article ${index + 1}`}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      maxLength={4}
      onChange={(event) => onChange(event.target.value)}
      className="mx-0.5 h-8 w-14 rounded-sm border-0 border-b-2 border-border-strong bg-surface-2 px-1 text-center font-sans text-base font-medium text-fg placeholder:text-muted/60 focus:border-ring focus:outline-none"
    />
  )
}

export type Token = { kind: "text"; text: string } | { kind: "article"; id: number; order: number; article: string }

// Whole words only, so "wieder" or "dies" are left alone. \b is ASCII-only, hence the Unicode lookarounds.
const ARTICLES = /(?<!\p{L})(die|der|das)(?!\p{L})/giu

/** Splits a text into plain text and articles. The capture group puts articles at the odd indices. */
export function tokenize(text: string): Token[] {
  return text
    .split(ARTICLES)
    .map((part, index): Token =>
      index % 2 === 1
        ? { kind: "article", id: index, order: (index - 1) / 2, article: part }
        : { kind: "text", text: part },
    )
    .filter((token) => token.kind === "article" || token.text !== "")
}

export function articlesOf(tokens: Token[]) {
  return tokens.filter((token) => token.kind === "article")
}

export function isCorrect(article: string, answer: string | undefined) {
  return (answer ?? "").trim().toLowerCase() === article.toLowerCase()
}

export function scoreOf(tokens: Token[], answers: Record<number, string>) {
  return articlesOf(tokens).filter((token) => isCorrect(token.article, answers[token.id])).length
}

type ArticleToken = Extract<Token, { kind: "article" }>

export function articleTokens(tokens: Token[]): ArticleToken[] {
  return tokens.filter((token): token is ArticleToken => token.kind === "article")
}

/** A short piece of the sentence around an article, so a mistake can be read without scrolling back. */
export function contextOf(tokens: Token[], index: number) {
  const previous = tokens[index - 1]
  const next = tokens[index + 1]
  const before = previous?.kind === "text" ? (previous.text.split(/(?<=[.!?:])\s+/).pop() ?? "") : ""
  const after = next?.kind === "text" ? (next.text.split(/(?<=[.!?])\s+/)[0] ?? "") : ""
  return { before: clip(before, 60, "start"), after: clip(after, 60, "end") }
}

function clip(text: string, max: number, side: "start" | "end") {
  if (text.length <= max) return text
  if (side === "end") {
    const cut = text.slice(0, max)
    return cut.slice(0, cut.lastIndexOf(" ")) + "…"
  }
  const cut = text.slice(-max)
  return "…" + cut.slice(cut.indexOf(" "))
}

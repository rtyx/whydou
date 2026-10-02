export type Token = { kind: "text"; text: string } | { kind: "article"; id: number; article: string }

// Whole words only, so "wieder" or "dies" are left alone. \b is ASCII-only, hence the Unicode lookarounds.
const ARTICLES = /(?<!\p{L})(die|der|das)(?!\p{L})/giu

/** Splits a text into plain text and articles. The capture group puts articles at the odd indices. */
export function tokenize(text: string): Token[] {
  return text
    .split(ARTICLES)
    .map((part, index): Token =>
      index % 2 === 1 ? { kind: "article", id: index, article: part } : { kind: "text", text: part },
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

export const SAMPLE_TEXT =
  "Russland hat die Verantwortung für den Angriff auf den Hafen Odessa eingeräumt. Bei dem Beschuss des wichtigsten ukrainischen Schwarzmeerhafens am Samstag seien ein ukrainisches Kriegsschiff sowie ein Lager mit von den USA gelieferten Harpoon-Raketen zerstört worden, teilte die Sprecherin des russischen Außenministeriums, Marija Sacharowa, mit. Nach ukrainischen Angaben wurden bei dem Angriff auch Hafenanlagen getroffen, darunter auch Anlagen zur Verarbeitung von Getreide. Der Angriff war nur einen Tag später erfolgt, nachdem die Regierungen in Moskau und Kiew einem Abkommen über den Export von blockiertem ukrainischem Getreide zugestimmt hatten."

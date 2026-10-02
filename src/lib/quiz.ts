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

export type Sample = { text: string; source: string }

// Brothers Grimm, Kinder- und Hausmärchen (1857 edition). The authors died in 1859 and 1863, so the texts are public domain.
export const SAMPLES: Sample[] = [
  {
    source: "Brüder Grimm, Der Froschkönig",
    text: "In den alten Zeiten, wo das Wünschen noch geholfen hat, lebte ein König, dessen Töchter waren alle schön, aber die jüngste war so schön, dass die Sonne selber, die doch so vieles gesehen hat, sich verwunderte, sooft sie ihr ins Gesicht schien. Nahe bei dem Schlosse des Königs lag ein großer dunkler Wald, und in dem Walde unter einer alten Linde war ein Brunnen. Wenn nun der Tag recht heiß war, so ging das Königskind hinaus in den Wald und setzte sich an den Rand des kühlen Brunnens.",
  },
  {
    source: "Brüder Grimm, Der Wolf und die sieben jungen Geißlein",
    text: "Es war einmal eine alte Geiß, die hatte sieben junge Geißlein und hatte sie so lieb, wie eine Mutter ihre Kinder lieb hat. Eines Tages wollte sie in den Wald gehen und Futter holen. Da rief sie alle sieben herbei und sprach: Liebe Kinder, ich will in den Wald gehen, seid auf der Hut vor dem Wolf. Wenn er hereinkommt, so frisst er euch alle mit Haut und Haaren. Der Bösewicht verstellt sich oft, aber an seiner rauen Stimme und an seinen schwarzen Füßen werdet ihr ihn gleich erkennen.",
  },
  {
    source: "Brüder Grimm, Rotkäppchen",
    text: "Es war einmal eine kleine süße Dirne, die hatte jedermann lieb, der sie nur ansah, am allerliebsten aber ihre Großmutter, die wusste gar nicht, was sie alles dem Kinde geben sollte. Einmal schenkte sie ihm ein Käppchen von rotem Samt, und weil ihm das so wohl stand und es nichts anders mehr tragen wollte, hieß es nur das Rotkäppchen.",
  },
]

export function randomSample(): Sample {
  return SAMPLES[Math.floor(Math.random() * SAMPLES.length)]
}

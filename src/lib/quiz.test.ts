import { describe, expect, it } from "vitest"

import { describeForm, DEFINITE, RULES } from "./grammar"
import { articleTokens, isCorrect, scoreOf, tokenize } from "./quiz"
import { SAMPLES } from "./samples"

describe("tokenize", () => {
  it("only matches whole words", () => {
    const articles = articleTokens(tokenize("Das ist wieder dies und der Dasein Leder die."))
    expect(articles.map((token) => token.article)).toEqual(["Das", "der", "die"])
  })

  it("numbers articles in reading order", () => {
    expect(articleTokens(tokenize("der die das")).map((token) => token.order)).toEqual([0, 1, 2])
  })
})

describe("scoring", () => {
  it("ignores case and surrounding whitespace", () => {
    expect(isCorrect("Der", " der ")).toBe(true)
    expect(isCorrect("die", "der")).toBe(false)
    expect(isCorrect("die", undefined)).toBe(false)
  })

  it("counts correct answers", () => {
    const tokens = tokenize("der Hund und die Katze")
    const [first, second] = articleTokens(tokens)
    expect(scoreOf(tokens, { [first.id]: "der", [second.id]: "das" })).toBe(1)
  })
})

describe("built-in samples", () => {
  for (const sample of SAMPLES) {
    it(`${sample.id}: every article has a matching explanation`, () => {
      const articles = articleTokens(tokenize(sample.text))
      expect(sample.explanations).toHaveLength(articles.length)
      articles.forEach((token, index) => {
        const explanation = sample.explanations[index]
        expect(explanation.expected, `article ${index + 1}`).toBe(token.article.toLowerCase())
        // The stated case and gender must produce the article that is in the text.
        expect(DEFINITE[explanation.case][explanation.gender], `article ${index + 1}`).toBe(explanation.expected)
        for (const rule of explanation.rules) expect(RULES[rule], `rule ${rule}`).toBeDefined()
      })
    })
  }
})

describe("describeForm", () => {
  it("lists every case and gender a form can be", () => {
    expect(describeForm("der")).toHaveLength(4)
    expect(describeForm("DAS")).toEqual([
      { case: "nom", gender: "n" },
      { case: "acc", gender: "n" },
    ])
    expect(describeForm("foo")).toEqual([])
  })
})

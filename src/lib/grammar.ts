export type Gender = "m" | "f" | "n" | "pl"
export type Case = "nom" | "acc" | "dat" | "gen"

export const GENDERS: Gender[] = ["m", "f", "n", "pl"]
export const CASES: Case[] = ["nom", "acc", "dat", "gen"]

export const GENDER_LABEL: Record<Gender, string> = { m: "masculine", f: "feminine", n: "neuter", pl: "plural" }
export const CASE_LABEL: Record<Case, string> = {
  nom: "nominative",
  acc: "accusative",
  dat: "dative",
  gen: "genitive",
}

/** The definite article for each case and gender. */
export const DEFINITE: Record<Case, Record<Gender, string>> = {
  nom: { m: "der", f: "die", n: "das", pl: "die" },
  acc: { m: "den", f: "die", n: "das", pl: "die" },
  dat: { m: "dem", f: "der", n: "dem", pl: "den" },
  gen: { m: "des", f: "der", n: "des", pl: "der" },
}

export const CASE_QUESTION: Record<Case, { question: string; job: string }> = {
  nom: { question: "Wer oder was?", job: "The subject: who or what does the action." },
  acc: { question: "Wen oder was?", job: "The direct object: who or what the action happens to." },
  dat: { question: "Wem?", job: "The indirect object: to whom or for whom." },
  gen: { question: "Wessen?", job: "Possession: whose." },
}

export type FormMatch = { case: Case; gender: Gender }

/** Every case and gender a given article form can stand for ("der" is five of them). */
export function describeForm(form: string): FormMatch[] {
  const wanted = form.trim().toLowerCase()
  const matches: FormMatch[] = []
  for (const c of CASES) {
    for (const g of GENDERS) {
      if (DEFINITE[c][g] === wanted) matches.push({ case: c, gender: g })
    }
  }
  return matches
}

export function formatMatch(match: FormMatch) {
  return `${GENDER_LABEL[match.gender]} ${CASE_LABEL[match.case]}`
}

export type Rule = {
  id: string
  title: string
  summary: string
  points: string[]
  examples: { de: string; en: string }[]
}

const list: Rule[] = [
  {
    id: "nominative",
    title: "Nominative: the subject",
    summary: "Use the nominative for the person or thing that does the action. Ask: wer oder was?",
    points: [
      "Forms: der (masculine), die (feminine), das (neuter), die (plural).",
      "The subject of every clause is nominative, including the subject of a relative clause.",
    ],
    examples: [{ de: "Der Tag war heiß.", en: "The day was hot." }],
  },
  {
    id: "accusative",
    title: "Accusative: the direct object",
    summary: "Use the accusative for the person or thing the action happens to. Ask: wen oder was?",
    points: [
      "Only the masculine changes from the nominative: der becomes den.",
      "After für, durch, gegen, ohne, um and bis the noun is always accusative.",
    ],
    examples: [
      { de: "Ich sehe den Hund.", en: "I see the dog." },
      { de: "Ich sehe die Katze.", en: "I see the cat." },
    ],
  },
  {
    id: "dative",
    title: "Dative: the indirect object",
    summary: "Use the dative for the receiver of something. Ask: wem?",
    points: [
      "Forms: dem (masculine), der (feminine), dem (neuter), den (plural, and the noun gets an -n).",
      "After aus, bei, mit, nach, seit, von and zu the noun is always dative.",
      "Verbs such as helfen, danken and gefallen take the dative.",
    ],
    examples: [{ de: "Ich helfe dem Kind.", en: "I help the child." }],
  },
  {
    id: "genitive",
    title: "Genitive: possession",
    summary: "Use the genitive to say whose something is. Ask: wessen?",
    points: [
      "Forms: des (masculine and neuter, the noun gets -s or -es), der (feminine and plural).",
      "Because der is also feminine dative, check the rest of the sentence to tell the cases apart.",
    ],
    examples: [{ de: "das Haus des Königs", en: "the king's house" }],
  },
  {
    id: "nom-acc-same",
    title: "Nominative and accusative look alike",
    summary: "Only the masculine form changes between subject and object.",
    points: [
      "Feminine: die in both cases. Neuter: das in both. Plural: die in both.",
      "Masculine: der (subject) becomes den (object).",
      "So for feminine, neuter and plural nouns you must work out the role in the sentence, not the form.",
    ],
    examples: [
      { de: "Die Katze sieht den Hund.", en: "The cat sees the dog." },
      { de: "Der Hund sieht die Katze.", en: "The dog sees the cat." },
    ],
  },
  {
    id: "two-way",
    title: "Two-way prepositions",
    summary: "An, auf, hinter, in, neben, über, unter, vor and zwischen take dative or accusative.",
    points: [
      "Dative when the sentence says where something is (wo?).",
      "Accusative when it says where something is going (wohin?).",
    ],
    examples: [
      { de: "Sie ist auf der Hut.", en: "She is on her guard. (wo? dative)" },
      { de: "Sie geht in den Wald.", en: "She goes into the forest. (wohin? accusative)" },
    ],
  },
  {
    id: "nominalized-verb",
    title: "Verbs used as nouns are neuter",
    summary: "When a verb becomes a noun it is capitalised and always takes das.",
    points: ["It works for any verb: wünschen, essen, leben, lesen."],
    examples: [
      { de: "das Wünschen", en: "the wishing" },
      { de: "das Essen", en: "the food, the meal" },
    ],
  },
  {
    id: "diminutive",
    title: "-chen and -lein are always neuter",
    summary: "The little-ending decides the gender, whatever the word is about.",
    points: [
      "Even words for girls and women are neuter: das Mädchen, das Fräulein.",
      "The noun often gets an umlaut: der Mann becomes das Männchen.",
    ],
    examples: [
      { de: "das Käppchen", en: "the little cap" },
      { de: "das Geißlein", en: "the little goat" },
    ],
  },
  {
    id: "compound",
    title: "Compounds take the gender of their last part",
    summary: "Look at the final word, not the first.",
    points: ["The first part can be any gender, it does not matter."],
    examples: [
      { de: "der König + das Kind = das Königskind", en: "the king's child" },
      { de: "böse + der Wicht = der Bösewicht", en: "the villain" },
      { de: "das Haus + die Tür = die Haustür", en: "the front door" },
    ],
  },
  {
    id: "time-masculine",
    title: "Days, months, seasons and parts of the day are masculine",
    summary: "Words for time of day or year take der.",
    points: [
      "der Tag, der Morgen, der Abend, der Montag, der Juli, der Winter.",
      "Exceptions: die Nacht, die Mitternacht.",
    ],
    examples: [{ de: "der Tag", en: "the day" }],
  },
  {
    id: "ending-e",
    title: "Most nouns ending in -e are feminine",
    summary: "A final -e is a good hint for die.",
    points: [
      "die Sonne, die Lampe, die Katze, die Blume.",
      "Exceptions exist: der Name, der Käse, der Junge, das Ende, das Auge.",
    ],
    examples: [{ de: "die Sonne", en: "the sun" }],
  },
  {
    id: "adjective-noun",
    title: "Adjectives used as nouns",
    summary: "The article matches the noun that was left out.",
    points: ["The adjective is capitalised only when the noun is dropped and it stands for a person or thing."],
    examples: [
      { de: "die Jüngste (Tochter)", en: "the youngest (daughter)" },
      { de: "der Alte (Mann)", en: "the old man" },
    ],
  },
  {
    id: "pronoun",
    title: "Der, die, das as pronouns",
    summary: "The same words also stand in for a noun or start a relative clause.",
    points: [
      "A relative pronoun gets its gender and number from the noun it refers to.",
      "It gets its case from its own job inside the relative clause, not from the main clause.",
      "In stories and in speech die, der and das can also mean she, he, it or that one.",
      "The forms match the articles, except dative plural (denen) and the genitive (dessen, deren).",
    ],
    examples: [
      { de: "die Sonne, die viel gesehen hat", en: "the sun, which has seen a lot" },
      { de: "Die hatte jedermann lieb.", en: "Everyone loved her." },
    ],
  },
  {
    id: "predicate-nominative",
    title: "Nominative after sein, werden, bleiben, heißen",
    summary: "These verbs link two things that are the same, so both stay nominative.",
    points: ["There is no object, so the accusative does not apply."],
    examples: [{ de: "Er ist der Lehrer.", en: "He is the teacher." }],
  },
  {
    id: "same-spelling",
    title: "Same spelling, different gender",
    summary: "A few words change meaning with the article.",
    points: [
      "der Hut (the hat) and die Hut (care, guard): auf der Hut sein means to be on one's guard.",
      "der See (the lake) and die See (the sea).",
      "der Leiter (the leader) and die Leiter (the ladder).",
    ],
    examples: [{ de: "auf der Hut sein", en: "to be on one's guard" }],
  },
]

export const RULES: Record<string, Rule> = Object.fromEntries(list.map((rule) => [rule.id, rule]))
export const RULE_LIST = list

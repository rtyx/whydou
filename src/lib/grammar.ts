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

export type FormMatch = { case: Case; gender: Gender }

/** Every case and gender a given article form can stand for ("der" is four of them). */
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

export type Rule = { id: string; title: string; summary: string }

const list: Rule[] = [
  {
    id: "nominative",
    title: "Nominative: the subject",
    summary: "The person or thing that does the action (wer oder was?). Forms: der, die, das, die.",
  },
  {
    id: "accusative",
    title: "Accusative: the direct object",
    summary: "The person or thing the action happens to (wen oder was?). Only the masculine changes: der becomes den.",
  },
  {
    id: "dative",
    title: "Dative: the indirect object",
    summary: "The receiver of something (wem?). Forms: dem (m, n), der (f), den (plural).",
  },
  {
    id: "genitive",
    title: "Genitive: possession",
    summary: "Whose something is (wessen?). Forms: des (m, n), der (f and plural).",
  },
  {
    id: "prep-accusative",
    title: "Prepositions that take the accusative",
    summary: "Durch, für, gegen, ohne, um, bis and entlang are always followed by the accusative.",
  },
  {
    id: "prep-dative",
    title: "Prepositions that take the dative",
    summary: "Aus, außer, bei, mit, nach, seit, von, zu and gegenüber are always followed by the dative.",
  },
  {
    id: "prep-genitive",
    title: "Prepositions that take the genitive",
    summary: "Während, wegen, trotz, statt, innerhalb and außerhalb are followed by the genitive.",
  },
  {
    id: "two-way",
    title: "Two-way prepositions",
    summary:
      "An, auf, hinter, in, neben, über, unter, vor and zwischen take the dative for where (wo?) and the accusative for where to (wohin?).",
  },
  {
    id: "predicate-nominative",
    title: "Nominative after sein, werden, bleiben, heißen",
    summary: "These verbs link two things that are the same, so both stay nominative.",
  },
  {
    id: "genitive-noun",
    title: "A noun in the genitive follows the noun it belongs to",
    summary: "Das Haus des Königs, der Rand des Brunnens. Feminine and plural nouns use der.",
  },
  {
    id: "subject-first",
    title: "A clause starts with its subject",
    summary: "The first noun phrase of a clause is usually the subject, so it is nominative.",
  },
  {
    id: "object-after-subject",
    title: "A second noun phrase is usually an object",
    summary: "When the clause already has a subject, the next one is an object: accusative, or dative for der.",
  },
  {
    id: "nom-acc-same",
    title: "Nominative and accusative look alike",
    summary:
      "Only the masculine changes (der, den). Die, das and plural die are the same in both, so look at the role in the sentence.",
  },
  {
    id: "nominalized-verb",
    title: "Verbs used as nouns are neuter",
    summary: "A verb that becomes a noun is capitalised and always takes das: das Wünschen, das Essen.",
  },
  {
    id: "diminutive",
    title: "-chen and -lein are always neuter",
    summary: "The little-ending decides the gender, whatever the word is about: das Mädchen, das Käppchen.",
  },
  {
    id: "compound",
    title: "Compounds take the gender of their last part",
    summary: "Look at the final word, not the first: der König + das Kind = das Königskind.",
  },
  {
    id: "word-gender",
    title: "Learn the gender with the noun",
    summary:
      "Most German nouns have no rule. The gender is part of the word, so learn it as der Wald, die Sonne, das Haus.",
  },
  {
    id: "time-masculine",
    title: "Days, months and seasons are masculine",
    summary: "Der Tag, der Morgen, der Abend, der Montag, der Juli, der Winter. Exception: die Nacht.",
  },
  {
    id: "ending-e",
    title: "Most nouns ending in -e are feminine",
    summary: "Die Sonne, die Lampe, die Katze, die Blume. Exceptions: der Name, der Junge, das Ende, das Auge.",
  },
  {
    id: "ending-feminine",
    title: "Endings that make a noun feminine",
    summary: "-ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ei, -ur, -enz, -anz and -in are always feminine.",
  },
  {
    id: "ending-masculine",
    title: "Endings that make a noun masculine",
    summary: "-ling, -ismus, -ist, -or, -ig and -ant are masculine.",
  },
  {
    id: "ending-neuter",
    title: "Endings that make a noun neuter",
    summary: "-ment, -um, -nis and -tum are usually neuter.",
  },
  {
    id: "adjective-noun",
    title: "Adjectives used as nouns",
    summary: "The article matches the noun that was left out: die Jüngste (Tochter), der Alte (Mann).",
  },
  {
    id: "pronoun",
    title: "Der, die, das as pronouns",
    summary: "The same words can stand in for a noun: die means she, he or that one in stories and in speech.",
  },
  {
    id: "relative-pronoun",
    title: "Relative pronouns",
    summary:
      "A relative pronoun takes its gender and number from the noun it refers to, and its case from its own job in the relative clause.",
  },
]

export const RULES: Record<string, Rule> = Object.fromEntries(list.map((rule) => [rule.id, rule]))

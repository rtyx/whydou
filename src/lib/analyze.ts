import {
  CASE_LABEL,
  DEFINITE,
  GENDER_LABEL,
  describeForm,
  formatMatch,
  type Case,
  type FormMatch,
  type Gender,
} from "@/lib/grammar"
import type { Token } from "@/lib/quiz"

export type Explanation = {
  /** The article with its adjectives and noun as written in the text, or just the article for a pronoun. */
  phrase: string
  gender: Gender | null
  case: Case | null
  kind: "article" | "pronoun"
  /** Ids from RULES. */
  rules: string[]
  why: string
  /** False when the gender or case is a best guess from the surrounding words rather than a rule. */
  certain: boolean
}

type Form = "der" | "die" | "das"

const PREP_ACC = ["durch", "für", "gegen", "ohne", "um", "bis", "entlang"]
const PREP_DAT = ["aus", "außer", "bei", "mit", "nach", "seit", "von", "zu", "gegenüber"]
const PREP_GEN = ["während", "wegen", "trotz", "statt", "anstatt", "innerhalb", "außerhalb"]
const PREP_TWO = ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"]
const LINKING = ["ist", "war", "sind", "waren", "heißt", "hieß", "bin", "bist", "seid"]
// Words that can follow an article without being an adjective: they show a pronoun, not a noun phrase.
const NOT_ADJECTIVES = [
  ...[
    "sie",
    "er",
    "es",
    "ich",
    "du",
    "wir",
    "ihr",
    "man",
    "nicht",
    "nun",
    "dann",
    "noch",
    "auch",
    "schon",
    "gleich",
    "gar",
  ],
  ...[
    "hat",
    "hatte",
    "hatten",
    "wusste",
    "sagte",
    "sprach",
    "rief",
    "kam",
    "ging",
    "sah",
    "gab",
    "nahm",
    "lag",
    "stand",
    "konnte",
    "wollte",
    "musste",
    "will",
    "kann",
    "muss",
    "soll",
    "sollte",
    "wurde",
    "wird",
    "war",
    "ist",
    "sind",
    "waren",
    "liebte",
    "lebte",
    "fragte",
    "dachte",
    "kannte",
  ],
]
const DETERMINERS = ["der", "die", "das", "ein", "eine", "einen", "einem", "einer"]
const SUBJECT_PRONOUNS = ["ich", "du", "er", "sie", "es", "wir", "ihr", "man"]
const CLAUSE_STARTERS = [
  "dass",
  "wenn",
  "weil",
  "als",
  "ob",
  "wo",
  "und",
  "aber",
  "oder",
  "denn",
  "da",
  "sobald",
  "sooft",
  "während",
  "nachdem",
]

const WORDS = {
  m: "kuchen hut tag morgen abend mittag montag dienstag mittwoch donnerstag freitag samstag sonntag januar februar märz april mai juni juli august september oktober november dezember winter sommer herbst frühling wald baum brunnen könig prinz hund vater bruder sohn mann mensch wolf fuchs bär hase vogel fisch berg fluss see weg platz rand hut stein himmel wind regen schnee kopf arm fuß finger mund tisch stuhl garten hunger durst wicht apfel topf schuh mantel koch jäger müller schneider krieg name junge herr staat preis grund teil anfang ort zug text satz fall kunde käse gedanke wille glaube friede buchstabe schmerz traum wunsch rat ruf lohn schatz bauer hirt ritter graf kaiser mond stern turm hof saal markt lehrer arzt freund feind gast sturm donner blitz fels sand tod geist",
  f: "sonne mutter tochter schwester frau königin katze kuh ziege geiß blume lampe nacht stadt burg tür hand nase welt zeit liebe stimme stunde woche reise straße schule kirche sprache frage antwort arbeit familie geschichte linde erde luft farbe hilfe angst mitternacht kraft macht wand bank uhr milch suppe zahl art hälfte mitte ruine gemeinde region hochzeit prinzessin hexe mauer kammer zisterne brücke maus gans bahn wiese tasche tafel freundin gegend sache nähe höhe länge breite küche wohnung nase brust haut ecke sorge idee lust ruhe not gewalt",
  n: "kind haus schloss wasser jahr jahrhundert land dorf buch auto bild bett fenster feuer geld gesicht herz licht leben wort spiel ding wetter tier pferd schaf huhn ei öl brot fleisch glas mädchen fräulein käppchen gold silber eisen mittel ziel ende auge ohr bein knie recht gebäude gebirge volk blatt kleid hemd zimmer theater museum département stück mal ufer meer ergebnis erlebnis geheimnis geschäft gespräch gericht gras holz tor tal schwert stroh heim grab dach volk gewand",
}

const LEXICON = new Map<string, Gender>()
for (const gender of ["m", "f", "n"] as const) {
  for (const word of WORDS[gender].split(" ")) LEXICON.set(word, gender)
}

const FEMININE_SUFFIX = ["ung", "heit", "keit", "schaft", "ion", "tät", "ik", "ei", "ur", "enz", "anz", "in"]
const MASCULINE_SUFFIX = ["ling", "ismus", "ist", "or", "ig", "ant"]
const NEUTER_SUFFIX = ["ment", "um", "nis", "tum"]

// Infinitives such as machen, wünschen or waschen end in -chen too, but they are not diminutives.
const VERB_LIKE = /(?:[aeiouäöüy]|[nlr]s|[aeoöä]s)chen$/

type GenderEvidence = { gender: Gender; rule: string; why: string }

function genderOf(noun: string): GenderEvidence | null {
  const lower = noun.toLowerCase()

  if (/(chen|lein)$/.test(lower) && !VERB_LIKE.test(lower)) {
    return {
      gender: "n",
      rule: "diminutive",
      why: `${noun} ends in -${lower.endsWith("chen") ? "chen" : "lein"}, and these little-endings are always neuter.`,
    }
  }

  const exact = LEXICON.get(lower)
  if (exact) {
    const time =
      exact === "m" &&
      /^(tag|morgen|abend|mittag|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember|winter|sommer|herbst|frühling)$/.test(
        lower,
      )
    if (time)
      return {
        gender: "m",
        rule: "time-masculine",
        why: `${noun} is a day, month, season or part of the day, and those are masculine.`,
      }
    return {
      gender: exact,
      rule: "word-gender",
      why: `${noun} is ${GENDER_LABEL[exact]}: ${DEFINITE.nom[exact]} ${noun}.`,
    }
  }

  // Compounds: the last part decides, so take the longest known word the noun ends in.
  let best: { word: string; gender: Gender } | null = null
  for (const [word, gender] of LEXICON) {
    if (
      word.length >= 4 &&
      lower.length > word.length &&
      lower.endsWith(word) &&
      (!best || word.length > best.word.length)
    ) {
      best = { word, gender }
    }
  }
  if (best) {
    const last = best.word[0].toUpperCase() + best.word.slice(1)
    return {
      gender: best.gender,
      rule: "compound",
      why: `${noun} is a compound and takes the gender of its last part, ${last}, which is ${GENDER_LABEL[best.gender]}.`,
    }
  }

  const feminine = FEMININE_SUFFIX.find((suffix) => lower.length > suffix.length + 2 && lower.endsWith(suffix))
  if (feminine) return { gender: "f", rule: "ending-feminine", why: `Nouns ending in -${feminine} are feminine.` }
  const masculine = MASCULINE_SUFFIX.find((suffix) => lower.length > suffix.length + 2 && lower.endsWith(suffix))
  if (masculine) return { gender: "m", rule: "ending-masculine", why: `Nouns ending in -${masculine} are masculine.` }
  const neuter = NEUTER_SUFFIX.find((suffix) => lower.length > suffix.length + 2 && lower.endsWith(suffix))
  if (neuter) return { gender: "n", rule: "ending-neuter", why: `Nouns ending in -${neuter} are usually neuter.` }
  if (lower.length > 3 && lower.endsWith("e")) {
    return { gender: "f", rule: "ending-e", why: `${noun} ends in -e, which is a good hint for feminine.` }
  }
  return null
}

type CaseEvidence = { case: Case; rule: string; why: string; certain: boolean }

function lastWord(text: string) {
  return text.match(/([\p{L}-]+)\W*$/u)?.[1]
}

function caseOf(form: Form, before: string): CaseEvidence | null {
  const trimmed = before.trimEnd()
  const previous = /\p{L}$/u.test(trimmed) ? lastWord(trimmed) : undefined
  const lower = previous?.toLowerCase()

  if (lower) {
    if (PREP_ACC.includes(lower))
      return {
        case: "acc",
        rule: "prep-accusative",
        certain: true,
        why: `"${previous}" is always followed by the accusative.`,
      }
    if (PREP_DAT.includes(lower))
      return { case: "dat", rule: "prep-dative", certain: true, why: `"${previous}" is always followed by the dative.` }
    if (PREP_GEN.includes(lower))
      return { case: "gen", rule: "prep-genitive", certain: true, why: `"${previous}" is followed by the genitive.` }
    if (PREP_TWO.includes(lower)) {
      return form === "der"
        ? {
            case: "dat",
            rule: "two-way",
            certain: true,
            why: `"${previous}" is a two-way preposition. With a feminine noun, "der" can only be the dative, which means where something is (wo?).`,
          }
        : {
            case: "acc",
            rule: "two-way",
            certain: true,
            why: `"${previous}" is a two-way preposition. "${form}" has no dative form here, so it is the accusative, which means where something goes (wohin?).`,
          }
    }
    if (LINKING.includes(lower))
      return {
        case: "nom",
        rule: "predicate-nominative",
        certain: true,
        why: `After "${previous}" both sides are the same thing, so the noun stays nominative.`,
      }
    // A capitalised noun right before "der" means "of the ...": the genitive.
    if (
      form === "der" &&
      /^\p{Lu}/u.test(previous!) &&
      !/[.!?:]["„“”»«]*\s*$/.test(before.slice(0, before.length - previous!.length))
    ) {
      return {
        case: "gen",
        rule: "genitive-noun",
        certain: false,
        why: `It follows the noun "${previous}", so it most likely says whose it is: the genitive.`,
      }
    }
  }

  const sentenceStart = /(^|[.!?:]["„“”»«]*)\s*$/.test(before)
  if (sentenceStart)
    return {
      case: "nom",
      rule: "subject-first",
      certain: false,
      why: "It starts the sentence, where the subject usually stands, so it is most likely nominative.",
    }

  const clause = before.slice(Math.max(before.lastIndexOf(","), before.search(/[.!?:;][^.!?:;]*$/)) + 1)
  const words = clause.toLowerCase().match(/[\p{L}-]+/gu) ?? []
  const linking = words.find((word) => LINKING.includes(word))
  if (linking) {
    return {
      case: "nom",
      rule: "predicate-nominative",
      certain: false,
      why: `"${linking}" links two things that are the same, so the noun after it most likely stays nominative.`,
    }
  }
  const pronoun = words.find((word) => SUBJECT_PRONOUNS.includes(word) || DETERMINERS.includes(word))
  if (pronoun) {
    return {
      case: form === "der" ? "dat" : "acc",
      rule: "object-after-subject",
      certain: false,
      why: `The clause already has a subject ("${pronoun}"), so this is most likely an object.`,
    }
  }
  if (CLAUSE_STARTERS.includes(lower ?? "") || /,\s*$/.test(before)) {
    return {
      case: "nom",
      rule: "subject-first",
      certain: false,
      why: "It opens a clause, where the subject usually stands, so it is most likely nominative.",
    }
  }
  return null
}

type Phrase = { text: string; noun: string | null; adjectiveAsNoun: boolean }

/** Reads the words after an article up to the noun: der kühlen Brunnen. */
function phraseAfter(form: string, after: string): Phrase {
  const parts = after.slice(0, 120).match(/[\p{L}-]+|[^\p{L}\s-]+/gu) ?? []
  const words: string[] = []
  for (const part of parts) {
    if (!/^[\p{L}-]+$/u.test(part)) break
    words.push(part)
    if (words.length === 5) break
  }
  for (let i = 0; i < words.length; i++) {
    if (/^\p{Lu}/u.test(words[i])) {
      const before = words.slice(0, i)
      // Anything between the article and the noun has to look like an adjective, not a verb or pronoun.
      const adjectives = before.every(
        (word) => !NOT_ADJECTIVES.includes(word.toLowerCase()) && /(e|en|er|em|es)$/.test(word),
      )
      if (i <= 3 && adjectives) {
        return { text: [form, ...words.slice(0, i + 1)].join(" "), noun: words[i], adjectiveAsNoun: false }
      }
      break
    }
  }
  const first = words[0]?.toLowerCase() ?? ""
  const superlative = /(ste|ere)[nrms]?$/.test(first) && !NOT_ADJECTIVES.includes(first)
  return { text: form, noun: null, adjectiveAsNoun: superlative }
}

function readings(form: Form): FormMatch[] {
  return describeForm(form)
}

function pick(form: Form, gender: Gender | null, caseGuess: Case | null) {
  const all = readings(form)
  const both = all.filter((match) => (!gender || match.gender === gender) && (!caseGuess || match.case === caseGuess))
  if (both.length) return { match: both[0], agrees: true }
  const byCase = all.filter((match) => !caseGuess || match.case === caseGuess)
  if (byCase.length) return { match: byCase[0], agrees: false }
  const byGender = all.filter((match) => !gender || match.gender === gender)
  return { match: byGender[0] ?? all[0], agrees: false }
}

function antecedent(before: string) {
  const text = before.replace(/[\s,]+$/, "")
  const words = text.match(/[\p{L}-]+/gu) ?? []
  for (let i = words.length - 1; i >= Math.max(0, words.length - 5); i--) {
    if (/^\p{Lu}/u.test(words[i])) return words[i]
  }
  return null
}

function explainOne(form: Form, before: string, after: string): Explanation {
  const phrase = phraseAfter(form, after)
  const alternatives = readings(form).map(formatMatch).join(", ")

  // Without a noun the word stands on its own: a pronoun, or an adjective whose noun was left out.
  if (!phrase.noun) {
    const relative = /,\s*$/.test(before)
    const source = relative ? antecedent(before) : null
    const evidence = source ? genderOf(source) : null
    const caseGuess = caseOf(form, before)
    const picked = pick(form, evidence?.gender ?? null, relative ? null : (caseGuess?.case ?? null))
    const rules = phrase.adjectiveAsNoun ? ["adjective-noun"] : relative ? ["relative-pronoun"] : ["pronoun"]
    let why: string
    const adjective = after.trim().split(/[\s,.;:!?]/)[0]
    if (phrase.adjectiveAsNoun) {
      why = `No noun follows "${form}", but "${adjective}" means "${adjective} + a noun that was left out", and the article matches that noun. Here it reads as ${formatMatch(picked.match)}.`
    } else if (relative && source) {
      why = `This "${form}" starts a relative clause and refers back to "${source}". ${evidence ? `${evidence.why} ` : ""}A relative pronoun takes its gender from that noun and its case from its own job in the clause, here most likely ${CASE_LABEL[picked.match.case]}.`
    } else {
      why = `No noun follows "${form}", so it stands in for one, meaning "she", "he", "it" or "that one". "${form}" can be ${alternatives}; here it reads as ${formatMatch(picked.match)}.`
    }
    return {
      phrase: phrase.text,
      gender: picked.match.gender,
      case: picked.match.case,
      kind: "pronoun",
      rules,
      why,
      certain: false,
    }
  }

  const evidence = genderOf(phrase.noun)
  const caseEvidence = caseOf(form, before)
  const nominalized = form === "das" && !evidence && /en$/.test(phrase.noun.toLowerCase())
  const picked = pick(form, nominalized ? "n" : (evidence?.gender ?? null), caseEvidence?.case ?? null)
  const match = picked.match

  const rules: string[] = []
  const parts: string[] = []
  let certain = true

  if (nominalized) {
    rules.push("nominalized-verb")
    parts.push(
      `${phrase.noun} looks like the verb ${phrase.noun.toLowerCase()} used as a noun, and nouns made from verbs are always neuter.`,
    )
  } else if (evidence && picked.agrees) {
    rules.push(evidence.rule)
    parts.push(evidence.why)
    if (evidence.rule === "word-gender" || evidence.rule === "ending-e" || evidence.rule === "compound")
      certain = evidence.rule === "word-gender"
  } else if (evidence) {
    // The guessed gender contradicts the article, so the noun is probably a plural.
    rules.push("word-gender")
    parts.push(
      match.gender === "pl"
        ? `"${form}" does not fit a ${GENDER_LABEL[evidence.gender]} noun here, so ${phrase.noun} is most likely a plural.`
        : `${phrase.noun} reads as ${GENDER_LABEL[match.gender]} here.`,
    )
    certain = false
  } else {
    rules.push("word-gender")
    parts.push(`Gender has to be learned with the noun. Here "${form}" can only be ${alternatives}.`)
    certain = false
  }

  if (caseEvidence) {
    rules.push(caseEvidence.rule)
    parts.push(caseEvidence.why)
    if (!caseEvidence.certain) certain = false
  } else {
    parts.push(`Nothing in the words before it fixes the case, so it reads as ${CASE_LABEL[match.case]}.`)
    certain = false
  }

  if ((match.case === "nom" || match.case === "acc") && match.gender !== "m") rules.push("nom-acc-same")
  parts.push(`So ${phrase.noun} is ${formatMatch(match)}: ${form}.`)

  return {
    phrase: phrase.text,
    gender: match.gender,
    case: match.case,
    kind: "article",
    rules,
    why: parts.join(" "),
    certain,
  }
}

/** One explanation per article token, keyed by token id, read off the surrounding text. */
export function explainAll(tokens: Token[]): Record<number, Explanation> {
  const text = tokens.map((token) => (token.kind === "text" ? token.text : token.article)).join("")
  const result: Record<number, Explanation> = {}
  let offset = 0
  for (const token of tokens) {
    if (token.kind === "text") {
      offset += token.text.length
      continue
    }
    const form = token.article.toLowerCase() as Form
    result[token.id] = explainOne(form, text.slice(0, offset), text.slice(offset + token.article.length))
    offset += token.article.length
  }
  return result
}

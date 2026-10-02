import type { Case, Gender } from "@/lib/grammar"

export type Explanation = {
  /** The article as it appears in the text, lower-cased. Checked against the tokenizer in the tests. */
  expected: "der" | "die" | "das"
  /** The noun phrase the article belongs to. */
  phrase: string
  gender: Gender
  case: Case
  kind: "article" | "pronoun"
  /** Ids from RULES. */
  rules: string[]
  why: string
}

export type Sample = {
  id: string
  title: string
  source: string
  text: string
  /** One entry per article in the text, in reading order. */
  explanations: Explanation[]
}

// Brothers Grimm, Kinder- und Hausmärchen (1857 edition). The authors died in 1859 and 1863, so the texts are public domain.
export const SAMPLES: Sample[] = [
  {
    id: "froschkoenig",
    title: "Der Froschkönig",
    source: "Brüder Grimm, Der Froschkönig",
    text: "In den alten Zeiten, wo das Wünschen noch geholfen hat, lebte ein König, dessen Töchter waren alle schön, aber die jüngste war so schön, dass die Sonne selber, die doch so vieles gesehen hat, sich verwunderte, sooft sie ihr ins Gesicht schien. Nahe bei dem Schlosse des Königs lag ein großer dunkler Wald, und in dem Walde unter einer alten Linde war ein Brunnen. Wenn nun der Tag recht heiß war, so ging das Königskind hinaus in den Wald und setzte sich an den Rand des kühlen Brunnens.",
    explanations: [
      {
        expected: "das",
        phrase: "das Wünschen",
        gender: "n",
        case: "nom",
        kind: "article",
        rules: ["nominalized-verb", "nominative"],
        why: "Wünschen is the verb wünschen (to wish) used as a noun, and nouns made from verbs are always neuter. It is the subject of 'hat geholfen', so it is nominative: das.",
      },
      {
        expected: "die",
        phrase: "die jüngste (Tochter)",
        gender: "f",
        case: "nom",
        kind: "article",
        rules: ["adjective-noun", "nominative"],
        why: "Jüngste stands alone, but it means 'die jüngste Tochter' (the youngest daughter), mentioned just before as 'Töchter'. Tochter is feminine, and the youngest daughter is the subject of 'war so schön', so: die.",
      },
      {
        expected: "die",
        phrase: "die Sonne",
        gender: "f",
        case: "nom",
        kind: "article",
        rules: ["ending-e", "nominative"],
        why: "Sonne ends in -e, which is a good hint for feminine. The sun is the subject of 'sich verwunderte', so nominative feminine: die.",
      },
      {
        expected: "die",
        phrase: "die (Sonne), die doch so vieles gesehen hat",
        gender: "f",
        case: "nom",
        kind: "pronoun",
        rules: ["pronoun", "nominative"],
        why: "This die is a relative pronoun that refers back to 'die Sonne', so it is feminine singular. Inside its own clause it is the one who 'hat gesehen', the subject, so it is nominative: die.",
      },
      {
        expected: "der",
        phrase: "der Tag",
        gender: "m",
        case: "nom",
        kind: "article",
        rules: ["time-masculine", "nominative"],
        why: "Tag is masculine, like all words for days and parts of the day. It is the subject of 'war heiß', so nominative masculine: der.",
      },
      {
        expected: "das",
        phrase: "das Königskind",
        gender: "n",
        case: "nom",
        kind: "article",
        rules: ["compound", "nominative"],
        why: "Königskind is König + das Kind, and a compound takes the gender of its last part, so it is neuter. It is the subject of 'ging', so nominative: das.",
      },
    ],
  },
  {
    id: "geisslein",
    title: "Der Wolf und die sieben jungen Geißlein",
    source: "Brüder Grimm, Der Wolf und die sieben jungen Geißlein",
    text: "Es war einmal eine alte Geiß, die hatte sieben junge Geißlein und hatte sie so lieb, wie eine Mutter ihre Kinder lieb hat. Eines Tages wollte sie in den Wald gehen und Futter holen. Da rief sie alle sieben herbei und sprach: Liebe Kinder, ich will in den Wald gehen, seid auf der Hut vor dem Wolf. Wenn er hereinkommt, so frisst er euch alle mit Haut und Haaren. Der Bösewicht verstellt sich oft, aber an seiner rauen Stimme und an seinen schwarzen Füßen werdet ihr ihn gleich erkennen.",
    explanations: [
      {
        expected: "die",
        phrase: "(eine alte Geiß), die hatte …",
        gender: "f",
        case: "nom",
        kind: "pronoun",
        rules: ["pronoun", "nominative"],
        why: "Die refers back to 'eine alte Geiß' (a nanny goat), which is feminine singular. The goat is the one who 'hatte' seven kids, so it is the subject: nominative, die.",
      },
      {
        expected: "der",
        phrase: "auf der Hut",
        gender: "f",
        case: "dat",
        kind: "article",
        rules: ["same-spelling", "two-way"],
        why: "'Auf der Hut sein' means to be on one's guard. This Hut is feminine (die Hut, protection), not the masculine hat. After 'auf' the sentence says where one should be, not where one goes, so the dative is used, and feminine dative is der.",
      },
      {
        expected: "der",
        phrase: "Der Bösewicht",
        gender: "m",
        case: "nom",
        kind: "article",
        rules: ["compound", "nominative"],
        why: "Bösewicht is böse + der Wicht, so it takes the gender of Wicht: masculine. The villain is the subject of 'verstellt sich', so nominative masculine: der.",
      },
    ],
  },
  {
    id: "rotkaeppchen",
    title: "Rotkäppchen",
    source: "Brüder Grimm, Rotkäppchen",
    text: "Es war einmal eine kleine süße Dirne, die hatte jedermann lieb, der sie nur ansah, am allerliebsten aber ihre Großmutter, die wusste gar nicht, was sie alles dem Kinde geben sollte. Einmal schenkte sie ihm ein Käppchen von rotem Samt, und weil ihm das so wohl stand und es nichts anders mehr tragen wollte, hieß es nur das Rotkäppchen.",
    explanations: [
      {
        expected: "die",
        phrase: "(die Dirne), die hatte jedermann lieb",
        gender: "f",
        case: "acc",
        kind: "pronoun",
        rules: ["pronoun", "accusative", "nom-acc-same"],
        why: "Die stands for the girl (die Dirne, feminine). Read the clause as 'jedermann hatte sie lieb': everyone is the subject, so the girl is the object. That makes it accusative. Feminine accusative looks exactly like the nominative: die.",
      },
      {
        expected: "der",
        phrase: "(jedermann), der sie nur ansah",
        gender: "m",
        case: "nom",
        kind: "pronoun",
        rules: ["pronoun", "nominative"],
        why: "This is a relative pronoun for 'jedermann' (everyone), which is masculine singular. In the clause 'der sie nur ansah' it is the one who looks, the subject, so nominative masculine: der.",
      },
      {
        expected: "die",
        phrase: "(ihre Großmutter), die wusste …",
        gender: "f",
        case: "nom",
        kind: "pronoun",
        rules: ["pronoun", "nominative"],
        why: "A relative pronoun for 'ihre Großmutter', which is feminine singular. The grandmother is the one who 'wusste', the subject, so nominative: die.",
      },
      {
        expected: "das",
        phrase: "(das Käppchen), das so wohl stand",
        gender: "n",
        case: "nom",
        kind: "pronoun",
        rules: ["diminutive", "pronoun", "nominative"],
        why: "Das stands for 'ein Käppchen' from the sentence before. Käppchen ends in -chen, so it is neuter. The cap is what 'stand ihm wohl' (suited him), the subject, so nominative: das. The word 'ihm' is the dative one here.",
      },
      {
        expected: "das",
        phrase: "das Rotkäppchen",
        gender: "n",
        case: "nom",
        kind: "article",
        rules: ["diminutive", "predicate-nominative"],
        why: "Rotkäppchen ends in -chen, so it is neuter even though it is a girl's name. After 'heißen' (to be called) the name is a second nominative, not an object: das.",
      },
    ],
  },
]

export function sampleById(id: string | null) {
  return SAMPLES.find((sample) => sample.id === id)
}

export function randomSample(): Sample {
  return SAMPLES[Math.floor(Math.random() * SAMPLES.length)]
}

// Builds src/lib/nouns.json (noun -> gender) from the German Wiktionary extract by kaikki.org (Wiktextract).
// Data: CC BY-SA 4.0 / GFDL, see README. Usage: node scripts/build-nouns.mjs [dump.jsonl]
// Without an argument the ~1 GB dump is streamed from kaikki.org; nothing is fetched at runtime.
import { createReadStream, writeFileSync } from "node:fs"
import { createInterface } from "node:readline"
import { Readable } from "node:stream"

const SOURCE = "https://kaikki.org/dictionary/German/kaikki.org-dictionary-German.jsonl"
const input = process.argv[2] ? createReadStream(process.argv[2]) : Readable.fromWeb((await fetch(SOURCE)).body)

const seen = new Map() // lowercase noun -> gender, or null once it is ambiguous
for await (const line of createInterface({ input })) {
  if (!line.includes('"noun"') && !line.includes('"name"')) continue
  const entry = JSON.parse(line)
  if ((entry.pos !== "noun" && entry.pos !== "name") || entry.lang_code !== "de") continue
  // Expansion looks like "Flug m (strong, ...)" or "Leute pl (plural only)". A plain "m or n" is truly
  // ambiguous and skipped, but "m or (rare) n" names a primary gender, so the first one wins.
  const word = entry.word
  // Proper nouns are only kept when they carry an article ("die Schweiz f (proper noun, usually definite, ...)").
  const expansion = entry.head_templates?.[0]?.expansion ?? ""
  if (entry.pos === "name" && !expansion.startsWith(`${/^(?:der|die|das) /.exec(expansion)?.[0]}${word}`)) continue
  const gender = expansion
    .replace(/^(?:der|die|das) /, "")
    .slice(word.length)
    .match(/^ (pl|[mfn])(?: or \([^)]*\) [mfn])?(?: \(|$)/)?.[1]
  if (!gender || !/^\p{Lu}[\p{L}]{2,}$/u.test(word)) continue
  const key = word.toLowerCase()
  seen.set(key, seen.has(key) && seen.get(key) !== gender ? null : gender)
}

const out = { m: [], f: [], n: [], pl: [] }
for (const [key, gender] of [...seen].sort()) if (gender) out[gender].push(key)

const json = JSON.stringify(Object.fromEntries(Object.entries(out).map(([g, words]) => [g, words.join(" ")])))
writeFileSync(new URL("../src/lib/nouns.json", import.meta.url), json + "\n")
console.log(
  `${Object.entries(out)
    .map(([g, w]) => g + " " + w.length)
    .join(", ")}, ${(json.length / 1e6).toFixed(2)} MB`,
)

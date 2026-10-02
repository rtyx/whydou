import { createFileRoute } from "@tanstack/react-router"

import { CaseBadge } from "@/components/gender-badge"
import { genderTone } from "@/lib/gender-tone"
import { CASE_LABEL, CASE_QUESTION, CASES, DEFINITE, GENDER_LABEL, GENDERS, RULE_LIST } from "@/lib/grammar"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/grammar")({ component: Grammar })

function Grammar() {
  return (
    <div className="flex flex-col gap-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">German articles at a glance</h1>
        <p className="mt-3 text-muted">
          The article depends on two things: the gender of the noun and its job in the sentence (its case). Learn the
          table below, then the rules that tell you the gender.
        </p>
      </div>

      <section aria-labelledby="table-heading" className="flex flex-col gap-4">
        <h2 id="table-heading" className="text-xl font-semibold tracking-tight">
          Definite articles
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="px-4 py-3 font-medium text-muted">
                  Case
                </th>
                {GENDERS.map((gender) => (
                  <th key={gender} scope="col" className="px-4 py-3">
                    <span className={cn("rounded px-2 py-0.5 text-xs font-medium", genderTone[gender])}>
                      {GENDER_LABEL[gender]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CASES.map((c) => (
                <tr key={c} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {CASE_LABEL[c]}
                  </th>
                  {GENDERS.map((gender) => (
                    <td key={gender} className="px-4 py-3 font-serif text-lg tabular-nums">
                      {DEFINITE[c][gender]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted">
          Notice that der appears four times and die three times. A form on its own never tells you the case: look at
          the noun and the sentence around it.
        </p>
      </section>

      <section aria-labelledby="cases-heading" className="flex flex-col gap-4">
        <h2 id="cases-heading" className="text-xl font-semibold tracking-tight">
          The four cases
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CASES.map((c) => (
            <li key={c} className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <CaseBadge value={c} />
                <span className="font-serif text-lg text-muted italic">{CASE_QUESTION[c].question}</span>
              </div>
              <p className="text-sm">{CASE_QUESTION[c].job}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rules-heading" className="flex flex-col gap-4">
        <h2 id="rules-heading" className="text-xl font-semibold tracking-tight">
          Rules
        </h2>
        <ul className="flex flex-col gap-4">
          {RULE_LIST.map((rule) => (
            <li
              key={rule.id}
              id={`rule-${rule.id}`}
              className="scroll-mt-20 rounded-xl border border-border bg-surface p-5 target:ring-2 target:ring-ring"
            >
              <h3 className="font-semibold">{rule.title}</h3>
              <p className="mt-1 text-sm text-muted">{rule.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {rule.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <dl className="mt-4 flex flex-col gap-1 border-t border-border pt-3">
                {rule.examples.map((example) => (
                  <div key={example.de} className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="font-serif text-lg">{example.de}</dt>
                    <dd className="text-sm text-muted">{example.en}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

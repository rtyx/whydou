import { CASE_LABEL, GENDER_LABEL, type Case, type Gender } from "@/lib/grammar"
import { genderTone as tone } from "@/lib/gender-tone"
import { cn } from "@/lib/utils"

const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"

export function GenderBadge({ gender }: { gender: Gender }) {
  return <span className={cn(base, tone[gender])}>{GENDER_LABEL[gender]}</span>
}

export function CaseBadge({ value }: { value: Case }) {
  return <span className={cn(base, "bg-surface-2 text-fg")}>{CASE_LABEL[value]}</span>
}

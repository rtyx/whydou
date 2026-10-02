import type { Gender } from "@/lib/grammar"

export const genderTone: Record<Gender, string> = {
  m: "bg-masc-bg text-masc",
  f: "bg-fem-bg text-fem",
  n: "bg-neut-bg text-neut",
  pl: "bg-surface-2 text-muted",
}

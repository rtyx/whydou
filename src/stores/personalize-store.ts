import { create } from "zustand"

import { personalize, type Facts } from "@/lib/personalize"

interface PersonalizeState {
  /** Rephrased explanations keyed by the facts they were made from. */
  results: Record<string, string>
  /** Rephrases each explanation in turn, in the background. A newer call stops an older one. */
  personalizeAll(list: Facts[]): Promise<void>
}

export function keyOf({ sentence, article, answer }: Facts) {
  return `${sentence}\u0000${article}\u0000${answer.trim()}`
}

let run = 0

export const usePersonalize = create<PersonalizeState>((set, get) => ({
  results: {},
  personalizeAll: async (list) => {
    const current = ++run
    for (const facts of list) {
      const key = keyOf(facts)
      if (get().results[key]) continue
      try {
        const text = await personalize(facts)
        if (!text) return
        set((state) => ({ results: { ...state.results, [key]: text } }))
      } catch (error) {
        console.warn("Could not personalize an explanation:", error)
      }
      if (run !== current) return
    }
  },
}))

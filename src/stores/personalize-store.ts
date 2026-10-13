import { create } from "zustand"

import { canPersonalize, loadModel, personalize, type Facts } from "@/lib/personalize"

/** "off" means this client lacks the resources; "failed" means it had them but the model did not load. */
export type ModelStatus = "idle" | "checking" | "off" | "loading" | "ready" | "failed"

interface PersonalizeState {
  model: ModelStatus
  /** Download progress, 0 to 1, while the model is loading. */
  progress: number
  /** Rephrased explanations keyed by the facts they were made from. */
  results: Record<string, string>
  /** Explanations queued or being rephrased, keyed like `results`. */
  pending: Record<string, true>
  /** Checks the client and, if it can run the model, downloads and starts it. Safe to call more than once. */
  prepare(): Promise<void>
  /** Rephrases each explanation in turn, in the background. A newer call stops an older one. */
  personalizeAll(list: Facts[]): Promise<void>
}

export function keyOf({ sentence, article, answer }: Facts) {
  return `${sentence}\u0000${article}\u0000${answer.trim()}`
}

let run = 0
let preparing: Promise<void> | null = null

export const usePersonalize = create<PersonalizeState>((set, get) => ({
  model: "idle",
  progress: 0,
  results: {},
  pending: {},
  prepare: () =>
    (preparing ??= (async () => {
      set({ model: "checking" })
      if (!(await canPersonalize())) return set({ model: "off" })
      set({ model: "loading" })
      try {
        await loadModel((progress) => set({ progress }))
        set({ model: "ready" })
      } catch (error) {
        console.warn("Personalized explanations are off:", error)
        set({ model: "failed" })
      }
    })()),
  personalizeAll: async (list) => {
    const current = ++run
    const todo = list.map(keyOf).filter((key) => !get().results[key])
    set({ pending: Object.fromEntries(todo.map((key) => [key, true as const])) })
    await get().prepare()
    for (const facts of list) {
      if (run !== current || get().model !== "ready") break
      const key = keyOf(facts)
      if (get().results[key]) continue
      try {
        const text = await personalize(facts)
        if (text) set((state) => ({ results: { ...state.results, [key]: text } }))
      } catch (error) {
        console.warn("Could not personalize an explanation:", error)
      }
      set((state) => {
        const { [key]: _, ...pending } = state.pending
        return { pending }
      })
    }
    if (run === current) set({ pending: {} })
  },
}))

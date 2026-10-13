import { create } from "zustand"

import { hasWebGpu, personalize, type Facts } from "@/lib/personalize"

type ModelStatus = "idle" | "loading" | "ready" | "unsupported" | "error"
export type Result = { status: "pending" } | { status: "done"; text: string } | { status: "error"; message: string }

interface PersonalizeState {
  model: ModelStatus
  /** Download progress between 0 and 1 while the model is loading. */
  progress: number
  /** Results keyed by the facts they were made from, so they survive the popover closing. */
  results: Record<string, Result>
  request(facts: Facts): Promise<void>
}

export function keyOf({ sentence, article, answer }: Facts) {
  return `${sentence}\u0000${article}\u0000${answer.trim()}`
}

export const usePersonalize = create<PersonalizeState>((set, get) => ({
  model: "idle",
  progress: 0,
  results: {},
  request: async (facts) => {
    const key = keyOf(facts)
    if (get().results[key]?.status === "pending") return
    const setResult = (result: Result) => set((state) => ({ results: { ...state.results, [key]: result } }))
    setResult({ status: "pending" })
    if (get().model !== "ready") {
      if (!(await hasWebGpu())) {
        set({ model: "unsupported" })
        setResult({ status: "error", message: "This browser has no WebGPU, so the model cannot run here." })
        return
      }
      set({ model: "loading" })
    }
    try {
      const text = await personalize(facts, (progress) => set({ progress }))
      set({ model: "ready" })
      setResult({ status: "done", text })
    } catch (error) {
      set({ model: "error" })
      setResult({ status: "error", message: error instanceof Error ? error.message : String(error) })
    }
  },
}))

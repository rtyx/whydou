import { create } from "zustand"

import type { Source } from "@/lib/quiz"

interface QuizState {
  original: string
  source: Source | null
  answers: Record<number, string>
  submitted: boolean
  start(original: string, source?: Source): void
  setAnswer(id: number, value: string): void
  submit(): void
  reset(): void
}

export const useQuiz = create<QuizState>((set) => ({
  original: "",
  source: null,
  answers: {},
  submitted: false,
  start: (original, source) => set({ original, source: source ?? null, answers: {}, submitted: false }),
  setAnswer: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
  submit: () => set({ submitted: true }),
  reset: () => set({ original: "", source: null, answers: {}, submitted: false }),
}))

import { create } from "zustand"

import { randomSample } from "@/lib/quiz"

interface QuizState {
  original: string
  source: string
  answers: Record<number, string>
  submitted: boolean
  start(original: string, source?: string): void
  setAnswer(id: number, value: string): void
  submit(): void
  reset(): void
}

const first = randomSample()

export const useQuiz = create<QuizState>((set) => ({
  // A public-domain text is loaded on every visit, so the quiz is ready as soon as the page opens.
  original: first.text,
  source: first.source,
  answers: {},
  submitted: false,
  start: (original, source = "") => set({ original, source, answers: {}, submitted: false }),
  setAnswer: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
  submit: () => set({ submitted: true }),
  reset: () => set({ original: "", source: "", answers: {}, submitted: false }),
}))

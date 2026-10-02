import { create } from "zustand"

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

export const useQuiz = create<QuizState>((set) => ({
  original: "",
  source: "",
  answers: {},
  submitted: false,
  start: (original, source = "") => set({ original, source, answers: {}, submitted: false }),
  setAnswer: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
  submit: () => set({ submitted: true }),
  reset: () => set({ original: "", source: "", answers: {}, submitted: false }),
}))

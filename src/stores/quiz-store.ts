import { create } from "zustand"

interface QuizState {
  original: string
  answers: Record<number, string>
  submitted: boolean
  start(original: string): void
  setAnswer(id: number, value: string): void
  submit(): void
  reset(): void
}

export const useQuiz = create<QuizState>((set) => ({
  original: "",
  answers: {},
  submitted: false,
  start: (original) => set({ original, answers: {}, submitted: false }),
  setAnswer: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
  submit: () => set({ submitted: true }),
  reset: () => set({ original: "", answers: {}, submitted: false }),
}))

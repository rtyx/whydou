import { create } from "zustand"

type Meta = { source?: string; sampleId?: string }

interface QuizState {
  original: string
  source: string
  /** Set when the text is one of the built-in samples, which have written explanations. */
  sampleId: string | null
  answers: Record<number, string>
  submitted: boolean
  start(original: string, meta?: Meta): void
  setAnswer(id: number, value: string): void
  submit(): void
  /** Same text, answers cleared. */
  retry(): void
  reset(): void
}

export const useQuiz = create<QuizState>((set) => ({
  original: "",
  source: "",
  sampleId: null,
  answers: {},
  submitted: false,
  start: (original, meta = {}) =>
    set({ original, source: meta.source ?? "", sampleId: meta.sampleId ?? null, answers: {}, submitted: false }),
  setAnswer: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
  submit: () => set({ submitted: true }),
  retry: () => set({ answers: {}, submitted: false }),
  reset: () => set({ original: "", source: "", sampleId: null, answers: {}, submitted: false }),
}))

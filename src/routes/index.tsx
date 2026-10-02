import { createFileRoute } from "@tanstack/react-router"

import { Quiz } from "@/components/quiz"
import { TextForm } from "@/components/text-form"
import { useQuiz } from "@/stores/quiz-store"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  const original = useQuiz((s) => s.original)
  const start = useQuiz((s) => s.start)

  return original ? <Quiz /> : <TextForm onStart={start} />
}

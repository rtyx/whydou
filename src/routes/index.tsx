import { createFileRoute } from "@tanstack/react-router"

import { Quiz } from "@/components/quiz"
import { Setup } from "@/components/setup"
import { useQuiz } from "@/stores/quiz-store"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  const hasText = useQuiz((s) => s.original !== "")
  return hasText ? <Quiz /> : <Setup />
}

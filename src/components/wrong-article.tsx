import { useId, useLayoutEffect, useRef, useState } from "react"

import { CaseBadge, GenderBadge } from "@/components/gender-badge"
import { describeAnswer } from "@/lib/feedback"
import type { Explanation } from "@/lib/samples"

type Props = {
  order: number
  article: string
  answer: string
  explanation?: Explanation
}

const MARGIN = 8

/** A wrong answer in the text. Hovering or focusing it shows why, tapping jumps to the full explanation. */
export function WrongArticle({ order, article, answer, explanation }: Props) {
  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const popover = useRef<HTMLSpanElement>(null)
  const id = useId()

  // Keep the popover inside the viewport, however close to an edge the word is.
  useLayoutEffect(() => {
    if (!open || !popover.current) return
    const rect = popover.current.getBoundingClientRect()
    const current = shift
    const left = rect.left - current
    const right = rect.right - current
    let next = 0
    if (left < MARGIN) next = MARGIN - left
    else if (right > window.innerWidth - MARGIN) next = window.innerWidth - MARGIN - right
    if (next !== current) setShift(next)
  }, [open, shift])

  const show = () => setOpen(true)
  const hide = () => {
    setOpen(false)
    setShift(0)
  }

  return (
    <span className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      <a
        href={`#mistake-${order}`}
        aria-describedby={open ? id : undefined}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(event) => event.key === "Escape" && hide()}
        className="mx-0.5 inline-flex items-baseline gap-1.5 rounded-sm border-b-2 border-bad-border bg-bad-bg px-1.5 font-sans text-base font-medium no-underline"
      >
        <s className="text-bad/80">{answer.trim() || "blank"}</s>
        <span className="text-good">{article}</span>
      </a>

      {open && (
        <span
          ref={popover}
          id={id}
          role="tooltip"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
          className="absolute top-full left-1/2 z-20 mt-1 flex w-72 max-w-[calc(100vw-1rem)] flex-col gap-2 rounded-lg border border-border-strong bg-surface p-3 text-left font-sans text-sm leading-snug font-normal text-fg shadow-lg"
        >
          <span className="flex flex-wrap items-center gap-1.5">
            {explanation ? (
              <>
                <strong className="font-semibold">{explanation.phrase}</strong>
                <GenderBadge gender={explanation.gender} />
                <CaseBadge value={explanation.case} />
              </>
            ) : (
              <strong className="font-semibold">Correct: {article}</strong>
            )}
          </span>
          <span className="text-muted">{describeAnswer(answer, explanation)}</span>
          {explanation && <span>{explanation.why}</span>}
          <span className="text-xs text-muted">Click for the full explanation</span>
        </span>
      )}
    </span>
  )
}

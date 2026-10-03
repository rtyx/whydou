import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react"

import type { Explanation } from "@/lib/analyze"
import { CASE_LABEL, GENDER_LABEL, RULES, describeForm, formatMatch } from "@/lib/grammar"

const MARGIN = 8

/** What the learner's own answer would have meant, so they can see why it does not fit. */
function describeAnswer(answer: string) {
  const typed = answer.trim()
  if (!typed) return "You left this blank."
  const matches = describeForm(typed)
  if (matches.length === 0) return `"${typed}" is not a form of der, die or das.`
  return `"${typed}" is the article for: ${matches.map(formatMatch).join(", ")}.`
}

type Props = { article: string; answer: string; explanation: Explanation; children: ReactNode }

/** A wrong answer in the checked text. Hovering or focusing it shows the correct article and why. */
export function WrongAnswer({ article, answer, explanation, children }: Props) {
  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const [above, setAbove] = useState(false)
  const popover = useRef<HTMLSpanElement>(null)
  const id = useId()

  // Keep the popover inside the viewport, however close to an edge the word is.
  useLayoutEffect(() => {
    if (!open || !popover.current) return
    const rect = popover.current.getBoundingClientRect()
    const left = rect.left - shift
    const right = rect.right - shift
    let next = 0
    if (left < MARGIN) next = MARGIN - left
    else if (right > window.innerWidth - MARGIN) next = window.innerWidth - MARGIN - right
    if (next !== shift) setShift(next)
    // Open upwards when it would run off the bottom and there is more room above.
    const wrapper = popover.current.parentElement!.getBoundingClientRect()
    if (!above && rect.bottom > window.innerHeight - MARGIN && wrapper.top > window.innerHeight - wrapper.bottom)
      setAbove(true)
  }, [open, shift, above])

  const show = () => setOpen(true)
  const hide = () => {
    setOpen(false)
    setShift(0)
    setAbove(false)
  }

  return (
    <span
      className="relative inline-block"
      tabIndex={0}
      aria-describedby={open ? id : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(event) => event.key === "Escape" && hide()}
    >
      {children}
      {open && (
        <span
          ref={popover}
          id={id}
          role="tooltip"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
          className={`absolute left-1/2 z-20 flex w-80 max-w-[calc(100vw-1rem)] flex-col gap-2 rounded-lg bg-bg-deep p-4 text-left font-mono text-xs leading-relaxed font-normal text-fg shadow-lg ring-1 ring-sub/40 ${above ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          <span className="flex flex-wrap items-baseline gap-x-2">
            <strong className="text-sm font-semibold text-ok">{article}</strong>
            <span className="font-serif text-base text-fg">{explanation.phrase}</span>
          </span>
          {explanation.gender && explanation.case && (
            <span className="text-accent">
              {GENDER_LABEL[explanation.gender]} · {CASE_LABEL[explanation.case]}
            </span>
          )}
          <span className="text-sub">{describeAnswer(answer)}</span>
          <span>{explanation.why}</span>
          <span className="flex flex-col gap-1 border-t border-sub/30 pt-2 text-sub">
            {explanation.rules.map((rule) => (
              <span key={rule}>
                <span className="text-fg">{RULES[rule].title}.</span> {RULES[rule].summary}
              </span>
            ))}
          </span>
        </span>
      )}
    </span>
  )
}

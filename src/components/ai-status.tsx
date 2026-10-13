import { usePersonalize } from "@/stores/personalize-store"

/** Shows whether the on-device model that rephrases explanations is loading, on, or failed. Hidden when not used. */
export function AiStatus() {
  const model = usePersonalize((state) => state.model)
  const progress = usePersonalize((state) => state.progress)
  const busy = usePersonalize((state) => Object.keys(state.pending).length > 0)

  if (model === "idle" || model === "checking" || model === "off") return null
  const label = {
    loading: `loading ${Math.round(progress * 100)}%`,
    ready: busy ? "rephrasing…" : "on",
    failed: "unavailable",
  }[model]
  const tip = {
    loading: "Downloading a small AI model to rephrase explanations on this device. This happens once.",
    ready: "Explanations of wrong answers are rephrased by an AI model running on this device.",
    failed: "The on-device AI model could not load, so explanations stay rule-based.",
  }[model]

  return (
    <span role="status" title={tip} className="flex items-center gap-1.5 rounded-lg bg-bg-deep px-2.5 py-1.5 text-xs">
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${model === "ready" ? "bg-ok" : model === "failed" ? "bg-sub" : "animate-pulse bg-accent"}`}
      />
      <span className="text-sub">AI</span>
      <span className={`sr-only sm:not-sr-only ${model === "ready" ? "text-fg" : "text-sub"}`}>{label}</span>
    </span>
  )
}

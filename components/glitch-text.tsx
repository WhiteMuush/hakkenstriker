export default function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`relative ${className || ""}`}>
      <span className="relative inline-block">
        {text}
        <span className="absolute top-0 left-0 w-full h-full glitch-effect" aria-hidden="true">
          {text}
        </span>
        <span className="absolute top-0 left-0 w-full h-full glitch-effect-2" aria-hidden="true">
          {text}
        </span>
      </span>
    </div>
  )
}


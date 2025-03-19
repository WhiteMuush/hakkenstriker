export default function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 opacity-5 mix-blend-overlay">
      <div className="absolute inset-0 bg-noise"></div>
    </div>
  )
}


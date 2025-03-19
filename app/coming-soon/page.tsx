"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

// Import des composants
import CustomCursor from "@/components/custom-cursor"
import NoiseOverlay from "@/components/noise-overlay"
import BackgroundElements from "@/components/background-elements"
import GlitchText from "@/components/glitch-text"

export default function ComingSoonPage() {
  // Effet pour masquer le curseur par défaut
  useEffect(() => {
    document.documentElement.classList.add("custom-cursor")
    return () => {
      document.documentElement.classList.remove("custom-cursor")
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white cursor-none flex flex-col items-center justify-center">
      <CustomCursor />
      <NoiseOverlay />
      <BackgroundElements />

      {/* Lignes de grille futuristes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0,rgba(0,0,0,0)_65%)]"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#e11d4810_1px,transparent_1px),linear-gradient(to_bottom,#e11d4810_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      </div>

      <main className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <GlitchText text="COMING SOON" className="text-4xl md:text-6xl font-bold mb-4 text-red-500 text-glow-sm" />
        </motion.div>

        <motion.p
          className="text-xl text-white/70 mb-12 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Cette page est en cours de construction. Revenez bientôt.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-red-500 text-black px-6 py-3 font-medium hover:bg-red-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>RETOUR À L'ACCUEIL</span>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}


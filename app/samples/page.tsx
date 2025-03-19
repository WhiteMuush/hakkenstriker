"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Download, ExternalLink, FileAudio, AudioWaveformIcon as Waveform, Zap, Disc } from "lucide-react"

// Import du nouveau composant CustomCursor
import CustomCursor from "@/components/custom-cursor"
import NoiseOverlay from "@/components/noise-overlay"
import BackgroundElements from "@/components/background-elements"
import GlitchText from "@/components/glitch-text"

// Types pour les sample packs
interface SamplePack {
  id: string
  title: string
  description: string
  image: string
  downloadUrl: string
  fileSize: string
  format: string
  sampleCount: number
  tags: string[]
  featured?: boolean
}

// Données de démonstration pour les sample packs
const samplePacks: SamplePack[] = [
  {
    id: "BRUTAL NUMBER ONE",
    title: "BRUTAL NUMBER EXPENSION (VOL.1)",
    description:
      "One of the most brutal sample packs, 100% free for you. Get ready to destroy your speakers with these heavy kicks.",
    image: "/placeholder.svg?height=500&width=500",
    downloadUrl: "#",
    fileSize: "250 MB",
    format: "WAV 24bit/44.1kHz",
    sampleCount: 120,
    tags: ["Industrial", "Hardstyle", "Screechs"],
    featured: true,
  },
  {
    id: "raw-textures",
    title: "RAW TEXTURES",
    description:
      "Des textures brutes et atmosphériques pour ajouter de la profondeur et du caractère à vos productions.",
    image: "/placeholder.svg?height=500&width=500",
    downloadUrl: "#",
    fileSize: "320 MB",
    format: "WAV 24bit/48kHz",
    sampleCount: 85,
    tags: ["Textures", "Atmosphères", "Industrial", "Raw"],
  },
  {
    id: "distorted-fx",
    title: "DISTORTED FX",
    description: "Effets sonores distordus et traités pour créer des transitions et des impacts percutants.",
    image: "/placeholder.svg?height=500&width=500",
    downloadUrl: "#",
    fileSize: "180 MB",
    format: "WAV 24bit/44.1kHz",
    sampleCount: 95,
    tags: ["FX", "Impacts", "Transitions", "Distortion"],
  },
  {
    id: "screeches-leads",
    title: "SCREECHES & LEADS",
    description: "Leads et screeches agressifs pour vos drops et vos breakdowns les plus intenses.",
    image: "/placeholder.svg?height=500&width=500",
    downloadUrl: "#",
    fileSize: "210 MB",
    format: "WAV 24bit/44.1kHz",
    sampleCount: 75,
    tags: ["Leads", "Screeches", "Synths", "Raw"],
  },
]

// Composant pour afficher un sample pack
function SamplePackCard({ pack, index }: { pack: SamplePack; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`border border-red-500/20 bg-black/30 backdrop-blur-sm relative overflow-hidden
    ${pack.featured ? "md:col-span-2" : ""} hover:shadow-glow-sm transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de bordure néon animée */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 border border-red-500 opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-50" : ""}`}
        ></div>
        <motion.div
          className="absolute -inset-1 border border-red-500 opacity-0"
          animate={{
            opacity: isHovered ? [0, 0.2, 0] : 0,
            scale: isHovered ? [1, 1.02, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
            repeatType: "loop",
          }}
        />
      </div>

      <div className={`grid grid-cols-1 ${pack.featured ? "md:grid-cols-2 gap-8" : "gap-4"} p-6`}>
        <div className="relative aspect-square overflow-hidden border border-red-500/20 mb-4 group">
          <img
            src={pack.image || "/placeholder.svg"}
            alt={pack.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-50"
          />

          {/* Overlay avec effet glitch sur hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="p-4 w-full">
              <div className="flex flex-wrap gap-2 mb-2">
                {pack.tags.map((tag, i) => (
                  <motion.span
                    key={i}
                    className="text-xs bg-red-500/20 text-red-500 px-2 py-1"
                    whileHover={{
                      backgroundColor: "rgba(225, 29, 72, 0.4)",
                      scale: 1.05,
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/70">{pack.sampleCount} samples</span>
                </div>
                <div className="flex items-center gap-2">
                  <Waveform className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/70">{pack.format}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Effet de scan sur l'image */}
          <motion.div
            className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
            initial={{ top: "-10%" }}
            animate={{
              top: isHovered ? ["0%", "100%", "0%"] : "-10%",
            }}
            transition={{
              duration: 3,
              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 relative inline-block">
              {pack.title}
              {isHovered && (
                <motion.span
                  className="absolute -inset-1 bg-red-500/10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </h3>
            <p className="text-white/70 mb-4">{pack.description}</p>
            <p className="text-sm text-white/50 mb-6">Taille: {pack.fileSize}</p>
          </div>

          <motion.a
            href={pack.downloadUrl}
            className="flex items-center justify-center gap-2 bg-red-500 text-black px-4 py-3 font-medium relative overflow-hidden group shadow-glow-sm hover:shadow-glow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Effet de glitch sur le bouton */}
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ opacity: 0, x: "-100%" }}
              whileHover={{
                opacity: [0, 0.4, 0],
                x: ["-100%", "100%", "100%"],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 0.5,
              }}
            />

            <Download className="w-5 h-5" />
            <span className="relative z-10">TÉLÉCHARGER</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default function SamplesPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Filtrer les packs en fonction du tag sélectionné
  const filteredPacks = activeFilter ? samplePacks.filter((pack) => pack.tags.includes(activeFilter)) : samplePacks

  // Extraire tous les tags uniques
  const allTags = Array.from(new Set(samplePacks.flatMap((pack) => pack.tags)))

  // Effet pour masquer le curseur par défaut
  useEffect(() => {
    document.documentElement.classList.add("custom-cursor")
    return () => {
      document.documentElement.classList.remove("custom-cursor")
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white cursor-none">
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

      {/* Header avec navigation de retour */}
      <header className="fixed w-full z-40 px-6 py-6 bg-black/80 backdrop-blur-md border-b border-red-500/10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>RETOUR</span>
            </Link>
            <GlitchText text="SAMPLE PACKS" className="text-xl font-bold text-red-500" />
            <div className="w-24"></div> {/* Spacer pour centrer le titre */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Titre et description avec animation */}
        <div className="mb-12 max-w-3xl relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <GlitchText text="SAMPLE PACKS" className="text-4xl md:text-5xl font-bold mb-4 text-red-500 text-glow-sm" />

            {/* Ligne décorative animée */}
            <motion.div
              className="h-px w-20 bg-red-500 mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ transformOrigin: "left" }}
            />

            <motion.p
              className="text-xl text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Téléchargez mes sample packs exclusifs pour ajouter des sons industriels et raw à vos productions. Tous
              les samples sont 100% libres de droits.
            </motion.p>
          </motion.div>

          {/* Élément décoratif */}
          <motion.div
            className="absolute -right-10 top-0 w-20 h-20 border border-red-500/20 hidden md:block"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 45 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>

        {/* Filtres avec animation */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 border relative overflow-hidden ${!activeFilter ? "border-red-500 text-red-500 shadow-glow-sm" : "border-white/20 text-white/70 hover:border-red-500/50 hover:text-red-500/70"} transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {!activeFilter && (
                <motion.span
                  className="absolute inset-0 bg-red-500/10"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}
              Tous
            </motion.button>

            {allTags.map((tag, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 border relative overflow-hidden ${activeFilter === tag ? "border-red-500 text-red-500 shadow-glow-sm" : "border-white/20 text-white/70 hover:border-red-500/50 hover:text-red-500/70"} transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                {activeFilter === tag && (
                  <motion.span
                    className="absolute inset-0 bg-red-500/10"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                )}
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Liste des sample packs avec animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPacks.map((pack, index) => (
            <SamplePackCard key={pack.id} pack={pack} index={index} />
          ))}
        </div>

        {/* Section d'information avec design futuriste */}
        <motion.div
          className="mt-20 border border-red-500/20 p-8 bg-black/30 backdrop-blur-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 translate-y-1/2 -translate-x-1/2 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <GlitchText text="INFORMATIONS" className="text-2xl font-bold mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-500/10 flex items-center justify-center">
                    <Disc className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold">LICENCE</h3>
                </div>
                <p className="text-white/70 mb-6 pl-11">
                  Tous les samples sont 100% libres de droits. Vous pouvez les utiliser dans vos productions
                  commerciales sans restrictions. Aucune attribution n'est requise.
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-500/10 flex items-center justify-center">
                    <Waveform className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold">FORMAT</h3>
                </div>
                <p className="text-white/70 pl-11">
                  Tous les samples sont fournis au format WAV haute qualité (24bit/44.1kHz ou 48kHz). Ils sont prêts à
                  être utilisés dans n'importe quel DAW.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold">DEMANDES PERSONNALISÉES</h3>
                </div>
                <p className="text-white/70 mb-6 pl-11">
                  Vous recherchez des sons spécifiques? Contactez-moi pour des packs de samples personnalisés adaptés à
                  vos besoins.
                </p>

                <div className="pl-11">
                  <motion.a
                    href="mailto:hakkenstriker@gmail.com"
                    className="inline-flex items-center gap-2 text-red-500 hover:underline relative group"
                    whileHover={{ x: 5 }}
                  >
                    <span>Contactez-moi</span>
                    <ExternalLink className="w-4 h-4" />
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-px bg-red-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Section de témoignages */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlitchText text="TÉMOIGNAGES" className="text-2xl font-bold mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="border border-red-500/20 p-6 bg-black/30 backdrop-blur-sm hover:shadow-glow-sm transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5, borderColor: "rgba(225, 29, 72, 0.4)" }}
            >
              <p className="text-white/70 mb-4">
                "Ces kicks industriels sont exactement ce dont j'avais besoin pour mes productions hardcore. La qualité
                est exceptionnelle et ils s'intègrent parfaitement dans mes tracks."
              </p>
              <p className="text-red-500 font-medium">DJ Destructive</p>
            </motion.div>

            <motion.div
              className="border border-red-500/20 p-6 bg-black/30 backdrop-blur-sm hover:shadow-glow-sm transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5, borderColor: "rgba(225, 29, 72, 0.4)" }}
            >
              <p className="text-white/70 mb-4">
                "Les textures et FX de ces packs sont incroyables. Ils ajoutent une dimension complètement nouvelle à
                mes productions. Merci HakkenStriker!"
              </p>
              <p className="text-red-500 font-medium">RawProducer</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6">PRÊT À AMÉLIORER VOS PRODUCTIONS?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Explorez mes sample packs et donnez à vos tracks cette touche industrielle et raw qui les démarquera de la
            masse.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href="#"
              className="inline-block bg-red-500 text-black px-8 py-4 font-bold text-lg relative overflow-hidden group shadow-glow-md hover:shadow-glow-lg transition-all duration-300"
            >
              <span className="relative z-10">TÉLÉCHARGER MAINTENANT</span>
              <motion.span
                className="absolute inset-0 bg-white/20"
                initial={{ opacity: 0, x: "-100%" }}
                whileHover={{
                  opacity: [0, 0.4, 0],
                  x: ["-100%", "100%", "100%"],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 0.5,
                }}
              />
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-red-500/10 bg-black/80 backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-white/70 mb-4 md:mb-0">
                © {new Date().getFullYear()} HAKKENSTRIKER. Tous droits réservés.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Link href="/" className="text-red-500 hover:underline">
                Retour au site principal
              </Link>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}


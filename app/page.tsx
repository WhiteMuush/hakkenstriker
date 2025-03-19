"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ExternalLink, Menu, X, Zap, Skull, Bomb, Eye, Headphones, Disc, Radio, Volume2 } from "lucide-react"

// Import CustomCursor component
import CustomCursor from "@/components/custom-cursor"

// Types
interface MusicRelease {
  id: string
  title: string
  year: string
  image: string
  spotifyUrl?: string
}

interface YouTubeVideo {
  videoId: string
  videoTitle: string
  thumbnailUrl: string
}

// Mouse follower component
// function MouseFollower() {
//   const cursorRef = useRef<HTMLDivElement>(null)
//   const cursorDotRef = useRef<HTMLDivElement>(null)
//   const mouseX = useMotionValue(0)
//   const mouseY = useMotionValue(0)

//   const smoothX = useSpring(mouseX, { damping: 50, stiffness: 1000 })
//   const smoothY = useSpring(mouseY, { damping: 50, stiffness: 1000 })

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       mouseX.set(e.clientX)
//       mouseY.set(e.clientY)
//     }

//     window.addEventListener("mousemove", handleMouseMove)
//     return () => window.removeEventListener("mousemove", handleMouseMove)
//   }, [mouseX, mouseY])

//   useAnimationFrame(() => {
//     if (cursorRef.current && cursorDotRef.current) {
//       const x = smoothX.get()
//       const y = smoothY.get()
//       cursorRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
//       cursorDotRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
//     }
//   })

//   return (
//     <>
//       <motion.div
//         ref={cursorRef}
//         className="fixed w-8 h-8 rounded-full border border-red-500 pointer-events-none z-[60] hidden md:block"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         style={{ left: 0, top: 0 }}
//       />
//       <motion.div
//         ref={cursorDotRef}
//         className="fixed w-2 h-2 rounded-full bg-red-500 pointer-events-none z-[60] hidden md:block"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         style={{ left: 0, top: 0 }}
//       />
//     </>
//   )
// }

// Noise overlay
function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 opacity-5 mix-blend-overlay">
      <div className="absolute inset-0 bg-noise"></div>
    </div>
  )
}

// Animated background elements
function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-64 rounded-full bg-red-500/5 blur-3xl"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 1],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

// Glitch text effect
function GlitchText({ text, className }: { text: string; className?: string }) {
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

// Text reveal animation
const RevealText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function MusicProfile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { scrollYProgress } = useScroll()
  const progressBar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  // État pour les sorties musicales
  const [musicReleases, setMusicReleases] = useState<MusicRelease[]>([
    {
      id: "loading1",
      title: "Chargement...",
      year: "...",
      image: "/placeholder.svg?height=500&width=500",
    },
    {
      id: "loading2",
      title: "Chargement...",
      year: "...",
      image: "/placeholder.svg?height=500&width=500",
    },
    {
      id: "loading3",
      title: "Chargement...",
      year: "...",
      image: "/placeholder.svg?height=500&width=500",
    },
  ])

  // État pour indiquer le chargement
  const [isLoading, setIsLoading] = useState(true)

  // État pour la vidéo YouTube
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideo>({
    videoId: "RqWwFjE4gxM", // Default fallback video ID
    videoTitle: "Latest Video",
    thumbnailUrl: "",
  })

  // État pour indiquer le chargement de la vidéo YouTube
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(true)

  useEffect(() => {
    // Récupérer les sorties depuis notre API route
    fetch("/api/spotify")
      .then((response) => response.json())
      .then((data) => {
        if (data.releases && data.releases.length > 0) {
          setMusicReleases(data.releases)
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des sorties Spotify:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Récupérer la dernière vidéo YouTube
  useEffect(() => {
    fetch("/api/youtube")
      .then((response) => response.json())
      .then((data) => {
        if (data.videoId) {
          setYoutubeVideo(data)
        }
      })
      .catch((error) => {
        console.error("Error fetching YouTube video:", error)
      })
      .finally(() => {
        setIsYoutubeLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "music", "about", "connect"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const socialLinks = [
    {
      name: "Spotify",
      url: "https://open.spotify.com/intl-fr/artist/3MfxSldgvVispErMvgpqUo?si=i3XO6bHhRW2eZSXuRsLcew",
    },
    { name: "SoundCloud", url: "https://soundcloud.com/hakkenstriker" },
    { name: "YouTube", url: "https://www.youtube.com/@HakkenStriker_official" },
    { name: "Instagram", url: "https://www.instagram.com/hakkenstriker/" },
    { name: "Linktree", url: "https://linktr.ee/hakkenstriker" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const letterAnimation = {
    initial: { y: 100, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1],
      },
    }),
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-black">
      {/* <MouseFollower /> */}
      <CustomCursor />
      <NoiseOverlay />
      <BackgroundElements />

      {/* Effets de glow ambiants */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-[100px]"></div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-red-500 z-50 origin-left"
        style={{ scaleX: progressBar }}
      />

      {/* Header */}
      <header className="fixed w-full z-40 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs tracking-wider opacity-70"
          >
            EST. 2025
          </motion.span>
        </div>

        <div className="hidden md:flex items-center">
          <div className="relative group">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-red-500 font-medium tracking-wider flex items-center justify-center gap-0 py-2 px-4 hover:bg-red-500/10 rounded-sm"
            >
              • UNDERGROUND
            </motion.button>
            <div className="absolute left-0 top-full mt-0 w-40 bg-black border border-red-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-2 flex flex-col">
                <Link
                  href="#about"
                  className="px-4 py-2 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm"
                >
                  ABOUT
                </Link>
                <Link
                  href="#music"
                  className="px-4 py-2 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm"
                >
                  RELEASES
                </Link>
                <Link
                  href="#connect"
                  className="px-4 py-2 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm"
                >
                  CONNECT
                </Link>
                <Link
                  href="/samples"
                  className="px-4 py-2 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm"
                >
                  SAMPLES
                </Link>
                <Link
                  href="/shop"
                  className="px-4 py-2 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm"
                >
                  SHOP
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <Link
              href="/coming-soon"
              className="tracking-wider hover:text-red-500 transition-colors py-2 px-4 hover:bg-red-500/10 rounded-sm"
            >
              SAMPLES •
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <Link
              href="/coming-soon"
              className="tracking-wider hover:text-red-500 transition-colors py-2 px-4 hover:bg-red-500/10 rounded-sm"
            >
              SHOP •
            </Link>
          </motion.div>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40 p-6 pt-24 md:hidden"
        >
          <div className="flex flex-col gap-6">
            <Link
              href="#about"
              className="text-2xl font-bold tracking-wider hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="#music"
              className="text-2xl font-bold tracking-wider hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              RELEASES
            </Link>
            <Link
              href="#connect"
              className="text-2xl font-bold tracking-wider hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              CONNECT
            </Link>
            <Link
              href="/coming-soon"
              className="text-2xl font-bold tracking-wider hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              SAMPLES
            </Link>
            <Link
              href="/coming-soon"
              className="text-2xl font-bold tracking-wider hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              SHOP
            </Link>
            <div className="h-px w-full bg-white/10 my-4"></div>
            <Link
              href="#music"
              className="text-2xl font-bold tracking-wider hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              WORKS
            </Link>
          </div>

          <div className="absolute bottom-8 left-6 right-6">
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm tracking-wider text-white/70 hover:text-red-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full border border-red-500/20"
            style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full border border-red-500/10"
            style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.05, 0.2],
            }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />
          <motion.div
            className="absolute w-[900px] h-[900px] rounded-full border border-red-500/5"
            style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.02, 0.1],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
          />
        </div>

        <div className="container mx-auto px-6 z-20">
          <div className="flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.h1
                className="text-[10vw] md:text-[15vw] font-bold text-red-500 leading-none tracking-tighter flex flex-wrap justify-center text-glow-sm"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              >
                {"HAKKEN".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterAnimation}
                    initial="initial"
                    animate="animate"
                    className="inline-block relative"
                  >
                    {letter}
                    <span className="absolute -inset-0.5 text-red-500 opacity-30 glitch-anim-1">{letter}</span>
                    <span className="absolute -inset-0.5 text-cyan-500 opacity-30 glitch-anim-2">{letter}</span>
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                className="text-[10vw] md:text-[15vw] font-bold text-red-500 leading-none tracking-tighter flex flex-wrap justify-center"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
              >
                {"STRIKER".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterAnimation}
                    initial="initial"
                    animate="animate"
                    className="inline-block relative"
                  >
                    {letter}
                    <span className="absolute -inset-0.5 text-red-500 opacity-30 glitch-anim-1">{letter}</span>
                    <span className="absolute -inset-0.5 text-cyan-500 opacity-30 glitch-anim-2">{letter}</span>
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            <motion.div
              className="w-full md:w-1/2 h-1 bg-red-500 my-4 shadow-glow-md"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex gap-6 mt-8"
            >
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="animate-pulse shadow-glow-sm">
                <Zap className="w-6 h-6 text-red-500" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: -10 }} className="shadow-glow-sm">
                <Skull className="w-6 h-6 text-red-500" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="animate-pulse shadow-glow-sm"
                style={{ animationDelay: "0.5s" }}
              >
                <Bomb className="w-6 h-6 text-red-500" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: -10 }} className="shadow-glow-sm">
                <Eye className="w-6 h-6 text-red-500" />
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-12 text-xl text-center max-w-lg text-white/70"
            >
              BRINGING THE HARDEST INDUSTRIAL BEATS WITH RAW ENERGY AND UNIQUE KICKS⚡
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-16 animate-bounce"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5V19M12 19L5 12M12 19L19 12"
                  stroke="#E11D48"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="min-h-screen py-20 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>

        <div className="container mx-auto px-6 relative z-20">
          <RevealText>
            <GlitchText text="RELEASES" className="text-4xl font-bold mb-4 tracking-tight" />
            <div className="h-px w-20 bg-red-500"></div>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
            {isLoading
              ? // Afficher un état de chargement
                [...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square mb-4 bg-red-500/10"></div>
                    <div className="h-6 bg-red-500/10 w-3/4 mb-2"></div>
                    <div className="h-4 bg-red-500/10 w-1/4"></div>
                  </div>
                ))
              : // Afficher les sorties musicales
                musicReleases.map((release, index) => (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative aspect-square mb-4 overflow-hidden border border-red-500/20">
                      <img
                        src={release.image || "/placeholder.svg?height=500&width=500"}
                        alt={`${release.title} cover`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-50"
                      />
                      <motion.div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <a
                          href={release.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-red-500 text-red-500 px-6 py-2 hover:bg-red-500 hover:text-black transition-colors"
                        >
                          LISTEN NOW
                        </a>
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-red-500 transition-colors">
                      {release.title}
                    </h3>
                    <p className="text-white/70">{release.year}</p>
                  </motion.div>
                ))}
          </div>

          <div className="mt-20 flex justify-center">
            <motion.a
              href="https://open.spotify.com/intl-fr/artist/3MfxSldgvVispErMvgpqUo?si=i3XO6bHhRW2eZSXuRsLcew"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-red-500 text-red-500 px-8 py-3 hover:bg-red-500 hover:text-black transition-colors text-lg font-medium neon-button shadow-glow-sm hover:shadow-glow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW ALL RELEASES
            </motion.a>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
            <RevealText delay={0.1}>
              <div className="flex flex-col items-center text-center">
                <Headphones className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">INDUSTRIAL</h3>
                <p className="text-white/70">Hard-hitting industrial sounds that push boundaries</p>
              </div>
            </RevealText>

            <RevealText delay={0.2}>
              <div className="flex flex-col items-center text-center">
                <Disc className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">XTRA RAW</h3>
                <p className="text-white/70">Unfiltered raw energy in every track</p>
              </div>
            </RevealText>

            <RevealText delay={0.3}>
              <div className="flex flex-col items-center text-center">
                <Radio className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">WEIRD KICKS</h3>
                <p className="text-white/70">Unique kick patterns that break the mold</p>
              </div>
            </RevealText>

            <RevealText delay={0.4}>
              <div className="flex flex-col items-center text-center">
                <Volume2 className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">SMASH HARD</h3>
                <p className="text-white/70">Intense beats designed to shake the underground</p>
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-20 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <RevealText>
              <GlitchText text="ABOUT" className="text-4xl font-bold mb-4 tracking-tight" />
              <div className="h-px w-20 bg-red-500 mb-8"></div>
              <div className="prose prose-invert">
                <p className="text-lg leading-relaxed mb-6">
                  Yo! I'm HakkenStriker <Zap className="inline w-5 h-5 text-red-500" /> I make industrial Xtra Raw with
                  weird kicks bong that smash hard <Skull className="inline w-5 h-5 text-red-500" />
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Always pushing the limits to bring the craziest vibes, from heavy beats to mind-blowing sounds{" "}
                  <Bomb className="inline w-5 h-5 text-red-500" />
                </p>
                <p className="text-lg leading-relaxed">
                  Let's shake the underground together! <Eye className="inline w-5 h-5 text-red-500" />
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-10">
                <motion.div
                  className="border border-red-500/20 p-4 hover:bg-red-500/5 transition-colors"
                  whileHover={{ y: -10 }}
                >
                  <h4 className="text-lg font-bold mb-2">COLLABORATION</h4>
                  <p className="text-white/70">Worked with top underground underground artists</p>
                  <a
                    href="https://linktr.ee/technosphere.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700"
                  >
                    Technosphere
                  </a>
                </motion.div>
              </div>
            </RevealText>

            <RevealText delay={0.2}>
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden border border-red-500/20">
                  {isYoutubeLoading ? (
                    <div className="w-full h-full bg-red-500/10 animate-pulse flex items-center justify-center">
                      <span className="text-white/50">Loading video...</span>
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeVideo.videoId}?`}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={youtubeVideo.videoTitle}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 z-30 relative"
                    />
                  )}
                </div>
                <div className="mt-4"></div>
                <motion.div
                  className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-500"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />

                {/* VU Meter animation */}
                <div className="absolute -left-4 bottom-1/4 w-8 bg-black border border-red-500/20 p-1">
                  <div className="flex flex-col gap-1">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-1 bg-red-500"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: Math.random() }}
                        transition={{
                          duration: 0.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="min-h-screen py-20 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>

        <div className="container mx-auto px-6 relative z-20">
          <RevealText>
            <GlitchText text="CONNECT" className="text-4xl font-bold mb-4 tracking-tight" />
            <div className="h-px w-20 bg-red-500"></div>
          </RevealText>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                variants={item}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 border border-red-500/20 hover:border-red-500 transition-colors group"
                whileHover={{
                  backgroundColor: "rgba(225, 29, 72, 0.05)",
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <span className="text-2xl font-bold tracking-tight group-hover:text-red-500 transition-colors">
                  {link.name}
                </span>
                <ExternalLink className="w-6 h-6 text-white/50 group-hover:text-red-500 transition-colors" />
              </motion.a>
            ))}
          </motion.div>

          <RevealText delay={0.4}>
            <div className="mt-20">
              <h3 className="text-2xl font-bold mb-8 tracking-tight">CONTACT</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg mb-2">For bookings and inquiries:</p>
                  <a href="mailto:hakkenstriker@gmail.com" className="text-xl text-red-500 hover:underline">
                    hakkenstriker@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </RevealText>

          <RevealText delay={0.6}>
            <div className="mt-20 p-8 border border-red-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 translate-y-1/2 -translate-x-1/2 rounded-full blur-xl"></div>

              <h3 className="text-2xl font-bold mb-6 tracking-tight">JOIN THE UNDERGROUND</h3>
              <p className="text-lg mb-8 max-w-2xl">
                Get exclusive updates, unreleased tracks, and early access to tickets for my shows.
              </p>

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-transparent border border-red-500/20 px-4 py-3 focus:outline-none focus:border-red-500 flex-grow"
                />
                <motion.button
                  className="bg-red-500 text-black px-8 py-3 font-medium whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  SUBSCRIBE
                </motion.button>
              </div>
            </div>
          </RevealText>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-red-500/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="mb-6 md:mb-0">
              <motion.span className="text-2xl font-bold text-red-500" whileHover={{ scale: 1.05 }}>
                HAKKENSTRIKER
              </motion.span>
              <p className="text-white/70 mt-2">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>

            <div className="flex gap-6">
              <motion.a href="#" className="text-white/70 hover:text-red-500 transition-colors" whileHover={{ y: -3 }}>
                Privacy
              </motion.a>
              <motion.a href="#" className="text-white/70 hover:text-red-500 transition-colors" whileHover={{ y: -3 }}>
                Terms
              </motion.a>
              <motion.a href="#" className="text-white/70 hover:text-red-500 transition-colors" whileHover={{ y: -3 }}>
                Credits
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


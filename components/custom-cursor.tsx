"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useAnimationFrame } from "framer-motion"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const cursorColorRef = useRef<"light" | "dark">("light")

  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 1000 })
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 1000 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Détecter la couleur de l'élément sous le curseur
      detectBackgroundColor(e.clientX, e.clientY)
    }

    // Fonction pour détecter la couleur de l'arrière-plan
    const detectBackgroundColor = (x: number, y: number) => {
      // Obtenir l'élément sous le curseur
      const element = document.elementFromPoint(x, y) as HTMLElement

      if (element) {
        // Vérifier si l'élément a un attribut data-cursor-color
        const dataCursorColor = element.getAttribute("data-cursor-color")
        if (dataCursorColor === "light" || dataCursorColor === "dark") {
          cursorColorRef.current = dataCursorColor as "light" | "dark"
          return
        }

        // Sinon, obtenir la couleur de fond calculée
        const bgColor = window.getComputedStyle(element).backgroundColor

        // Déterminer si la couleur est claire ou foncée
        if (isLightColor(bgColor)) {
          cursorColorRef.current = "dark"
        } else {
          cursorColorRef.current = "light"
        }
      }
    }

    // Fonction pour déterminer si une couleur est claire ou foncée
    const isLightColor = (color: string): boolean => {
      // Extraire les composantes RGB
      const rgbMatch = color.match(/rgba?$$(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?$$/)

      if (rgbMatch) {
        const r = Number.parseInt(rgbMatch[1], 10)
        const g = Number.parseInt(rgbMatch[2], 10)
        const b = Number.parseInt(rgbMatch[3], 10)

        // Calculer la luminosité (formule standard)
        // Une valeur > 128 est généralement considérée comme claire
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness > 128
      }

      // Par défaut, considérer comme foncé
      return false
    }

    // Ajouter des attributs data-cursor-color aux éléments spécifiques
    const addCursorColorAttributes = () => {
      // Ajouter aux éléments blancs/clairs
      document
        .querySelectorAll('.bg-white, .bg-white\\/80, [class*="from-white"], [class*="to-white"]')
        .forEach((el) => {
          ;(el as HTMLElement).setAttribute("data-cursor-color", "dark")
        })

      // Ajouter aux éléments rouges
      document.querySelectorAll('.bg-red-600, .bg-red-500, [class*="from-red-"], [class*="to-red-"]').forEach((el) => {
        ;(el as HTMLElement).setAttribute("data-cursor-color", "light")
      })

      // Ajouter aux éléments noirs/foncés
      document.querySelectorAll('.bg-black, .bg-gray-900, [class*="from-black"], [class*="to-black"]').forEach((el) => {
        ;(el as HTMLElement).setAttribute("data-cursor-color", "light")
      })
    }

    // Appliquer les attributs après le chargement de la page
    addCursorColorAttributes()

    // Observer les changements dans le DOM pour ajouter les attributs aux nouveaux éléments
    const observer = new MutationObserver(addCursorColorAttributes)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()
    }
  }, [mouseX, mouseY])

  useAnimationFrame(() => {
    if (cursorRef.current && cursorDotRef.current) {
      const x = smoothX.get()
      const y = smoothY.get()
      cursorRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      cursorDotRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`

      // Appliquer les couleurs en fonction de cursorColorRef.current
      if (cursorColorRef.current === "light") {
        cursorRef.current.classList.remove("border-red-600")
        cursorRef.current.classList.add("border-white")
        cursorDotRef.current.classList.remove("bg-red-600")
        cursorDotRef.current.classList.add("bg-white")
      } else {
        cursorRef.current.classList.remove("border-white")
        cursorRef.current.classList.add("border-red-600")
        cursorDotRef.current.classList.remove("bg-white")
        cursorDotRef.current.classList.add("bg-red-600")
      }
    }
  })

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full border border-white pointer-events-none z-[60] hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ left: 0, top: 0 }}
      />
      <motion.div
        ref={cursorDotRef}
        className="fixed w-2 h-2 rounded-full bg-white pointer-events-none z-[60] hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ left: 0, top: 0 }}
      />
    </>
  )
}


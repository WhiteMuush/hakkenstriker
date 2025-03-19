"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { ArrowLeft, ShoppingCart, ExternalLink, Package, Truck, CreditCard, Star } from "lucide-react"

// Import des composants
import CustomCursor from "@/components/custom-cursor"
import NoiseOverlay from "@/components/noise-overlay"
import GlitchText from "@/components/glitch-text"

// Types pour les produits
interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  category: string
  sizes?: string[]
  colors?: string[]
  featured?: boolean
  stock: "in-stock" | "low-stock" | "out-of-stock"
  isLimited?: boolean
}

// Données de démonstration pour les produits de la collaboration
const products: Product[] = [
  {
    id: "legends-tshirt",
    name: "T-SHIRT HAKKEN X LEGEND/S",
    description:
      "T-shirt exclusif de la collaboration HAKKENSTRIKER x LEGEND/S. Coupe oversize avec impression sérigraphie.",
    image: "/placeholder.svg?height=500&width=500",
    price: 39.99,
    category: "Vêtements",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blanc", "Rouge"],
    featured: true,
    stock: "in-stock",
    isLimited: true,
  },
  {
    id: "legends-hoodie",
    name: "HOODIE INDUSTRIAL LEGENDS",
    description: "Hoodie premium avec logo HAKKENSTRIKER x LEGEND/S brodé. Édition limitée numérotée.",
    image: "/placeholder.svg?height=500&width=500",
    price: 69.99,
    category: "Vêtements",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Blanc", "Noir"],
    stock: "low-stock",
    isLimited: true,
  },
  {
    id: "legends-cap",
    name: "CASQUETTE LEGENDS RAW",
    description: "Casquette snapback co-brandée avec logo LEGEND/S et patch HAKKENSTRIKER. Ajustable.",
    image: "/placeholder.svg?height=500&width=500",
    price: 29.99,
    category: "Accessoires",
    colors: ["Blanc", "Rouge"],
    stock: "in-stock",
  },
  {
    id: "legends-vinyl",
    name: "VINYLE COLLECTOR HAKKEN X LEGEND/S",
    description: "Vinyle édition spéciale avec artwork exclusif LEGEND/S. Inclut 2 titres inédits de la collaboration.",
    image: "/placeholder.svg?height=500&width=500",
    price: 34.99,
    category: "Musique",
    stock: "low-stock",
    isLimited: true,
  },
  {
    id: "legends-tote",
    name: "TOTE BAG LEGEND/S",
    description:
      "Tote bag en coton bio avec impression HAKKENSTRIKER x LEGEND/S. Parfait pour transporter vos vinyles.",
    image: "/placeholder.svg?height=500&width=500",
    price: 19.99,
    category: "Accessoires",
    colors: ["Blanc"],
    stock: "in-stock",
  },
  {
    id: "legends-jacket",
    name: "VESTE BOMBER LEGENDS INDUSTRIAL",
    description: "Veste bomber premium avec patches HAKKENSTRIKER et broderie LEGEND/S. Doublure personnalisée.",
    image: "/placeholder.svg?height=500&width=500",
    price: 129.99,
    category: "Vêtements",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Noir", "Rouge"],
    stock: "in-stock",
    isLimited: true,
  },
]

// Composant pour les formes 3D en arrière-plan
function Background3D() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grille 3D */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:40px_40px] transform-gpu [transform-style:preserve-3d] [perspective:1000px] rotate-x-60 scale-[2]"></div>

      {/* Formes 3D flottantes */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-lg bg-gradient-to-tr from-red-600/5 to-white/10 backdrop-blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transformStyle: "preserve-3d",
            perspective: "1000px",
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          initial={{
            rotateX: Math.random() * 180,
            rotateY: Math.random() * 180,
            rotateZ: Math.random() * 180,
            z: Math.random() * -500,
          }}
          animate={{
            rotateX: [Math.random() * 180, Math.random() * 180],
            rotateY: [Math.random() * 180, Math.random() * 180],
            rotateZ: [Math.random() * 180, Math.random() * 180],
            z: [Math.random() * -500, Math.random() * -500],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Composant pour afficher un produit avec effet 3D
function ProductCard3D({ product, index }: { product: Product; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Valeurs pour l'effet de rotation 3D
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  // Fonction pour gérer le mouvement de la souris sur la carte
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
  }

  // Fonction pour afficher le statut du stock
  const getStockStatus = (stock: string) => {
    switch (stock) {
      case "in-stock":
        return <span className="text-green-500">En stock</span>
      case "low-stock":
        return <span className="text-yellow-500">Stock limité</span>
      case "out-of-stock":
        return <span className="text-red-500">Épuisé</span>
      default:
        return <span className="text-white/70">Vérifier le stock</span>
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.7,
        type: "spring",
        stiffness: 100,
      }}
      className={`relative overflow-hidden ${product.featured ? "md:col-span-2" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl overflow-hidden"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 20px 40px rgba(220, 38, 38, 0.2), 0 0 20px rgba(220, 38, 38, 0.1), inset 0 0 10px rgba(255, 2, 2, 0.81)"
            : "0 10px 30px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Badge édition limitée avec effet 3D */}
        {product.isLimited && (
          <motion.div
            className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 text-xs font-bold"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isHovered ? [0, 10, 0] : 0 }}
            transition={{ duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 5px 15px rgba(220, 38, 38, 0.3)",
              transform: "translateZ(5px)",
            }}
          >
            ÉDITION LIMITÉE
          </motion.div>
        )}

        <div className={`grid grid-cols-1 ${product.featured ? "md:grid-cols-2 gap-8" : "gap-4"} p-6`}>
          <div className="relative aspect-square overflow-hidden rounded-lg group">
            {/* Image avec effet de profondeur */}
            <motion.img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{
                transformStyle: "preserve-3d",
                transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
                transition: "transform 0.3s ease",
              }}
              whileHover={{ scale: 1.05 }}
            />

            {/* Overlay avec effet 3D */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(40px)",
              }}
            >
              <div className="p-4 w-full">
                <div className="flex flex-wrap gap-2 mb-2">
                  <motion.span
                    className="text-xs bg-white text-red-600 px-2 py-1 font-bold"
                    whileHover={{ scale: 1.1, z: 50 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {product.category}
                  </motion.span>
                  {product.stock === "low-stock" && (
                    <motion.span
                      className="text-xs bg-yellow-500 text-white px-2 py-1 font-bold"
                      whileHover={{ scale: 1.1, z: 50 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      Stock limité
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Effet de scan 3D */}
            <motion.div
              className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"
              initial={{ top: "-10%" }}
              animate={{
                top: isHovered ? ["0%", "100%", "0%"] : "-10%",
                filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
              }}
              transition={{
                duration: 3,
                repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                repeatType: "loop",
                ease: "linear",
              }}
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(10px)",
              }}
            />
          </div>

          <div className="flex flex-col justify-between" style={{ transformStyle: "preserve-3d" }}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.h3
                  className="text-xl md:text-2xl font-bold tracking-tight text-black"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {product.name}
                </motion.h3>
                {product.isLimited && (
                  <motion.div
                    animate={{
                      rotateY: isHovered ? [0, 360, 0] : 0,
                    }}
                    transition={{
                      duration: 3,
                      repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                      repeatType: "loop",
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(25px)",
                    }}
                  >
                    <Star className="w-5 h-5 text-red-600 fill-red-600" />
                  </motion.div>
                )}
              </div>

              <motion.p
                className="text-gray-700 mb-4"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isHovered ? "translateZ(15px)" : "translateZ(0px)",
                  transition: "transform 0.3s ease",
                }}
              >
                {product.description}
              </motion.p>

              <motion.div
                className="flex items-center gap-4 mb-6"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isHovered ? "translateZ(25px)" : "translateZ(0px)",
                  transition: "transform 0.3s ease",
                }}
              >
                <p className="text-xl font-bold text-red-600">{formatPrice(product.price)}</p>
                <p className="text-sm text-gray-500">{getStockStatus(product.stock)}</p>
              </motion.div>

              {product.colors && (
                <motion.div
                  className="mb-4"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <p className="text-sm text-gray-700 mb-2 font-medium">Couleurs:</p>
                  <div className="flex gap-2">
                    {product.colors.map((color, i) => (
                      <motion.div
                        key={i}
                        className={`w-6 h-6 rounded-full border ${
                          color.toLowerCase() === "noir"
                            ? "bg-black border-gray-300"
                            : color.toLowerCase() === "rouge"
                              ? "bg-red-600 border-red-600"
                              : color.toLowerCase() === "blanc"
                                ? "bg-white border-gray-300"
                                : "bg-gray-500 border-gray-500"
                        }`}
                        title={color}
                        whileHover={{
                          scale: 1.2,
                          boxShadow:
                            color.toLowerCase() === "rouge"
                              ? "0 0 15px rgba(220, 38, 38, 0.7)"
                              : "0 0 15px rgba(255, 255, 255, 0.7)",
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {product.sizes && (
                <motion.div
                  className="mb-4"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <p className="text-sm text-gray-700 mb-2 font-medium">Tailles:</p>
                  <div className="flex gap-2">
                    {product.sizes.map((size, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-red-600 hover:text-red-600 transition-colors"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 0 10px rgba(220, 38, 38, 0.3)",
                          backgroundColor: "rgba(220, 38, 38, 0.05)",
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {size}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{
                scale: product.stock !== "out-of-stock" ? 1.05 : 1,
                boxShadow: "0 10px 25px rgba(220, 38, 38, 0.4)",
              }}
              whileTap={{ scale: product.stock !== "out-of-stock" ? 0.98 : 1 }}
              disabled={product.stock === "out-of-stock"}
              style={{
                transformStyle: "preserve-3d",
                transform: isHovered ? "translateZ(40px)" : "translateZ(0px)",
                transition: "transform 0.3s ease",
              }}
            >
              {/* Effet de glitch sur le bouton */}
              {product.stock !== "out-of-stock" && (
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
              )}

              <ShoppingCart className="w-5 h-5" />
              <span className="relative z-10">{product.stock === "out-of-stock" ? "ÉPUISÉ" : "AJOUTER AU PANIER"}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Composant pour le titre 3D
function Title3D({ text }: { text: string }) {
  const words = text.split(" ")

  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {words.map((word, i) => (
        <motion.div
          key={i}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.7, type: "spring" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.span
            className="text-3xl md:text-4xl font-bold text-red-600"
            whileHover={{
              rotateY: [0, 10, -10, 0],
              z: [0, 30, 0],
              color: ["#dc2626", "#ffffff", "#dc2626"],
              textShadow: [
                "0 0 5px rgba(220, 38, 38, 0.7)",
                "0 0 20px rgba(220, 38, 38, 0.9)",
                "0 0 5px rgba(220, 38, 38, 0.7)",
              ],
            }}
            transition={{ duration: 1 }}
            style={{
              display: "inline-block",
              transformStyle: "preserve-3d",
              textShadow: "0 0 5px rgba(220, 38, 38, 0.7)",
            }}
          >
            {word}
          </motion.span>
        </motion.div>
      ))}
    </div>
  )
}

// Composant pour le bouton 3D
function Button3D({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative bg-red-600 text-white px-6 py-3 font-bold overflow-hidden"
      whileHover={{
        scale: 1.05,
        boxShadow: [
          "0 10px 25px rgba(220, 38, 38, 0.4)",
          "0 10px 25px rgba(220, 38, 38, 0.6)",
          "0 10px 25px rgba(220, 38, 38, 0.4)",
        ],
      }}
      whileTap={{ scale: 0.98 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500"
        initial={{ opacity: 0 }}
        whileHover={{
          opacity: 1,
          background: [
            "linear-gradient(to right, rgba(220, 38, 38, 1), rgba(239, 68, 68, 1))",
            "linear-gradient(to right, rgba(239, 68, 68, 1), rgba(220, 38, 38, 1))",
            "linear-gradient(to right, rgba(220, 38, 38, 1), rgba(239, 68, 68, 1))",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%" }}
        whileHover={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          repeatDelay: 0.5,
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Filtrer les produits en fonction de la catégorie sélectionnée
  const filteredProducts = activeCategory ? products.filter((product) => product.category === activeCategory) : products

  // Extraire toutes les catégories uniques
  const allCategories = Array.from(new Set(products.map((product) => product.category)))

  // Effet pour masquer le curseur par défaut
  useEffect(() => {
    document.documentElement.classList.add("custom-cursor")
    return () => {
      document.documentElement.classList.remove("custom-cursor")
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white cursor-none overflow-hidden">
      <CustomCursor />
      <NoiseOverlay />
      <Background3D />

      {/* Barre de progression 3D */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-50"
        style={{
          scaleX,
          transformOrigin: "0%",
          boxShadow: "0 0 10px rgba(220, 38, 38, 0.7)",
        }}
      />

      {/* Header avec navigation de retour */}
      <header className="fixed w-full z-40 px-6 py-6 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white hover:text-red-600 transition-colors">
              <motion.div whileHover={{ x: -5 }} style={{ transformStyle: "preserve-3d" }}>
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <motion.span
                whileHover={{
                  textShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
                }}
              >
                RETOUR
              </motion.span>
            </Link>

            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.img
                src="/placeholder.svg?height=40&width=120"
                alt="LEGEND/S"
                className="h-8"
                whileHover={{
                  rotateY: [0, 10, -10, 0],
                  z: [0, 20, 0],
                  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))",
                }}
                transition={{ duration: 1 }}
                style={{ transformStyle: "preserve-3d" }}
              />
              <motion.span
                className="text-red-600 font-bold text-xl"
                whileHover={{
                  rotateY: [0, 180, 360],
                  scale: [1, 1.2, 1],
                  textShadow: "0 0 10px rgba(220, 38, 38, 0.8)",
                }}
                transition={{ duration: 1.5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                X
              </motion.span>
              <GlitchText text="HAKKENSTRIKER" className="text-xl font-bold text-white" />
            </motion.div>

            <div className="w-24 flex justify-end">
              <motion.div
                className="relative"
                whileHover={{
                  scale: 1.2,
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <ShoppingCart className="w-5 h-5 text-white hover:text-red-600 transition-colors" />
                <motion.span
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    delay: 1,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 0 10px rgba(220, 38, 38, 0.7)",
                  }}
                >
                  0
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Bannière de collaboration 3D */}
        <motion.div
          className="mb-16 relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white p-8 rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 20px 50px rgba(220, 38, 38, 0.3)",
          }}
        >
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div style={{ transformStyle: "preserve-3d" }}>
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{
                  transformStyle: "preserve-3d",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                }}
                animate={{
                  z: [0, 20, 0],
                  textShadow: [
                    "0 0 10px rgba(255, 255, 255, 0.3)",
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                    "0 0 10px rgba(255, 255, 255, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                HAKKENSTRIKER X LEGEND/S
              </motion.h1>
              <motion.p
                className="text-white/90 max-w-xl"
                style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}
              >
                Une collaboration exclusive entre HAKKENSTRIKER et la marque streetwear LEGEND/S. Des pièces uniques au
                design industriel et minimaliste.
              </motion.p>
            </div>
            <motion.div
              className="bg-white text-red-600 px-6 py-3 font-bold"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(30px)",
              }}
            >
              COLLECTION LIMITÉE
            </motion.div>
          </div>
        </motion.div>

        {/* Titre 3D */}
        <div className="mb-12">
          <Title3D text="COLLECTION EXCLUSIVE" />

          <motion.div
            className="h-px w-40 bg-red-600 mt-4 mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              transformOrigin: "left",
              boxShadow: "0 0 10px rgba(220, 38, 38, 0.7)",
            }}
          />

          <motion.p
            className="text-xl text-white/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            Découvrez notre collection exclusive en collaboration avec LEGEND/S. Chaque pièce est conçue pour fusionner
            l'esthétique industrielle de HAKKENSTRIKER avec le design minimaliste de LEGEND/S.
          </motion.p>
        </div>

        {/* Filtres avec animation 3D */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-wrap gap-4">
            <motion.button
              onClick={() => setActiveCategory(null)}
              className={`px-6 py-3 relative overflow-hidden ${!activeCategory ? "bg-red-600 text-white" : "bg-white/10 backdrop-blur-md text-white hover:bg-red-600/20"} transition-colors`}
              whileHover={{
                scale: 1.05,
                boxShadow: !activeCategory ? "0 0 20px rgba(220, 38, 38, 0.7)" : "0 0 15px rgba(255, 255, 255, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.span
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(10px)",
                }}
              >
                Tous
              </motion.span>
            </motion.button>

            {allCategories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 relative overflow-hidden ${activeCategory === category ? "bg-red-600 text-white" : "bg-white/10 backdrop-blur-md text-white hover:bg-red-600/20"} transition-colors`}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    activeCategory === category
                      ? "0 0 20px rgba(220, 38, 38, 0.7)"
                      : "0 0 15px rgba(255, 255, 255, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.span
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(10px)",
                  }}
                >
                  {category}
                </motion.span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Liste des produits avec animation 3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredProducts.map((product, index) => (
            <ProductCard3D key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Section d'information avec design 3D */}
        <motion.div
          className="mt-24 bg-white/5 backdrop-blur-lg p-8 rounded-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(220, 38, 38, 0.1)",
          }}
        >
          {/* Éléments décoratifs 3D */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
          />

          <div className="relative z-10">
            <motion.h2
              className="text-2xl font-bold mb-8 text-red-600"
              style={{
                transformStyle: "preserve-3d",
                textShadow: "0 0 10px rgba(220, 38, 38, 0.5)",
              }}
              whileInView={{
                z: [0, 20, 0],
                textShadow: [
                  "0 0 10px rgba(220, 38, 38, 0.5)",
                  "0 0 20px rgba(220, 38, 38, 0.7)",
                  "0 0 10px rgba(220, 38, 38, 0.5)",
                ],
              }}
              viewport={{ once: true }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              À PROPOS DE LA COLLABORATION
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-red-600/20 flex items-center justify-center rounded-lg"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      scale: 1.1,
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                    }}
                    transition={{ duration: 1 }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(20px)",
                    }}
                  >
                    <Package className="w-6 h-6 text-red-600" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(15px)",
                    }}
                  >
                    LIVRAISON
                  </motion.h3>
                </div>
                <motion.p
                  className="text-white/70 mb-8 pl-16"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(10px)",
                  }}
                >
                  Livraison mondiale disponible. Expédition sous 48h pour les articles en stock. Suivi de colis fourni
                  par email.
                </motion.p>

                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-red-600/20 flex items-center justify-center rounded-lg"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      scale: 1.1,
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                    }}
                    transition={{ duration: 1 }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(20px)",
                    }}
                  >
                    <Truck className="w-6 h-6 text-red-600" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(15px)",
                    }}
                  >
                    RETOURS
                  </motion.h3>
                </div>
                <motion.p
                  className="text-white/70 pl-16"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(10px)",
                  }}
                >
                  Retours acceptés sous 14 jours pour les articles non portés et dans leur emballage d'origine.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-red-600/20 flex items-center justify-center rounded-lg"
                    whileHover={{
                      rotate: [0, 10, -10, 0],
                      scale: 1.1,
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
                    }}
                    transition={{ duration: 1 }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(20px)",
                    }}
                  >
                    <CreditCard className="w-6 h-6 text-red-600" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(15px)",
                    }}
                  >
                    PAIEMENT
                  </motion.h3>
                </div>
                <motion.p
                  className="text-white/70 mb-8 pl-16"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(10px)",
                  }}
                >
                  Paiements sécurisés par carte bancaire, PayPal ou virement. Toutes les transactions sont cryptées.
                </motion.p>

                <div className="pl-16">
                  <motion.a
                    href="mailto:contact@legends-brand.com"
                    className="inline-flex items-center gap-2 text-red-600 hover:underline relative group"
                    whileHover={{
                      x: 5,
                      textShadow: "0 0 10px rgba(220, 38, 38, 0.7)",
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(15px)",
                    }}
                  >
                    <span>Questions? Contactez-nous</span>
                    <ExternalLink className="w-4 h-4" />
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-px bg-red-600"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        transformOrigin: "left",
                        boxShadow: "0 0 5px rgba(220, 38, 38, 0.7)",
                      }}
                    />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Section à propos de Legend/s avec effet 3D */}
        <motion.div
          className="mt-24 bg-gradient-to-r from-red-600 to-red-500 text-white p-8 rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 20px 50px rgba(220, 38, 38, 0.3)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              whileInView={{ z: [0, 20, 0] }}
              viewport={{ once: true }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.h2
                className="text-3xl font-bold mb-4"
                style={{
                  transformStyle: "preserve-3d",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                }}
              >
                À PROPOS DE LEGEND/S
              </motion.h2>
              <motion.p className="mb-4" style={{ transformStyle: "preserve-3d" }}>
                LEGEND/S est une marque de streetwear qui fusionne l'esthétique minimaliste avec des influences
                industrielles. Fondée en 2020, la marque s'est rapidement imposée dans l'univers de la mode underground.
              </motion.p>
              <motion.p style={{ transformStyle: "preserve-3d" }}>
                Cette collaboration avec HAKKENSTRIKER représente la rencontre parfaite entre la musique industrielle et
                le design contemporain, créant des pièces uniques qui reflètent l'énergie brute des deux univers.
              </motion.p>

              <Button3D>
                <div className="flex items-center gap-2">
                  DÉCOUVRIR LEGEND/S
                  <ExternalLink className="w-4 h-4" />
                </div>
              </Button3D>
            </motion.div>

            <motion.div
              className="aspect-square bg-white/10 rounded-lg flex items-center justify-center overflow-hidden"
              whileInView={{
                rotateY: [0, 10, -10, 0],
                rotateX: [0, 5, -5, 0],
              }}
              viewport={{ once: true }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
              }}
            >
              <motion.img
                src="/placeholder.svg?height=400&width=400"
                alt="LEGEND/S Brand"
                className="w-3/4 h-3/4 object-contain"
                whileInView={{
                  z: [0, 50, 0],
                  scale: [1, 1.05, 1],
                }}
                viewport={{ once: true }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                style={{ transformStyle: "preserve-3d" }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Call to action 3D */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.h2
            className="text-3xl font-bold mb-6"
            style={{
              transformStyle: "preserve-3d",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
            }}
            whileInView={{
              z: [0, 30, 0],
              textShadow: [
                "0 0 10px rgba(255, 255, 255, 0.3)",
                "0 0 20px rgba(255, 255, 255, 0.5)",
                "0 0 10px rgba(255, 255, 255, 0.3)",
              ],
            }}
            viewport={{ once: true }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            ÉDITION LIMITÉE
          </motion.h2>
          <motion.p className="text-white/70 mb-12 max-w-2xl mx-auto" style={{ transformStyle: "preserve-3d" }}>
            Cette collection HAKKENSTRIKER x LEGEND/S est disponible en quantité limitée. Chaque pièce est numérotée et
            ne sera pas rééditée.
          </motion.p>

          <Button3D>VOIR TOUTE LA COLLECTION</Button3D>
        </motion.div>
      </main>

      {/* Footer 3D */}
      <footer className="py-12 border-t border-white/10 bg-black/50 backdrop-blur-lg relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="flex items-center gap-4 mb-8 md:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.img
                src="/placeholder.svg?height=40&width=120"
                alt="LEGEND/S"
                className="h-8"
                whileHover={{
                  rotateY: [0, 360],
                  z: [0, 30, 0],
                }}
                transition={{ duration: 1.5 }}
                style={{ transformStyle: "preserve-3d" }}
              />
              <motion.span
                className="text-red-600 font-bold"
                whileHover={{
                  scale: 1.2,
                  rotate: [0, 10, -10, 0],
                  textShadow: "0 0 10px rgba(220, 38, 38, 0.7)",
                }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                X
              </motion.span>
              <motion.span
                className="font-bold"
                whileHover={{
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                HAKKENSTRIKER
              </motion.span>
            </motion.div>

            <motion.div
              className="flex flex-col md:flex-row gap-6 items-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.p className="text-white/70" style={{ transformStyle: "preserve-3d" }}>
                © {new Date().getFullYear()} LEGEND/S & HAKKENSTRIKER
              </motion.p>

              <div className="flex gap-6">
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    z: 20,
                    textShadow: "0 0 10px rgba(220, 38, 38, 0.7)",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link href="/" className="text-red-600 hover:underline">
                    Accueil
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    z: 20,
                    textShadow: "0 0 10px rgba(220, 38, 38, 0.7)",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link href="/samples" className="text-red-600 hover:underline">
                    Samples
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}


"use client"

import { useEffect, useRef } from "react"

interface LottieAnimationProps {
  type: "hearts" | "stars" | "sparkles"
}

export default function LottieAnimation({ type }: LottieAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      symbol: string
    }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const symbols = {
      hearts: "❤️",
      stars: "⭐",
      sparkles: "✨",
    }

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * -3 - 2,
        life: 1,
        symbol: symbols[type],
      }
    }

    const particles = particlesRef.current
    let animationId: number
    let frameCount = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new particles occasionally
      if (frameCount % 10 === 0 && particles.length < 30) {
        particles.push(createParticle())
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.y += p.vy
        p.x += p.vx
        p.life -= 0.01
        p.vy += 0.1 // gravity

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.globalAlpha = p.life
        ctx.font = "32px Arial"
        ctx.textAlign = "center"
        ctx.fillText(p.symbol, p.x, p.y)
      }

      ctx.globalAlpha = 1
      frameCount++
      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [type])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}

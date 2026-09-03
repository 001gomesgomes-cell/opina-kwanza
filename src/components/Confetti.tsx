import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const COLORS = ['#1877F2', '#31A24C', '#F7B928', '#E41E3F', '#8B5CF6', '#F97316']

interface Particle {
  id: number
  x: number
  color: string
  size: number
  delay: number
  duration: number
  rotate: number
}

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!active) { setParticles([]); return }
    const ps: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 1.5,
      rotate: Math.random() * 360,
    }))
    setParticles(ps)
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: -10, width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

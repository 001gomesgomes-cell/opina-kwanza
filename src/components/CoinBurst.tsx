import { motion, AnimatePresence } from 'framer-motion'

interface CoinBurstProps {
  active: boolean
}

const COINS = [
  { x: -40, delay: 0 },
  { x: 0, delay: 0.06 },
  { x: 40, delay: 0.12 },
  { x: -20, delay: 0.18 },
  { x: 20, delay: 0.24 },
]

export function CoinBurst({ active }: CoinBurstProps) {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          {COINS.map((c, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl select-none"
              style={{ x: c.x }}
              initial={{ y: 0, opacity: 1, scale: 0.5 }}
              animate={{ y: -180, opacity: [1, 1, 0], scale: [0.5, 1.2, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: c.delay, ease: 'easeOut' }}
            >
              🪙
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

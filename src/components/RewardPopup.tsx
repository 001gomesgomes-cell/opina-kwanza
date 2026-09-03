import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Trophy } from 'lucide-react'

interface RewardPopupProps {
  visible: boolean
  reward: number
  balance: number
  postIndex: number
  totalPosts: number
  onNext: () => void
}

function useCountUp(target: number, active: boolean, duration = 800) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (!active) { setValue(0); return }
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [active, target, duration])

  return value
}

export function RewardPopup({ visible, reward, balance, postIndex, totalPosts, onNext }: RewardPopupProps) {
  const animatedReward = useCountUp(reward, visible)
  const animatedBalance = useCountUp(balance, visible)
  const isLast = postIndex === totalPosts

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
              {/* Top section */}
              <div className="bg-gradient-to-b from-[#31A24C] to-[#27873E] px-6 pt-8 pb-6 text-center">
                <motion.div
                  className="text-5xl mb-3"
                  animate={{ rotate: [0, -10, 10, -5, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  🪙
                </motion.div>
                <p className="text-white/80 text-sm font-medium mb-1">Avaliação concluída!</p>
                <div className="text-white text-3xl font-black">
                  +{animatedReward.toLocaleString('pt-AO')} Kz
                </div>
                <p className="text-white/70 text-xs mt-1">virtuais</p>
              </div>

              {/* Balance section */}
              <div className="px-6 py-5">
                <div className="bg-[#F0F2F5] rounded-xl p-4 text-center mb-4">
                  <p className="text-[#65676B] text-xs mb-1">Saldo acumulado</p>
                  <div className="text-[#1877F2] text-2xl font-black">
                    {animatedBalance.toLocaleString('pt-AO')} Kz
                  </div>
                </div>

                {/* Progress pills */}
                <div className="flex justify-center gap-2 mb-5">
                  {Array.from({ length: totalPosts }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i < postIndex
                          ? 'bg-[#31A24C] flex-1'
                          : 'bg-[#E4E6EB] flex-1'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={onNext}
                  className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base active:scale-95 transition-transform"
                  aria-label={isLast ? 'Ver resultado final' : 'Avaliar próxima publicação'}
                >
                  {isLast ? (
                    <>
                      <Trophy size={20} />
                      VER MEU RESULTADO
                    </>
                  ) : (
                    <>
                      AVALIAR PRÓXIMA PUBLICAÇÃO
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>

                <p className="text-[#65676B] text-[11px] text-center mt-3 leading-snug">
                  Recompensa virtual desta simulação — não levantável.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

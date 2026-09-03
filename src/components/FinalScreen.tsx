import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ThumbsUp, ThumbsDown, RotateCcw, Info } from 'lucide-react'
import type { EvaluationResult } from '../types'
import { POSTS } from '../data/posts'
import { Confetti } from './Confetti'

interface FinalScreenProps {
  results: EvaluationResult[]
  onRestart: () => void
  onClaim: () => void
}

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export function FinalScreen({ results, onRestart, onClaim }: FinalScreenProps) {
  const total = results.reduce((s, r) => s + r.reward, 0)
  const animated = useCountUp(total)

  return (
    <>
      <Confetti active />
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center px-4 py-8 safe-top safe-bottom">
        <div className="w-full max-w-[640px] space-y-4">

          {/* Facebook logo */}
          <div className="flex justify-center pt-2">
            <img src="/images/facebook-logo.svg" alt="Facebook" className="h-10 w-auto rounded-lg" />
          </div>

          {/* Trophy hero */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm overflow-hidden text-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <div className="bg-gradient-to-b from-[#F7B928] to-[#E6A800] px-6 pt-8 pb-6">
              <motion.div
                className="text-7xl mb-3"
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatDelay: 3 }}
              >
                🏆
              </motion.div>
              <h2 className="text-white text-2xl font-black">Desafio concluído!</h2>
              <p className="text-white/80 text-sm mt-1">Avaliaste as 5 publicações.</p>
            </div>

            <div className="px-6 py-6">
              <p className="text-[#65676B] text-sm mb-1">Saldo virtual total</p>
              <motion.div
                className="text-5xl font-black text-[#31A24C] leading-none"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              >
                {animated.toLocaleString('pt-AO')}
              </motion.div>
              <p className="text-[#31A24C] font-bold text-lg">Kz VIRTUAIS</p>

              {/* Full progress bar */}
              <div className="mt-4 mb-2">
                <div className="flex justify-between text-xs text-[#65676B] mb-1">
                  <span>Progresso</span>
                  <span>5 de 5 avaliações concluídas ✓</span>
                </div>
                <div className="bg-[#E4E6EB] rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#31A24C] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Seal */}
              <div className="flex items-center justify-center gap-2 mt-3 bg-[#F0F2F5] rounded-full px-4 py-2 inline-flex mx-auto">
                <CheckCircle2 size={16} className="text-[#31A24C]" />
                <span className="text-[#31A24C] text-xs font-bold">5 de 5 avaliações concluídas</span>
              </div>
            </div>
          </motion.div>

          {/* Answers summary */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E4E6EB]">
              <h3 className="font-bold text-[#050505] text-sm">Resumo das tuas respostas</h3>
            </div>
            {results.map((r, i) => {
              const post = POSTS[r.postId - 1]
              return (
                <motion.div
                  key={r.postId}
                  className="flex items-center gap-3 px-4 py-3 border-b border-[#E4E6EB] last:border-0"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center text-xs font-bold text-[#65676B] flex-shrink-0">
                    {r.postId}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#050505] text-sm font-medium truncate">{post?.profile}</p>
                    <p className="text-[#65676B] text-xs">+{r.reward.toLocaleString('pt-AO')} Kz virtuais</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                    r.answer === 'like' ? 'bg-[#E7F3FF] text-[#1877F2]' : 'bg-[#FFEBEE] text-[#E41E3F]'
                  }`}>
                    {r.answer === 'like' ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
                    {r.answer === 'like' ? 'Gostei' : 'Não gostei'}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <div className="bg-[#FFF3CD] border border-[#FFC107] rounded-xl px-4 py-3 flex gap-3">
            <Info size={18} className="text-[#856404] flex-shrink-0 mt-0.5" />
            <p className="text-[#856404] text-sm leading-snug">
              Este saldo é uma pontuação virtual da experiência. Representa dinheiro real,
              prémio financeiro ou valor disponível para levantamento.
            </p>
          </div>

          {/* Claim reward CTA */}
          <motion.button
            onClick={onClaim}
            className="w-full bg-[#31A24C] text-white font-black text-xl rounded-2xl py-5 flex items-center justify-center gap-2 shadow-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 4px 24px rgba(49,162,76,0.3)',
                '0 4px 40px rgba(49,162,76,0.7)',
                '0 4px 24px rgba(49,162,76,0.3)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💳 RECEBER SALDO AGORA
          </motion.button>

          {/* Restart */}
          <motion.button
            onClick={onRestart}
            className="w-full border-2 border-[#1877F2] text-[#1877F2] font-bold text-base rounded-xl py-4 flex items-center justify-center gap-2 bg-white active:scale-95 transition-transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Recomeçar a experiência"
          >
            <RotateCcw size={18} />
            RECOMEÇAR EXPERIÊNCIA
          </motion.button>

          <p className="text-center text-[#65676B] text-xs pb-6">
            Obrigado por participares! Concluíste as cinco avaliações.
          </p>
        </div>
      </div>
    </>
  )
}

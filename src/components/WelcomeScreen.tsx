import { motion } from 'framer-motion'
import { ChevronRight, Clock, FileText, Info } from 'lucide-react'
import { Logo } from './Logo'
import { SoundToggle } from './SoundToggle'
import { formatKz } from '../utils/format'

interface WelcomeScreenProps {
  onStart: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

export function WelcomeScreen({ onStart, soundEnabled, onToggleSound }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center px-4 py-8 safe-top safe-bottom">
      {/* Header bar */}
      <div className="w-full max-w-[640px] flex justify-between items-center mb-8">
        <Logo size="sm" />
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
      </div>

      <motion.div
        className="w-full max-w-[640px] space-y-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Hero card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Blue top section */}
          <div className="bg-[#1877F2] px-6 pt-8 pb-10 text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
            >
              💬
            </motion.div>
            <h1 className="text-white text-2xl font-black leading-tight mb-2">
              Avalia publicações<br />e completa o desafio
            </h1>
            <p className="text-white/80 text-sm">
              Diz-nos se gostas ou não de cada publicação.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex border-b border-[#E4E6EB]">
            <div className="flex-1 flex flex-col items-center py-4 border-r border-[#E4E6EB]">
              <div className="flex items-center gap-1 text-[#1877F2] mb-1">
                <FileText size={16} />
                <span className="font-bold text-lg">5</span>
              </div>
              <span className="text-[#65676B] text-xs">publicações</span>
            </div>
            <div className="flex-1 flex flex-col items-center py-4">
              <div className="flex items-center gap-1 text-[#31A24C] mb-1">
                <Clock size={16} />
                <span className="font-bold text-lg">~1 min</span>
              </div>
              <span className="text-[#65676B] text-xs">duração</span>
            </div>
          </div>

          {/* Reward highlight */}
          <div className="px-6 py-5 text-center">
            <p className="text-[#65676B] text-sm mb-1">Recompensa virtual total</p>
            <motion.div
              className="text-4xl font-black text-[#31A24C] leading-none"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
            >
              {formatKz(94000)}
            </motion.div>
            <p className="text-[#65676B] text-xs mt-1">virtuais</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#FFF3CD] border border-[#FFC107] rounded-xl px-4 py-3 flex gap-3">
          <Info size={18} className="text-[#856404] flex-shrink-0 mt-0.5" />
          <p className="text-[#856404] text-sm leading-snug">
            Esta é uma experiência gamificada de demonstração. Os valores apresentados são virtuais,
            não representam dinheiro real e não podem ser levantados.
          </p>
        </div>

        {/* Start button */}
        <motion.button
          onClick={onStart}
          className="w-full bg-[#1877F2] text-white font-bold text-lg rounded-xl py-4 flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Começar avaliação"
        >
          COMEÇAR A AVALIAÇÃO
          <ChevronRight size={22} />
        </motion.button>

        <p className="text-center text-[#65676B] text-xs pb-4">
          A tua opinião conta! Escolhe uma opção em cada publicação.
        </p>
      </motion.div>
    </div>
  )
}

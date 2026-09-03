import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { Logo } from './Logo'
import { SoundToggle } from './SoundToggle'

interface HeaderProps {
  current: number
  total: number
  balance: number
  soundEnabled: boolean
  onToggleSound: () => void
}

export function Header({ current, total, balance, soundEnabled, onToggleSound }: HeaderProps) {
  const progress = (current / total) * 100

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#1877F2] shadow-md safe-top">
      {/* Facebook logo strip */}
      <div className="flex justify-center pt-1.5 pb-0.5">
        <img src="/images/facebook-logo.svg" alt="Facebook" className="h-5 w-auto opacity-90" />
      </div>
      <div className="max-w-[640px] mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <Logo size="sm" white />

          {/* Progress info */}
          <div className="text-center flex-1 min-w-0">
            <p className="text-white/80 text-xs font-medium">
              Publicação {current} de {total}
            </p>
            <div className="bg-white/20 rounded-full h-1.5 mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Balance */}
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 flex-shrink-0">
            <Coins size={14} className="text-[#F7B928]" />
            <span className="text-white text-xs font-bold">{balance.toLocaleString('pt-AO')}</span>
          </div>

          <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} small />
        </div>
      </div>
    </header>
  )
}

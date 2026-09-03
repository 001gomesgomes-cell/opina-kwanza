import { motion } from 'framer-motion'
import { CheckCircle2, Shield, Star, Users, ChevronRight, BadgeCheck } from 'lucide-react'

interface LandingPageProps {
  onStart: () => void
}

const SOCIAL_PROOF = [
  { avatar: 'AK', name: 'Ana K.', text: 'Recebi os meus Kz virtuais!', color: '#E41E3F' },
  { avatar: 'MF', name: 'Miguel F.', text: 'Muito fácil e rápido!', color: '#31A24C' },
  { avatar: 'CE', name: 'Carlos E.', text: 'Já avaliei as 5 publicações.', color: '#1877F2' },
]

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#1877F2] flex flex-col items-center overflow-x-hidden">

      {/* Facebook logo banner */}
      <div className="w-full max-w-[480px] px-4 pt-6 pb-0">
        <img
          src="/images/facebook-logo.svg"
          alt="Facebook"
          className="w-48 h-auto mx-auto mb-4 rounded-xl"
        />
      </div>

      {/* Top bar */}
      <div className="w-full max-w-[480px] px-4 pt-0 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-base">💬</div>
          <span className="text-white font-black text-base tracking-tight">Opina Kwanza</span>
        </div>
        <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-[#31A24C] animate-pulse" />
          <span className="text-white text-xs font-semibold">Vagas abertas</span>
        </div>
      </div>

      {/* Hero section */}
      <div className="w-full max-w-[480px] px-4 pt-6 pb-0">

        {/* License badge */}
        <motion.div
          className="flex justify-center mb-5"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <div className="bg-[#F7B928] rounded-2xl px-5 py-3 flex items-center gap-2 shadow-lg">
            <BadgeCheck size={22} className="text-[#7a5700]" />
            <div>
              <p className="text-[#7a5700] text-[10px] font-bold uppercase tracking-widest leading-none">Licença activa</p>
              <p className="text-[#3d2c00] text-sm font-black leading-tight">Avaliador Certificado</p>
            </div>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-white text-3xl font-black leading-tight mb-3">
            Você é um utilizador<br />
            <span className="text-[#F7B928]">fiel do Facebook</span> 🎉
          </h1>
          <p className="text-white/90 text-base leading-snug">
            Por isso, você ganhou uma <strong className="text-white">licença exclusiva</strong> para avaliar publicações do Facebook
            e ser <strong className="text-white">recompensado em Kwanza</strong>.
          </p>
        </motion.div>

        {/* Reward card */}
        <motion.div
          className="bg-white rounded-2xl overflow-hidden shadow-2xl mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-[#31A24C] to-[#27873E] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-medium">Recompensa disponível</p>
              <p className="text-white text-3xl font-black leading-none">94.000 Kz</p>
              <p className="text-white/70 text-xs">em créditos virtuais</p>
            </div>
            <div className="text-5xl">💰</div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[
              { icon: '📋', text: 'Avalia 5 publicações do Facebook' },
              { icon: '👍', text: 'Diz se gostas ou não de cada uma' },
              { icon: '🏆', text: 'Recebe créditos virtuais por cada avaliação' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <p className="text-[#050505] text-sm font-medium">{item.text}</p>
                <CheckCircle2 size={16} className="text-[#31A24C] ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: <Users size={18} className="text-[#F7B928]" />, value: '12.847', label: 'participantes' },
            { icon: <Star size={18} className="text-[#F7B928]" />, value: '4.9', label: 'avaliação' },
            { icon: <Shield size={18} className="text-[#F7B928]" />, value: '100%', label: 'seguro' },
          ].map((s, i) => (
            <div key={i} className="bg-white/20 rounded-xl px-3 py-3 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-white font-black text-lg leading-none">{s.value}</p>
              <p className="text-white/70 text-[11px]">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="space-y-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {SOCIAL_PROOF.map((p, i) => (
            <div key={i} className="bg-white/15 rounded-xl px-4 py-3 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-none">{p.name}</p>
                <p className="text-white/70 text-xs mt-0.5">"{p.text}"</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={11} className="text-[#F7B928] fill-[#F7B928]" />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="pb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={onStart}
            className="w-full bg-[#F7B928] text-[#3d2c00] font-black text-lg rounded-2xl py-5 flex items-center justify-center gap-2 shadow-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Começar a avaliar publicações"
          >
            COMEÇAR A AVALIAR AGORA
            <ChevronRight size={24} />
          </motion.button>
          <p className="text-white/60 text-xs text-center mt-3 leading-snug px-2">
            Esta é uma experiência gamificada. Os créditos são virtuais e representam dinheiro real.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

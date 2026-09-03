interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  white?: boolean
}

export function Logo({ size = 'md', white }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-base', badge: 'text-[9px]' },
    md: { icon: 28, text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 40, text: 'text-3xl', badge: 'text-xs' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          width: s.icon + 8,
          height: s.icon + 8,
          background: white ? 'rgba(255,255,255,0.2)' : '#1877F2',
        }}
      >
        <span style={{ fontSize: s.icon * 0.7 }}>💬</span>
      </div>
      <div>
        <div className={`font-black ${s.text} leading-none ${white ? 'text-white' : 'text-[#1877F2]'}`}>
          Opina Kwanza
        </div>
        <div
          className={`${s.badge} font-semibold uppercase tracking-wide ${
            white ? 'text-white/70' : 'text-[#65676B]'
          }`}
        >
          Experiência de avaliação
        </div>
      </div>
    </div>
  )
}

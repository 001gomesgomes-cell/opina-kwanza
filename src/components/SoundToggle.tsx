import { Volume2, VolumeX } from 'lucide-react'

interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
  small?: boolean
}

export function SoundToggle({ enabled, onToggle, small }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? 'Desativar sons' : 'Ativar sons'}
      className={`flex items-center gap-1 rounded-full transition-colors ${
        small
          ? 'p-2 text-white/80 hover:text-white hover:bg-white/20'
          : 'px-3 py-2 text-[#65676B] hover:bg-[#F0F2F5] text-sm'
      }`}
    >
      {enabled ? (
        <Volume2 size={small ? 18 : 16} />
      ) : (
        <VolumeX size={small ? 18 : 16} />
      )}
      {!small && <span>{enabled ? 'Som ativo' : 'Sem som'}</span>}
    </button>
  )
}

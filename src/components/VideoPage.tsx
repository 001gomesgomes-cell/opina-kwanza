import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const UNLOCK_AFTER = 120
const ACTIVATION_URL = 'https://www.kintu.org/product/6ed7caf6-33b4-40bc-af60-83b62e6f50ad'

export function VideoPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [clicked, setClicked] = useState(false)
  const countRef = useRef(0)

  // Prefetch the activation page 30s before the button appears
  useEffect(() => {
    const t = setTimeout(() => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = ACTIVATION_URL
      document.head.appendChild(link)
    }, (UNLOCK_AFTER - 30) * 1000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (unlocked) return
    const interval = setInterval(() => {
      countRef.current += 1
      if (countRef.current >= UNLOCK_AFTER) {
        setUnlocked(true)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [unlocked])

  const handleActivate = () => {
    setClicked(true)
    window.open(ACTIVATION_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <iframe
        id="panda-a40dabb7-6e9a-4ad4-804e-6bc3bd6331ad"
        src="https://player-vz-1b75401b-739.tv.pandavideo.com.br/embed/?v=a40dabb7-6e9a-4ad4-804e-6bc3bd6331ad"
        style={{ border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
        allowFullScreen
        title="Vídeo de activação de conta"
      />

      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex flex-col items-center px-6 z-10 gap-3"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <motion.button
              onClick={handleActivate}
              disabled={clicked}
              className="w-full max-w-[400px] text-white font-black text-xl rounded-2xl py-5 flex items-center justify-center gap-3 shadow-2xl disabled:opacity-80"
              style={{ backgroundColor: clicked ? '#1877F2' : '#31A24C' }}
              whileHover={clicked ? {} : { scale: 1.04 }}
              whileTap={clicked ? {} : { scale: 0.96 }}
              animate={clicked ? {} : {
                boxShadow: [
                  '0 0 24px rgba(49,162,76,0.5)',
                  '0 0 48px rgba(49,162,76,0.9)',
                  '0 0 24px rgba(49,162,76,0.5)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {clicked ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  A abrir…
                </>
              ) : (
                '✅ ACTIVAR CONTA'
              )}
            </motion.button>

            {clicked && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/80 text-sm text-center"
              >
                Se a página não abrir, toca novamente no botão.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

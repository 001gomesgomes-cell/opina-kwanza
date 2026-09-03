import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const UNLOCK_AFTER = 120
const ACTIVATION_URL = 'https://www.kintu.org/product/6ed7caf6-33b4-40bc-af60-83b62e6f50ad'

export function VideoPage() {
  const [unlocked, setUnlocked] = useState(false)
  const countRef = useRef(0)

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

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Video fills entire screen */}
      <iframe
        id="panda-a40dabb7-6e9a-4ad4-804e-6bc3bd6331ad"
        src="https://player-vz-1b75401b-739.tv.pandavideo.com.br/embed/?v=a40dabb7-6e9a-4ad4-804e-6bc3bd6331ad"
        style={{ border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
        allowFullScreen
        title="Vídeo de activação de conta"
      />

      {/* Activation button — floats on top of the video when unlocked */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex justify-center px-6 z-10"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <motion.a
              href={ACTIVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[400px] bg-[#31A24C] text-white font-black text-xl rounded-2xl py-5 flex items-center justify-center gap-3 shadow-2xl"
              style={{ display: 'flex', textDecoration: 'none' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                boxShadow: [
                  '0 0 24px rgba(49,162,76,0.5)',
                  '0 0 48px rgba(49,162,76,0.9)',
                  '0 0 24px rgba(49,162,76,0.5)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ✅ ACTIVAR CONTA
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import type { Post, Answer } from '../types'

interface PostCardProps {
  post: Post
  onAnswer: (answer: Answer) => void
}

export function PostCard({ post, onAnswer }: PostCardProps) {
  const [chosen, setChosen] = useState<Answer>(null)
  const [imgError, setImgError] = useState(false)

  const handle = (answer: 'like' | 'dislike') => {
    if (chosen !== null) return
    setChosen(answer)
    setTimeout(() => onAnswer(answer), 350)
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm overflow-hidden w-full"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Image */}
      <div className="w-full bg-[#F0F2F5]">
        {!imgError ? (
          <img
            src={post.image}
            alt={post.alt}
            className="w-full h-auto object-contain"
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-[#65676B] text-sm">
            Imagem não disponível
          </div>
        )}
      </div>

      {/* Evaluation section */}
      <div className="px-4 pt-4 pb-5">
        <p className="text-[#050505] font-semibold text-sm text-center mb-4">
          O que achaste desta publicação?
        </p>

        <div className="flex gap-3">
          <motion.button
            onClick={() => handle('like')}
            disabled={chosen !== null}
            aria-label="Gostei desta publicação"
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-colors border-2 ${
              chosen === 'like'
                ? 'bg-[#31A24C] border-[#31A24C] text-white'
                : chosen === 'dislike'
                ? 'bg-[#F0F2F5] border-[#E4E6EB] text-[#BCC0C4] cursor-not-allowed'
                : 'bg-[#31A24C] border-[#31A24C] text-white hover:bg-[#27873E] hover:border-[#27873E]'
            }`}
            whileTap={chosen === null ? { scale: 0.95 } : {}}
            animate={chosen === 'like' ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ThumbsUp size={20} />
            <span>Gostei</span>
          </motion.button>

          <motion.button
            onClick={() => handle('dislike')}
            disabled={chosen !== null}
            aria-label="Não gostei desta publicação"
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-colors border-2 ${
              chosen === 'dislike'
                ? 'bg-[#E41E3F] border-[#E41E3F] text-white'
                : chosen === 'like'
                ? 'bg-[#F0F2F5] border-[#E4E6EB] text-[#BCC0C4] cursor-not-allowed'
                : 'bg-[#E41E3F] border-[#E41E3F] text-white hover:bg-[#c41535] hover:border-[#c41535]'
            }`}
            whileTap={chosen === null ? { scale: 0.95 } : {}}
            animate={chosen === 'dislike' ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ThumbsDown size={20} />
            <span>Não gostei</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

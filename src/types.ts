export type Answer = 'like' | 'dislike' | null

export interface Post {
  id: number
  profile: string
  avatar: string
  image: string
  alt: string
  reward: number
  reactions: string
  comments: string
  shares: string
  time: string
}

export interface EvaluationResult {
  postId: number
  answer: Answer
  reward: number
}

export type Screen = 'landing' | 'evaluating' | 'final' | 'lead-capture' | 'waiting' | 'video'

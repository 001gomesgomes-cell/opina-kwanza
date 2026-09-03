import type { Post } from '../types'

// Fixed rewards assigned by evaluation order (always sums to 94,000 Kz)
const POSITION_REWARDS = [12000, 16000, 18000, 22000, 26000]

const ALL_POSTS: Omit<Post, 'reward'>[] = [
  {
    id: 1,
    profile: 'Maurícia Monteiro',
    avatar: 'MM',
    image: '/images/IMG_5035.jpg',
    alt: 'Publicação de Maurícia Monteiro sobre injustiça nas relações',
    reactions: '11 mil',
    comments: '809',
    shares: '1,1 mil',
    time: '23 h',
  },
  {
    id: 2,
    profile: 'Gilmário Vemba',
    avatar: 'GV',
    image: '/images/IMG_5032.jpg',
    alt: 'Gilmário Vemba anuncia casamento com foto a preto e branco',
    reactions: '147 mil',
    comments: '2,1 mil',
    shares: '178',
    time: '2 d',
  },
  {
    id: 3,
    profile: 'Memes da Vida',
    avatar: 'MV',
    image: '/images/IMG_5031.jpg',
    alt: 'Menino passa anos em orfanato e é adotado pela família do melhor amigo',
    reactions: '5,4 mil',
    comments: '47',
    shares: '46',
    time: '1 d',
  },
  {
    id: 4,
    profile: 'Quadrante TV',
    avatar: 'QT',
    image: '/images/IMG_5029.jpg',
    alt: 'Francisco Teixeira: Nós somos escravos no nosso próprio país',
    reactions: '45,3 mil',
    comments: '1,7 mil',
    shares: '2,1 mil',
    time: '19/08',
  },
  {
    id: 5,
    profile: 'Malanje, Compra e Venda',
    avatar: 'MC',
    image: '/images/IMG_5028.jpg',
    alt: 'Cidade de Malanje iluminada à noite, avenida principal com edifícios modernos',
    reactions: '784',
    comments: '77',
    shares: '5',
    time: '21 h',
  },
  {
    id: 6,
    profile: 'Rafael Beats',
    avatar: 'RB',
    image: '/images/IMG_5054.jpg',
    alt: 'Homem de costas com t-shirt "Primeiro Dinheiro Depois Mulher"',
    reactions: '2,3 m',
    comments: '117',
    shares: '65',
    time: '14 h',
  },
  {
    id: 7,
    profile: '12 FUROS',
    avatar: '12',
    image: '/images/IMG_5053.jpg',
    alt: 'Jessica Pitbull ft 12 Furos — dois artistas a ver um telemóvel',
    reactions: '92,3 m',
    comments: '1 m',
    shares: '160',
    time: '4 d',
  },
  {
    id: 8,
    profile: 'Samara Panamera',
    avatar: 'SP',
    image: '/images/IMG_5052.jpg',
    alt: 'Samara Panamera em frente ao logótipo da ZAP',
    reactions: '5,5 m',
    comments: '110',
    shares: '7',
    time: '23 h',
  },
  {
    id: 9,
    profile: 'Sonangol-Muzik',
    avatar: 'SM',
    image: '/images/IMG_5051.jpg',
    alt: 'Carla Djamila: zero rivalidade feminina — "Se você está bonita nos stories, eu vou curtir sim"',
    reactions: '7,8 m',
    comments: '77',
    shares: '67',
    time: '18 h',
  },
  {
    id: 10,
    profile: 'Portal Cacuaco Line',
    avatar: 'PC',
    image: '/images/IMG_5050.jpg',
    alt: 'Tchizé dos Santos defende que aniversário do Zé Dú devia ser feriado nacional',
    reactions: '1,2 m',
    comments: '',
    shares: '120',
    time: '4 d',
  },
  {
    id: 11,
    profile: 'Informação TV Zimbo',
    avatar: 'TZ',
    image: '/images/IMG_5049.jpg',
    alt: 'Ex-líder de gangue Duane Davis condenado pela morte do rapper Tupac, 30 anos depois',
    reactions: '8,2 m',
    comments: '345',
    shares: '155',
    time: '13 h',
  },
  {
    id: 12,
    profile: 'Matheus Maia Dos Santos',
    avatar: 'MM',
    image: '/images/IMG_5048.jpg',
    alt: 'Todo mundo voltou a falar de O Mentalista — a série ganhou nova vida na Netflix',
    reactions: '732',
    comments: '40',
    shares: '10',
    time: '9 h',
  },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function selectSessionPosts(savedIds?: number[]): Post[] {
  // If resuming a session, restore the same posts in the same order
  if (savedIds && savedIds.length === 5) {
    return savedIds
      .map((id, i) => {
        const base = ALL_POSTS.find(p => p.id === id)
        if (!base) return null
        return { ...base, reward: POSITION_REWARDS[i] } as Post
      })
      .filter(Boolean) as Post[]
  }
  // New session: shuffle and pick 5
  return shuffle(ALL_POSTS)
    .slice(0, 5)
    .map((base, i) => ({ ...base, reward: POSITION_REWARDS[i] } as Post))
}

// Keep POSTS as a convenience alias (first call, new session)
export const POSTS = selectSessionPosts()

export const TOTAL_REWARD = POSITION_REWARDS.reduce((s, r) => s + r, 0) // 94000

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LandingPage } from './components/LandingPage'
import { Header } from './components/Header'
import { PostCard } from './components/PostCard'
import { RewardPopup } from './components/RewardPopup'
import { FinalScreen } from './components/FinalScreen'
import { CoinBurst } from './components/CoinBurst'
import { LeadCapturePage } from './components/LeadCapturePage'
import { WaitingPage } from './components/WaitingPage'
import { VideoPage } from './components/VideoPage'
import { selectSessionPosts } from './data/posts'
import type { Screen, Answer, EvaluationResult, Post } from './types'
import type { LeadData } from './components/LeadCapturePage'
import { loadState, saveState, clearState, loadSoundPref, saveSoundPref } from './utils/storage'
import {
  playStart, playLike, playDislike, playCoins, playVictory, resumeCtx,
} from './utils/sound'

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [sessionPosts, setSessionPosts] = useState<Post[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<EvaluationResult[]>([])
  const [balance, setBalance] = useState(0)
  const [popupVisible, setPopupVisible] = useState(false)
  const [coinBurst, setCoinBurst] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(loadSoundPref)
  const [leadData, setLeadData] = useState<LeadData | null>(null)

  // Restore or start new session
  useEffect(() => {
    const saved = loadState()
    if (saved?.selectedPostIds?.length === 5) {
      // Resume existing session with the same posts
      const posts = selectSessionPosts(saved.selectedPostIds)
      setSessionPosts(posts)
      setCurrentIndex(saved.currentIndex)
      setResults(saved.results)
      setBalance(saved.balance)
      if (saved.currentIndex > 0 && saved.currentIndex < posts.length) {
        setScreen('evaluating')
      } else if (saved.currentIndex >= posts.length) {
        setScreen('final')
      }
    } else {
      // No saved session — pick posts ready for when user starts
      setSessionPosts(selectSessionPosts())
    }
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      saveSoundPref(!prev)
      return !prev
    })
  }, [])

  const handleLandingCTA = useCallback(() => {
    resumeCtx()
    if (soundEnabled) playStart()
    // Pick a fresh random set of posts for this session
    const posts = selectSessionPosts()
    setSessionPosts(posts)
    setScreen('evaluating')
    saveState({
      currentIndex: 0,
      results: [],
      balance: 0,
      soundEnabled,
      selectedPostIds: posts.map(p => p.id),
    })
  }, [soundEnabled])

  const handleAnswer = useCallback((answer: Answer) => {
    if (answer === null || currentIndex >= sessionPosts.length) return
    const post = sessionPosts[currentIndex]
    if (soundEnabled) {
      if (answer === 'like') playLike()
      else playDislike()
    }

    const newBalance = balance + post.reward
    const newResults = [...results, { postId: post.id, answer, reward: post.reward }]
    const newIndex = currentIndex + 1

    setBalance(newBalance)
    setResults(newResults)
    saveState({
      currentIndex: newIndex,
      results: newResults,
      balance: newBalance,
      soundEnabled,
      selectedPostIds: sessionPosts.map(p => p.id),
    })

    setCoinBurst(true)
    setTimeout(() => setCoinBurst(false), 1200)
    if (soundEnabled) setTimeout(() => playCoins(), 200)
    if (navigator.vibrate) navigator.vibrate(80)

    setPopupVisible(true)
  }, [currentIndex, balance, results, soundEnabled, sessionPosts])

  const handleNext = useCallback(() => {
    setPopupVisible(false)
    const nextIndex = currentIndex + 1
    if (nextIndex >= sessionPosts.length) {
      if (soundEnabled) setTimeout(() => playVictory(), 300)
      setScreen('final')
    } else {
      setCurrentIndex(nextIndex)
      setScreen('evaluating')
    }
  }, [currentIndex, soundEnabled, sessionPosts])

  const handleRestart = useCallback(() => {
    clearState()
    setScreen('landing')
    setCurrentIndex(0)
    setResults([])
    setBalance(0)
    setPopupVisible(false)
    setLeadData(null)
    setSessionPosts(selectSessionPosts())
  }, [])

  const handleLeadSubmit = useCallback((data: LeadData) => {
    setLeadData(data)
    setScreen('waiting')
  }, [])

  const handleWaitingFinish = useCallback(() => {
    setScreen('video')
  }, [])

  // Screen routing
  if (screen === 'landing') {
    return <LandingPage onStart={handleLandingCTA} />
  }

  if (screen === 'final') {
    return (
      <FinalScreen
        results={results}
        onRestart={handleRestart}
        onClaim={() => setScreen('lead-capture')}
      />
    )
  }

  if (screen === 'lead-capture') {
    return <LeadCapturePage totalReward={balance} onSubmit={handleLeadSubmit} />
  }

  if (screen === 'waiting') {
    return (
      <WaitingPage
        leadName={leadData?.name ?? 'Utilizador'}
        onFinish={handleWaitingFinish}
      />
    )
  }

  if (screen === 'video') {
    return <VideoPage />
  }

  const post = sessionPosts[currentIndex]

  return (
    <>
      <Header
        current={currentIndex + 1}
        total={sessionPosts.length}
        balance={balance}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="pt-20 pb-8 px-4 min-h-screen max-w-[640px] mx-auto">
        <AnimatePresence mode="wait">
          {post && (
            <PostCard
              key={post.id}
              post={post}
              onAnswer={handleAnswer}
            />
          )}
        </AnimatePresence>
      </main>

      <CoinBurst active={coinBurst} />

      <RewardPopup
        visible={popupVisible}
        reward={post?.reward ?? 0}
        balance={balance}
        postIndex={currentIndex + 1}
        totalPosts={sessionPosts.length}
        onNext={handleNext}
      />
    </>
  )
}

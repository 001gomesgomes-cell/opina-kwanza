import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, AlertTriangle } from 'lucide-react'

const TOTAL = 90

const FAKE_USERS = [
  { id: 'u1', name: 'Álvaro M.',     color: '#1877F2', avatar: 'AM' },
  { id: 'u2', name: 'Felicidade N.', color: '#E41E3F', avatar: 'FN' },
  { id: 'u3', name: 'Bernardo T.',   color: '#31A24C', avatar: 'BT' },
  { id: 'u4', name: 'Conceição P.',  color: '#E6A800', avatar: 'CP' },
  { id: 'u5', name: 'Rui A.',        color: '#9B59B6', avatar: 'RA' },
]
type FakeUser = typeof FAKE_USERS[number]

interface ChatMsg {
  id: string
  userId: string
  name: string
  color: string
  avatar: string
  text: string
  timeLabel: string
  isLead?: boolean
  isSystem?: boolean
}

const INITIAL_MESSAGES: ChatMsg[] = [
  { id: 'init-1', userId: 'u3', name: 'Bernardo T.',  color: '#31A24C', avatar: 'BT', text: 'Já recebi! Valeu a pena mesmo 👏',         timeLabel: 'há 3 min' },
  { id: 'init-2', userId: 'u4', name: 'Conceição P.', color: '#E6A800', avatar: 'CP', text: 'O saldo caiu rápido no Multicaixa! 😍',    timeLabel: 'há 2 min' },
  { id: 'init-3', userId: 'u1', name: 'Álvaro M.',    color: '#1877F2', avatar: 'AM', text: 'Acabei de confirmar, está tudo certo ✅',  timeLabel: 'há 1 min' },
]

// Timed messages — typing indicator appears 2s before each message
const TIMED_EVENTS: Array<{
  delay: number
  user: string
  text: string
  followUp?: { extraDelay: number; text: string }
}> = [
  { delay: 5,  user: 'u2', text: 'Que rápido! O saldo já está no meu IBAN 🎉',
    followUp: { extraDelay: 3, text: 'Nem acreditei quando vi a notificação 😂' } },
  { delay: 12, user: 'u5', text: 'Obrigado Opina Kwanza, recomendo a todos!' },
  { delay: 20, user: 'u3', text: 'Recebi os 94.000 Kz! Incrível 🙌',
    followUp: { extraDelay: 2, text: 'Caiu certinho no IBAN sem nenhum problema 💪' } },
  { delay: 30, user: 'u1', text: 'É mesmo seguro, não tive nenhum problema ✅' },
  { delay: 40, user: 'u4', text: 'Saldo confirmado! Obrigada 🙏' },
  { delay: 52, user: 'u2', text: 'Caiu no IBAN sem problemas 💰' },
  { delay: 63, user: 'u5', text: 'Partilhei com a família, adorei! 😊' },
  { delay: 74, user: 'u3', text: 'Já recebi, rápido e fácil! 🎊',
    followUp: { extraDelay: 3, text: 'Boa sorte a todos os que ainda estão a esperar!' } },
]

// Users joining during the chat
const JOIN_EVENTS: Array<{ delay: number; name: string }> = [
  { delay: 7,  name: 'Delfina K.' },
  { delay: 18, name: 'Mário S.' },
  { delay: 35, name: 'Anabela F.' },
  { delay: 58, name: 'Osvaldo T.' },
]

// Smart replies based on lead's message keywords
const SMART_REPLIES: [string[], string][] = [
  [
    ['burla', 'fraude', 'golpe', 'esquema', 'vigarice', 'mentira', 'fake', 'falso', 'enganar', 'enganado'],
    'Eu também pensei que era burla quando vi! Mas já recebi o meu saldo, está tudo certo 😅 Não é esquema nenhum.',
  ],
  [
    ['real', 'verdade', 'verdadeiro', 'funciona', 'funcionar', 'acreditar', 'acredito', 'serio', 'sério'],
    'É 100% real! Eu estava desconfiado igual a ti mas fiz e recebi mesmo. Já estou a recomendar à família 👍',
  ],
  [
    ['recebeu', 'receberam', 'já recebeu', 'quem recebeu', 'alguem', 'alguém'],
    'Eu recebi! Caiu no meu IBAN ontem mesmo. A Conceição também recebeu pelo Multicaixa 💰',
  ],
  [
    ['seguro', 'segurança', 'dados', 'informação', 'privacidade', 'roubar', 'roubo'],
    'É totalmente seguro! Não pede nenhuma senha nem dados bancários. Só o número para receber 🔒',
  ],
  [
    ['quando', 'quanto tempo', 'demora', 'prazo', 'dias', 'horas'],
    'Eu recebi em menos de 24 horas depois de activar a conta! Vai rápido ⏱️',
  ],
  [
    ['como', 'processo', 'passos', 'passo', 'fazer', 'próximo', 'proximo', 'seguinte'],
    'É simples: activas a conta no botão que aparece no vídeo e o saldo é processado logo a seguir!',
  ],
  [
    ['quanto', 'valor', 'dinheiro', 'kwanza', 'kz', '94'],
    'São 94.000 Kz! Eu recebi tudo certinho sem nenhum desconto 🙌',
  ],
  [
    ['obrigado', 'obrigada', 'valeu', 'fixe', 'bom', 'boa', 'ótimo', 'otimo', 'top'],
    'De nada! Boa sorte, vais receber em breve 🎉',
  ],
]

const FALLBACK_REPLIES = [
  'Aguarda mais um pouco, o saldo vai cair em breve! ⏳',
  'O sistema está a processar para ti, não te preocupes 💪',
  'Eu também passei por isso, vai correr bem! 😊',
  'Força! Estás muito perto de receber! 🎉',
]

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function getSmartReply(text: string, seed: number): string {
  const lower = norm(text)
  for (const [keywords, reply] of SMART_REPLIES) {
    if (keywords.some(k => lower.includes(norm(k)))) return reply
  }
  return FALLBACK_REPLIES[seed % FALLBACK_REPLIES.length]
}

function fmtCount(n: number) {
  return n >= 1000
    ? `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, '0')}`
    : String(n)
}

interface WaitingPageProps {
  leadName: string
  onFinish: () => void
}

export function WaitingPage({ leadName, onFinish }: WaitingPageProps) {
  const [elapsed, setElapsed] = useState(0)
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES)
  const [typing, setTyping] = useState<FakeUser[]>([])
  const [participants, setParticipants] = useState(1247)
  const [inputText, setInputText] = useState('')
  const [showError, setShowError] = useState(false)
  const [finished, setFinished] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const allTimers = useRef<number[]>([])

  const remaining = Math.max(0, TOTAL - elapsed)
  const pct = (elapsed / TOTAL) * 100

  const track = useCallback((id: number) => { allTimers.current.push(id); return id }, [])

  const addMsg = useCallback((msg: ChatMsg) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const showTyping = useCallback((user: FakeUser) => {
    setTyping(prev => prev.some(u => u.id === user.id) ? prev : [...prev, user])
  }, [])

  const hideTyping = useCallback((userId: string) => {
    setTyping(prev => prev.filter(u => u.id !== userId))
  }, [])

  // Main countdown
  useEffect(() => {
    const iv = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        if (next >= TOTAL) clearInterval(iv)
        return next
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  // Show error at 10s remaining
  useEffect(() => {
    if (remaining <= 10 && remaining > 0 && !showError && !finished) {
      setShowError(true)
    }
  }, [remaining, showError, finished])

  // Dynamic participant counter
  useEffect(() => {
    const iv = setInterval(() => {
      setParticipants(p => Math.max(1230, Math.min(1270, p + Math.floor(Math.random() * 5) - 2)))
    }, 3500)
    return () => clearInterval(iv)
  }, [])

  // Schedule all timed events
  useEffect(() => {
    // Timed messages with typing indicators
    TIMED_EVENTS.forEach(event => {
      const user = FAKE_USERS.find(u => u.id === event.user)!
      const typingAt = Math.max(0, (event.delay - 2) * 1000)

      track(window.setTimeout(() => showTyping(user), typingAt))

      track(window.setTimeout(() => {
        hideTyping(user.id)
        addMsg({
          id: `msg-${event.user}-${event.delay}`,
          userId: user.id, name: user.name, color: user.color, avatar: user.avatar,
          text: event.text, timeLabel: 'agora',
        })

        if (event.followUp) {
          const fu = event.followUp
          track(window.setTimeout(() => showTyping(user), fu.extraDelay * 1000))
          track(window.setTimeout(() => {
            hideTyping(user.id)
            addMsg({
              id: `msg-${event.user}-${event.delay}-fu`,
              userId: user.id, name: user.name, color: user.color, avatar: user.avatar,
              text: fu.text, timeLabel: 'agora',
            })
          }, (fu.extraDelay + 1.5) * 1000))
        }
      }, event.delay * 1000))
    })

    // Join notifications
    JOIN_EVENTS.forEach(ev => {
      track(window.setTimeout(() => {
        addMsg({
          id: `join-${ev.delay}`, userId: 'system', name: '', color: '', avatar: '',
          text: `${ev.name} entrou no chat`, timeLabel: '', isSystem: true,
        })
      }, ev.delay * 1000))
    })

    return () => {
      allTimers.current.forEach(clearTimeout)
      allTimers.current = []
    }
  }, [addMsg, track, showTyping, hideTyping])

  // Auto-scroll on new messages or typing change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = () => {
    const text = inputText.trim()
    if (!text) return
    const firstName = leadName.split(' ')[0]
    const initials = leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    addMsg({
      id: `lead-${Date.now()}`, userId: 'lead',
      name: `${firstName} (eu)`, color: '#1877F2', avatar: initials || 'EU',
      text, timeLabel: 'agora', isLead: true,
    })
    setInputText('')

    const u1 = FAKE_USERS[elapsed % FAKE_USERS.length]
    const u2 = FAKE_USERS[(elapsed + 2) % FAKE_USERS.length]
    const reply1 = getSmartReply(text, elapsed)
    const reply2 = `Exacto o que o ${u1.name.split(' ')[0]} disse! 👆`

    showTyping(u1)
    track(window.setTimeout(() => {
      hideTyping(u1.id)
      addMsg({ id: `r1-${Date.now()}`, userId: u1.id, name: u1.name, color: u1.color, avatar: u1.avatar, text: reply1, timeLabel: 'agora' })
      track(window.setTimeout(() => showTyping(u2), 600))
      track(window.setTimeout(() => {
        hideTyping(u2.id)
        addMsg({ id: `r2-${Date.now()}`, userId: u2.id, name: u2.name, color: u2.color, avatar: u2.avatar, text: reply2, timeLabel: 'agora' })
      }, 2400))
    }, 2000))
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const typingLabel = typing.length === 1
    ? `${typing[0].name} está a escrever`
    : typing.length === 2
    ? `${typing[0].name} e ${typing[1].name} estão a escrever`
    : typing.length > 2 ? 'Vários utilizadores estão a escrever' : ''

  return (
    <div className="min-h-screen bg-[#1877F2] flex flex-col items-center safe-top safe-bottom">
      <div className="w-full max-w-[480px] flex flex-col h-screen">

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex justify-center mb-3">
            <img src="/images/facebook-logo.svg" alt="Facebook" className="h-8 w-auto rounded-lg" />
          </div>
          <div className="bg-white/15 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white/70 text-xs font-medium">A processar o teu saldo…</p>
                <p className="text-white font-black text-3xl leading-none tabular-nums">{fmt(remaining)}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div className="h-full bg-[#F7B928] rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="flex-1 bg-white rounded-t-3xl flex flex-col overflow-hidden mx-2">

          {/* Chat header */}
          <div className="px-4 py-3 border-b border-[#E4E6EB] flex items-center gap-3 flex-shrink-0">
            <div className="flex -space-x-1.5">
              {FAKE_USERS.slice(0, 3).map(u => (
                <div key={u.id} className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold border-2 border-white" style={{ backgroundColor: u.color }}>
                  {u.avatar}
                </div>
              ))}
            </div>
            <div>
              <p className="text-[#050505] text-sm font-bold leading-none">Chat ao vivo</p>
              <motion.p key={participants} className="text-[#65676B] text-xs" initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
                {fmtCount(participants)} participantes
              </motion.p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#31A24C] rounded-full animate-pulse" />
              <span className="text-[#31A24C] text-xs font-semibold">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map(msg => {
                if (msg.isSystem) {
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center my-1">
                      <span className="text-[10px] text-[#65676B] bg-[#F0F2F5] px-3 py-1 rounded-full">{msg.text}</span>
                    </motion.div>
                  )
                }
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-2.5 ${msg.isLead ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: msg.color }}>
                      {msg.avatar}
                    </div>
                    <div className={`max-w-[72%] flex flex-col ${msg.isLead ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-baseline gap-1.5 mb-1 px-1 ${msg.isLead ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[10px] text-[#65676B] font-medium">{msg.name}</span>
                        <span className="text-[9px] text-[#BCC0C4]">{msg.timeLabel}</span>
                      </div>
                      <div className={`px-3.5 py-2.5 text-sm leading-snug ${msg.isLead ? 'bg-[#1877F2] text-white rounded-2xl rounded-tr-sm' : 'bg-[#F0F2F5] text-[#050505] rounded-2xl rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {typing.length > 0 && (
                <motion.div
                  key="typing-indicator"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2.5 items-end"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: typing[0].color }}>
                    {typing[0].avatar}
                  </div>
                  <div>
                    <p className="text-[9px] text-[#65676B] mb-1 px-1">{typingLabel}…</p>
                    <div className="bg-[#F0F2F5] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-[#BCC0C4] rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#E4E6EB] flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escreve uma mensagem…"
              className="flex-1 bg-[#F0F2F5] rounded-full px-4 py-2.5 text-sm outline-none"
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Error popup */}
      <AnimatePresence>
        {showError && !finished && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center pb-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowError(false)} />
            <motion.div
              className="relative bg-white rounded-t-3xl w-full max-w-[480px] px-6 pt-6 pb-8 shadow-2xl"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <div className="w-10 h-1 bg-[#E4E6EB] rounded-full mx-auto mb-5" />
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFEBEE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-[#E41E3F]" />
                </div>
                <h3 className="text-[#050505] font-black text-xl mb-3">Saldo não processado!</h3>
                <p className="text-[#65676B] text-sm leading-relaxed mb-6">
                  O teu saldo <strong className="text-[#050505]">não foi enviado</strong> porque a tua conta
                  ainda não está activa. Para receber, precisas de{' '}
                  <strong className="text-[#050505]">activar a tua conta</strong> primeiro.
                </p>
                <motion.button
                  onClick={() => { setFinished(true); onFinish() }}
                  className="w-full bg-[#E41E3F] text-white font-black text-lg rounded-2xl py-4"
                  whileTap={{ scale: 0.97 }}
                >
                  ACTIVAR CONTA AGORA
                </motion.button>
                <button onClick={() => setShowError(false)} className="mt-3 text-[#65676B] text-sm flex items-center gap-1 mx-auto">
                  <X size={14} /> Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx
}

function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  volume = 0.3,
  delay = 0,
) {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime + delay)
  gain.gain.setValueAtTime(0, ac.currentTime + delay)
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + delay + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration)
  osc.start(ac.currentTime + delay)
  osc.stop(ac.currentTime + delay + duration + 0.05)
}

export function playStart() {
  playTone(523, 'sine', 0.15, 0.25)
  playTone(659, 'sine', 0.15, 0.25, 0.12)
  playTone(784, 'sine', 0.2, 0.3, 0.24)
}

export function playLike() {
  playTone(440, 'sine', 0.1, 0.25)
  playTone(554, 'sine', 0.15, 0.3, 0.1)
}

export function playDislike() {
  playTone(330, 'triangle', 0.1, 0.2)
  playTone(277, 'triangle', 0.12, 0.2, 0.1)
}

export function playCoins() {
  [0, 0.07, 0.14, 0.21].forEach((delay, i) => {
    playTone(880 + i * 110, 'sine', 0.08, 0.2, delay)
  })
}

export function playVictory() {
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    playTone(freq, 'sine', 0.25, 0.35, i * 0.1)
  })
  playTone(1047, 'sine', 0.5, 0.4, 0.5)
}

export function resumeCtx() {
  getCtx()?.resume()
}

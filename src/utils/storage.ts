import type { EvaluationResult } from '../types'

const KEY = 'opina-kwanza-v1'

interface SavedState {
  currentIndex: number
  results: EvaluationResult[]
  balance: number
  soundEnabled: boolean
  selectedPostIds?: number[]
}

export function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedState
  } catch {
    return null
  }
}

export function saveState(state: SavedState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function loadSoundPref(): boolean {
  try {
    return localStorage.getItem('opina-kwanza-sound') !== 'false'
  } catch {
    return true
  }
}

export function saveSoundPref(enabled: boolean) {
  try {
    localStorage.setItem('opina-kwanza-sound', String(enabled))
  } catch {
    // ignore
  }
}

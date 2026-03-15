import { useEffect, useRef, useState, useCallback } from 'react'

export function useSpeech({ rate = 1.0, voiceURI = null } = {}) {
  const [supported, setSupported] = useState(false)
  const [voices, setVoices] = useState([])
  const [speaking, setSpeaking] = useState(false)
  const utterRef = useRef(null)

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true)
      const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  const speak = useCallback((text) => {
    if (!supported || !text) return
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = rate
    if (voiceURI) {
      const voice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === voiceURI)
      if (voice) utter.voice = voice
    }
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)

    utterRef.current = utter
    window.speechSynthesis.speak(utter)
  }, [supported, rate, voiceURI])

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  return { supported, voices, speaking, speak, cancel }
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export function useAudio(filename: string | null) {
  const audioRef   = useRef<HTMLAudioElement | null>(null)
  const playingRef = useRef(false)

  const [isPlaying,   setIsPlaying]   = useState(false)
  const [progress,    setProgress]    = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setIsPlaying(false); setProgress(0); setCurrentTime(0); setDuration(0)
    playingRef.current = false

    if (!filename) return

    const audio = new Audio(`${API_URL}/audio/${encodeURIComponent(filename)}`)
    audioRef.current = audio

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const onMeta  = () => setDuration(audio.duration)
    const onEnded = () => { setIsPlaying(false); playingRef.current = false }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnded)
      audio.pause()
      audio.src = ''
    }
  }, [filename])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playingRef.current) {
      audio.pause()
      playingRef.current = false
      setIsPlaying(false)
    } else {
      audio.play().then(() => { playingRef.current = true; setIsPlaying(true) }).catch(console.error)
    }
  }, [])

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = (pct / 100) * audio.duration
  }, [])

  const formatTime = useCallback((s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }, [])

  return { isPlaying, progress, currentTime, duration, togglePlay, seek, formatTime }
}
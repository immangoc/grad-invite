import { useCallback, useEffect, useRef, useState } from 'react'
import HeroScreen     from './components/HeroScreen'
import InviteScreen   from './components/InviteScreen'
import RSVPScreen     from './components/RSVPScreen'
import ThankYouScreen from './components/ThankYouScreen'
import './App.css'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const SCREEN_IDS = ['hero', 'invite', 'rsvp', 'thankyou']

const snapTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  requestAnimationFrame(() => {
    window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  })
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const busy        = useRef(false)
  const screenRef   = useRef(0)   // mirror của currentScreen nhưng sync cho listeners

  const goNext = useCallback(() => {
    const next = Math.min(screenRef.current + 1, SCREEN_IDS.length - 1)
    if (next === screenRef.current) return
    screenRef.current = next
    setCurrentScreen(next)
    snapTo(SCREEN_IDS[next])
  }, [])

  const handleHeroDone = useCallback(() => {
    busy.current = true
    goNext()
    setTimeout(() => { busy.current = false }, 600)
  }, [goNext])

  useEffect(() => {
    screenRef.current = currentScreen
  }, [currentScreen])

  useEffect(() => {
    const advance = () => {
      if (busy.current) return
      if (screenRef.current === 0 || screenRef.current >= SCREEN_IDS.length - 1) return
      busy.current = true
      goNext()
      setTimeout(() => { busy.current = false }, 400)
    }

    const onWheel = (e) => {
      if (screenRef.current === 0) return   // Hero tự xử lý
      if (e.deltaY <= 0) return
      e.preventDefault()
      advance()
    }

    let startY = 0
    let tracking = false
    const onTouchStart = (e) => {
      startY = e.touches[0].clientY
      tracking = true
    }
    const onTouchMove = (e) => {
      if (!tracking || screenRef.current === 0) return
      const dy = startY - e.touches[0].clientY
      if (Math.abs(dy) < 30) return
      tracking = false   // chỉ trigger 1 lần mỗi gesture
      if (dy > 0) {
        e.preventDefault()
        advance()
      }
    }
    const onTouchEnd = () => { tracking = false }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [goNext])   // không phụ thuộc currentScreen nữa → không re-register liên tục

  return (
    <>
      <HeroScreen     id="hero"     onDone={handleHeroDone} isActive={currentScreen === 0} />
      <InviteScreen   id="invite"   isActive={currentScreen === 1} />
      <RSVPScreen     id="rsvp"     isActive={currentScreen === 2} onAdvance={goNext} />
      <ThankYouScreen id="thankyou" isActive={currentScreen === 3} />
    </>
  )
}

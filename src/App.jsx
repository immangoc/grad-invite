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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const busy = useRef(false)

  const goNext = useCallback(() => {
    setCurrentScreen(prev => {
      const next = Math.min(prev + 1, SCREEN_IDS.length - 1)
      setTimeout(() => {
        document.getElementById(SCREEN_IDS[next])
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
      return next
    })
  }, [])

  const handleHeroDone = useCallback(() => {
    busy.current = true
    goNext()
    setTimeout(() => { busy.current = false }, 1000)
  }, [goNext])

  // Wheel + touch handler cho screen 1, 2 (Hero tự xử lý)
  useEffect(() => {
    const advance = () => {
      if (busy.current) return
      if (currentScreen === 0 || currentScreen >= SCREEN_IDS.length - 1) return
      busy.current = true
      goNext()
      setTimeout(() => { busy.current = false }, 900)
    }

    const onWheel = (e) => {
      if (e.deltaY <= 0) return
      if (currentScreen === 0) return
      e.preventDefault()
      advance()
    }

    let touchStartY = 0
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchMove  = (e) => {
      if (currentScreen === 0) return
      const dy = touchStartY - e.touches[0].clientY
      if (dy < 25) return
      e.preventDefault()
      touchStartY = e.touches[0].clientY
      advance()
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [currentScreen, goNext])

  return (
    <>
      <HeroScreen     id="hero"     onDone={handleHeroDone} isActive={currentScreen === 0} />
      <InviteScreen   id="invite"   isActive={currentScreen === 1} />
      <RSVPScreen     id="rsvp"     isActive={currentScreen === 2} onAdvance={goNext} />
      <ThankYouScreen id="thankyou" isActive={currentScreen === 3} />
    </>
  )
}

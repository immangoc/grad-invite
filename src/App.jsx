import { useCallback, useEffect, useRef, useState } from 'react'
import HeroScreen     from './components/HeroScreen'
import InviteScreen   from './components/InviteScreen'
import RSVPScreen     from './components/RSVPScreen'
import ThankYouScreen from './components/ThankYouScreen'
import './App.css'

/* Tắt browser scroll restoration — tránh trang reload ở giữa */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

/* IDs tương ứng với từng screen — dùng để scrollIntoView */
const SCREEN_IDS = ['hero', 'invite', 'rsvp', 'thankyou']

export default function App() {
  // currentScreen: 0=Hero, 1=Invite, 2=RSVP, 3=ThankYou
  const [currentScreen, setCurrentScreen] = useState(0)
  const busy = useRef(false)   // debounce để tránh scroll quá nhanh

  /* Khi mount: cuộn về đầu trang ngay lập tức */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  /* Snap xuống screen tiếp theo */
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

  /* HeroScreen gọi khi xong cả 2 stage → snap sang Invite */
  const handleHeroDone = useCallback(() => {
    // Lock busy để tránh wheel event ngay sau đó nhảy thêm 1 screen nữa
    busy.current = true
    goNext()
    setTimeout(() => { busy.current = false }, 1000)
  }, [goNext])

  useEffect(() => {
    const onWheel = (e) => {
      if (e.deltaY <= 0) return
      if (currentScreen >= SCREEN_IDS.length - 1) return
      if (currentScreen === 0) return
      if (busy.current) return

      e.preventDefault()
      busy.current = true
      goNext()
      setTimeout(() => { busy.current = false }, 900)
    }

    /* Touch support */
    let touchStartY = 0
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchMove  = (e) => {
      const dy = touchStartY - e.touches[0].clientY
      if (dy > 40) {
        e.preventDefault()
        if (busy.current || currentScreen === 0) return
        busy.current = true
        goNext()
        setTimeout(() => { busy.current = false }, 900)
      }
    }

    window.addEventListener('wheel',      onWheel,       { passive: false })
    window.addEventListener('touchstart', onTouchStart,  { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,   { passive: false })
    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [currentScreen, goNext])

  return (
    <>
      <HeroScreen id="hero" onDone={handleHeroDone} isActive={currentScreen === 0} />
      <InviteScreen   id="invite"   isActive={currentScreen === 1} />
      <RSVPScreen     id="rsvp"     isActive={currentScreen === 2} onAdvance={goNext} />
      <ThankYouScreen id="thankyou" isActive={currentScreen === 3} />
    </>
  )
}

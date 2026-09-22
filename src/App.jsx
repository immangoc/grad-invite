import { useCallback, useRef, useState } from 'react'
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

  const handleAdvance = useCallback(() => {
    if (busy.current) return
    busy.current = true
    goNext()
    setTimeout(() => { busy.current = false }, 900)
  }, [goNext])

  return (
    <>
      <HeroScreen     id="hero"     onDone={handleHeroDone} isActive={currentScreen === 0} />
      <InviteScreen   id="invite"   isActive={currentScreen === 1} onAdvance={handleAdvance} />
      <RSVPScreen     id="rsvp"     isActive={currentScreen === 2} onAdvance={goNext} />
      <ThankYouScreen id="thankyou" isActive={currentScreen === 3} />
    </>
  )
}

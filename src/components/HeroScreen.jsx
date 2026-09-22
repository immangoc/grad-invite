import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './HeroScreen.module.css'

export default function HeroScreen({ id, onDone, isActive }) {
  const [revealed, setRevealed] = useState(false)
  const [done,     setDone]     = useState(false)
  const busy = useRef(false)

  useEffect(() => {
    if (!isActive || done) return

    // Khoá scroll của trang khi Hero còn active
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'

    const onWheel = (e) => {
      e.preventDefault()
      if (busy.current) return
      if (e.deltaY <= 0) return

      busy.current = true

      if (!revealed) {
        setRevealed(true)
        setTimeout(() => { busy.current = false }, 1200)
      } else {
        setDone(true)
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        if (onDone) onDone()
      }
    }

    let touchStartY = 0
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      e.preventDefault()               // luôn chặn scroll trang
      if (busy.current) return
      const dy = touchStartY - e.touches[0].clientY
      if (dy < 25) return

      busy.current = true
      touchStartY = e.touches[0].clientY

      if (!revealed) {
        setRevealed(true)
        setTimeout(() => { busy.current = false }, 1200)
      } else {
        setDone(true)
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        if (onDone) onDone()
      }
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      // Cleanup khi unmount
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isActive, revealed, done, onDone])

  const ease = [0.22, 1, 0.36, 1]

  return (
    <section id={id ?? 'hero'} className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.fadeBottom} aria-hidden />

      {/* Logo */}
      <div className={styles.logo}>
        <img src="/assets/d1fae.png" alt="Học viện Ngân hàng" className={styles.logoImg} />
      </div>

      {/* 2026 */}
      <AnimatePresence>
        {revealed && (
          <motion.div className={styles.year} aria-hidden key="year"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          >2026</motion.div>
        )}
      </AnimatePresence>

      {/* Portrait */}
      <div className={styles.portrait}>
        <img src="/assets/ngoc.png" alt="Ma Thế Ngọc" draggable={false} />
      </div>
      {/* GRADUATION */}
      <AnimatePresence>
        {revealed && (
          <motion.div className={styles.titles} key="graduation"
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0, ease }}
          >
            <img src="/assets/text.png" alt="GRADUATION" className={styles.gradImg} />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Scroll hint */}
      <AnimatePresence>
        {!revealed && (
          <motion.div className={styles.hint} key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <span>Cuộn để xem</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   width={18} height={18}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

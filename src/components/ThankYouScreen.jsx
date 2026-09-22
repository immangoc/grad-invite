import { useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './ThankYouScreen.module.css'

export default function ThankYouScreen({ id, isActive }) {
  const shown = useRef(false)
  if (isActive) shown.current = true
  return (
    <section id={id ?? 'thankyou'} className={styles.section}>

      {/* BG (static, không parallax khi snap-scroll) */}
      <div className={styles.bg} aria-hidden />

      {/* Dark overlay */}
      <div className={styles.overlay} aria-hidden />

      {/* Content */}
      <div className={styles.content}>
        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 20 }}
          animate={shown.current ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          Sự hiện diện của bạn là niềm vui lớn nhất!
        </motion.p>

        <motion.h2
          className={styles.thankYou}
          initial={{ opacity: 0, y: 30 }}
          animate={shown.current ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Thank you!
        </motion.h2>
      </div>

    </section>
  )
}

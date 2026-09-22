import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './RSVPScreen.module.css'

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function RSVPScreen({ id, isActive, onSubmit, onAdvance }) {
  const shown = useRef(false)
  if (isActive) shown.current = true
  const animate = shown.current ? 'visible' : 'hidden'

  const [name, setName]       = useState('')
  const [message, setMessage] = useState('')
  const [attend, setAttend]   = useState('')
  const [toast, setToast]     = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setToast({ text: 'Vui lòng nhập tên của bạn!', ok: false })
      setTimeout(() => setToast(null), 3000)
      return
    }

    const msg = attend === 'yes'
      ? `🎉 Cảm ơn ${name}! Hẹn gặp bạn ngày 26/9!`
      : `Cảm ơn ${name}! Rất tiếc khi bạn không thể đến.`

    setToast({ text: msg, ok: true })
    setTimeout(() => {
      setToast(null)
      if (onAdvance) onAdvance()
    }, 2000)

    if (onSubmit) onSubmit({ name, message, attend })
    setName(''); setMessage(''); setAttend('')
  }

  return (
    <section id={id ?? 'rsvp'} className={styles.section}>
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate={animate}
        className={styles.inner}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={animate}
        >
          {/* Title — Figma: Cormorant Garamond Bold, 32px */}
          <motion.h2 variants={item} className={styles.title}>
            Bạn có thể đến không?
          </motion.h2>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            {/* Name — pill shape, rounded-full */}
            <motion.div variants={item} className={styles.pill}>
              <input
                type="text"
                placeholder="Họ tên của bạn"
                value={name}
                onChange={e => setName(e.target.value)}
                className={styles.input}
                autoComplete="name"
              />
            </motion.div>

            {/* Message — rounded rect, tall */}
            <motion.div variants={item} className={styles.box}>
              <textarea
                placeholder="Gửi lời chúc đến tân cử nhân nhé..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={styles.textarea}
                rows={5}
              />
            </motion.div>

            {/* Attendance — pill with chevron dropdown (Figma exact) */}
            <motion.div variants={item} className={styles.selectWrap}>
              <select
                value={attend}
                onChange={e => setAttend(e.target.value)}
                className={styles.select}
              >
                <option value="" disabled>Bạn có thể tham dự không?</option>
                <option value="yes">Có, mình sẽ đến! 🎉</option>
                <option value="no">Rất tiếc, mình không đến được 😢</option>
              </select>
              {/* Chevron icon from Figma */}
              <span className={styles.chevron} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                     width={22} height={22}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </motion.div>

            {/* Submit button */}
            <motion.button
              variants={item}
              type="submit"
              className={styles.btnConfirm}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Xác nhận
            </motion.button>

          </form>

          {/* Cap footer */}
          <motion.div variants={item} className={styles.capWrap}>
            <img src="/assets/6045f.png" alt="" className={styles.cap} />
          </motion.div>

        </motion.div>
      </motion.div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${toast.ok ? styles.toastOk : styles.toastWarn}`}
            initial={{ opacity: 0, y: 60, x: '-50%' }}
            animate={{ opacity: 1, y: 0,  x: '-50%' }}
            exit={{    opacity: 0, y: 60,  x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

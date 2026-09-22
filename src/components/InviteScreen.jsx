import { useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './InviteScreen.module.css'

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function InviteScreen({ id, isActive }) {
  // Một khi đã active → giữ visible mãi dù scroll lên
  const shown = useRef(false)
  if (isActive) shown.current = true
  const animate = shown.current ? 'visible' : 'hidden'

  return (
    <section id={id ?? 'invite'} className={styles.section}>
      <motion.div
        className={styles.card}
        variants={cardVariants}
        initial="hidden"
        animate={animate}
      >
        <motion.div variants={staggerChildren} initial="hidden" animate={animate}>

          {/* Graduation cap illustration */}
          <motion.div variants={itemVariants} className={styles.capWrap}>
            <img src="/assets/6045f.png" alt="" className={styles.cap} />
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className={styles.subtitle}>
            Thân mời tới dự lễ tốt nghiệp của
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className={styles.name}
          >
            Ma Thế Ngọc
          </motion.h1>

          {/* Time */}
          <motion.p variants={itemVariants} className={styles.time}>
            14:00, Thứ Bảy
          </motion.p>

          {/* Date row — Tháng 9 | 26 | Năm 2026 */}
          <motion.div variants={itemVariants} className={styles.dateRow}>
            <div className={styles.dateLabel}>
              <hr className={styles.hr} />
              <span>Tháng 9</span>
              <hr className={styles.hr} />
            </div>
            <span className={styles.dateDay}>26</span>
            <div className={styles.dateLabel}>
              <hr className={styles.hr} />
              <span>Năm 2026</span>
              <hr className={styles.hr} />
            </div>
          </motion.div>

          {/* Location */}
          <motion.p variants={itemVariants} className={styles.locLabel}>Địa điểm</motion.p>
          <motion.p variants={itemVariants} className={styles.venue}>
            Tòa D1, Học viện Ngân hàng
          </motion.p>
          <motion.p variants={itemVariants} className={styles.address}>
            12 Chùa Bộc, Quang Trung, Đống Đa, Hà Nội
          </motion.p>

          {/* Cat photo + Direction button stacked */}
          <motion.div variants={itemVariants} className={styles.ctaWrap}>
            {/* Figma: cat graduation photo floats above button */}
            <img src="/assets/fd35c.png" alt="" className={styles.catImg} />
            <motion.a
              className={styles.btnDir}
              href="https://maps.google.com/?q=Học+viện+Ngân+hàng,+12+Chùa+Bộc,+Hà+Nội"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              🐾 Chỉ đường
            </motion.a>
          </motion.div>

        </motion.div>
      </motion.div>
    </section>
  )
}

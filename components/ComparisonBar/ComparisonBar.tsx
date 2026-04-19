"use client";

import React from 'react';
import styles from './ComparisonBar.module.css';
import { useComparison } from '@/context/ComparisonContext';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const barVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' as const }
  }
};

const tagVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 22 }
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

export default function ComparisonBar() {
  const { selectedDeals, removeDeal, clearSelection, setComparisonOpen } = useComparison();
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence>
      {selectedDeals.length > 0 && (
        <motion.div
          className={styles.comparisonBarWrapper}
          variants={barVariants}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
          exit="exit"
        >
          <div className={styles.comparisonBar}>
            <div className={styles.infoSection}>
              <motion.div
                className={styles.countBadge}
                key={selectedDeals.length}
                initial={prefersReduced ? {} : { scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' as const, stiffness: 500, damping: 18 }}
              >
                {selectedDeals.length}
              </motion.div>
              <span className={styles.label}>Funding deals selected to compare</span>
            </div>

            <div className={styles.startupsList}>
              <AnimatePresence>
                {selectedDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    className={styles.startupTag}
                    variants={tagVariants}
                    initial={prefersReduced ? 'visible' : 'hidden'}
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <span className={styles.tagName}>{deal.name}</span>
                    <motion.button 
                      className={styles.removeBtn} 
                      onClick={() => removeDeal(deal.id)}
                      aria-label={`Remove ${deal.name}`}
                      whileHover={prefersReduced ? {} : { scale: 1.15 }}
                      whileTap={prefersReduced ? {} : { scale: 0.85 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className={styles.actions}>
              <motion.button
                className={styles.clearBtn}
                onClick={clearSelection}
                whileHover={prefersReduced ? {} : { scale: 1.04 }}
                whileTap={prefersReduced ? {} : { scale: 0.96 }}
              >
                Clear All
              </motion.button>
              <motion.button 
                className={styles.compareBtn} 
                disabled={selectedDeals.length < 2}
                onClick={() => setComparisonOpen(true)}
                whileHover={(!prefersReduced && selectedDeals.length >= 2) ? { scale: 1.04, y: -1 } : {}}
                whileTap={(!prefersReduced && selectedDeals.length >= 2) ? { scale: 0.97 } : {}}
              >
                Compare Deals
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

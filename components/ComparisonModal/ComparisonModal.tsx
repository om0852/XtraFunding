"use client";

import React, { useState } from 'react';
import styles from './ComparisonModal.module.css';
import { useComparison } from '@/context/ComparisonContext';
import { toast } from 'sonner';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type Step = 'preferences' | 'loading' | 'results';

// ── Animation Variants ─────────────────────────────────
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.18 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.18, ease: 'easeIn' as const }
  }
};

const cardContainerVariants = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  }
};

const conclusionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, delay: 0.25 }
  }
};

function getScoreClass(score: number) {
  if (score >= 80) return styles.scoreValHigh;
  if (score >= 60) return styles.scoreValMid;
  return styles.scoreValLow;
}

export default function ComparisonModal() {
  const { isComparisonOpen, setComparisonOpen, selectedDeals } = useComparison();
  const [step, setStep] = useState<Step>('preferences');
  const [results, setResults] = useState<any>(null);
  const prefersReduced = useReducedMotion();
  
  const [preferences, setPreferences] = useState({
    horizon: 'Long-term (5-10 yrs)',
    risk: 'Moderate',
    goal: 'Capital Appreciation',
    focus: ''
  });

  const handleStartComparison = async () => {
    setStep('loading');
    
    try {
      const res = await fetch('/api/investor/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealIds: selectedDeals.map(s => s.id),
          preferences
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setResults(data.comparison);
        setStep('results');
      } else {
        toast.error(data.error || "Failed to generate comparison");
        setStep('preferences');
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setStep('preferences');
    }
  };

  const handleClose = () => {
    setComparisonOpen(false);
    setTimeout(() => {
      setStep('preferences');
      setResults(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isComparisonOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              className={styles.closeIcon}
              onClick={handleClose}
              whileHover={prefersReduced ? {} : { scale: 1.05 }}
              whileTap={prefersReduced ? {} : { scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </motion.button>

            <div className={styles.modalInner}>
              <AnimatePresence mode="wait">
                {/* ── PREFERENCES STEP ─────────────────── */}
                {step === 'preferences' && (
                  <motion.div
                    key="preferences"
                    className={styles.content}
                    initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.header}>
                      <div className={styles.headerRow}>
                        <div className={styles.headerIcon}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        </div>
                        <div className={styles.headerText}>
                          <span className={styles.aiBadge}>Gemini Analyst</span>
                          <span className={styles.headerTitle}>Deal Comparison Engine</span>
                        </div>
                      </div>

                      <h2 className={styles.title}>Configure your investment criteria</h2>
                      <p className={styles.subtitle}>We'll cross-reference XRate financial reports with your preferences to surface the best match.</p>
                    </div>

                    {/* Selected deals preview */}
                    <div className={styles.selectedDeals}>
                      {selectedDeals.map(deal => (
                        <div key={deal.id} className={styles.dealChip}>
                          <span className={styles.dealChipDot}></span>
                          {deal.name}
                        </div>
                      ))}
                    </div>

                    <div className={styles.form}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Investment Horizon</label>
                          <select 
                            value={preferences.horizon} 
                            onChange={(e) => setPreferences({...preferences, horizon: e.target.value})}
                          >
                            <option>Short-term (1-3 yrs)</option>
                            <option>Medium-term (3-5 yrs)</option>
                            <option>Long-term (5-10 yrs)</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Primary Goal</label>
                          <select 
                            value={preferences.goal} 
                            onChange={(e) => setPreferences({...preferences, goal: e.target.value})}
                          >
                            <option>Capital Appreciation</option>
                            <option>Regular Dividends</option>
                            <option>Strategic Synergy</option>
                            <option>Social/Environmental Impact</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Risk Tolerance</label>
                        <div className={styles.radioGroup}>
                          {['Low', 'Moderate', 'High'].map(r => (
                            <motion.button 
                              key={r}
                              className={preferences.risk === r ? styles.radioActive : ''}
                              onClick={() => setPreferences({...preferences, risk: r})}
                              whileTap={prefersReduced ? {} : { scale: 0.98 }}
                            >
                              {r}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Specific Focus (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. AI ethics, female founders, clean energy…" 
                          value={preferences.focus}
                          onChange={(e) => setPreferences({...preferences, focus: e.target.value})}
                        />
                      </div>

                      <motion.button
                        className={styles.primaryBtn}
                        onClick={handleStartComparison}
                        whileHover={prefersReduced ? {} : { y: -1 }}
                        whileTap={prefersReduced ? {} : { scale: 0.99 }}
                      >
                        Run Analysis
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── LOADING STEP ─────────────────────── */}
                {step === 'loading' && (
                  <motion.div
                    key="loading"
                    className={styles.loadingState}
                    initial={prefersReduced ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.spinnerContainer}>
                      <div className={styles.spinner}></div>
                      <div className={styles.spinnerIconCenter}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                      </div>
                    </div>
                    <h3 className={styles.loadingTitle}>Cross-referencing XRate data</h3>
                    <p className={styles.loadingText}>Analyzing financial metrics, risk vectors, and growth indicators for {selectedDeals.length} deals.</p>
                    <div className={styles.loadingDots}>
                      <div className={styles.loadingDot}></div>
                      <div className={styles.loadingDot}></div>
                      <div className={styles.loadingDot}></div>
                    </div>
                  </motion.div>
                )}

                {/* ── RESULTS STEP ─────────────────────── */}
                {step === 'results' && results && (
                  <motion.div
                    key="results"
                    className={styles.resultsContent}
                    initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.header}>
                      <div className={styles.headerRow}>
                        <div className={styles.headerIcon}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div className={styles.headerText}>
                          <span className={styles.aiBadge}>Analysis Complete</span>
                          <span className={styles.headerTitle}>Comparison Results</span>
                        </div>
                      </div>
                      <h2 className={styles.title}>Your Strategic Match</h2>
                    </div>

                    <motion.div
                      className={styles.resultsGrid}
                      variants={cardContainerVariants}
                      initial={prefersReduced ? 'visible' : 'hidden'}
                      animate="visible"
                    >
                      {(results.deals || results.startups || []).map((s: any) => (
                        <motion.div
                          key={s.id}
                          className={`${styles.resultCard} ${s.recommendation === 'TOP_PICK' ? styles.recommendationCard : ''}`}
                          variants={cardVariants}
                        >
                          {s.recommendation === 'TOP_PICK' && <div className={styles.winnerBadge}>Top Pick</div>}
                          <div className={styles.resCardHeader}>
                            <h4>{s.name}</h4>
                            <div className={styles.suitabilityScore}>
                              <span className={`${styles.scoreVal} ${getScoreClass(s.suitabilityScore)}`}>{s.suitabilityScore}%</span>
                              <span className={styles.scoreLabel}>Match</span>
                            </div>
                          </div>
                          
                          <div className={styles.metricsRow}>
                            <div className={styles.miniMetric}>
                              <span className={styles.mmLabel}>XRate Score</span>
                              <span className={styles.mmVal}>{s.xrateScore}</span>
                            </div>
                            <div className={styles.miniMetric}>
                              <span className={styles.mmLabel}>Risk Score</span>
                              <span className={styles.mmVal}>{s.riskScore}</span>
                            </div>
                          </div>

                          <div className={styles.rationale}>
                            <h5>Why this deal?</h5>
                            <p>{s.suitabilityRationale}</p>
                          </div>

                          <div className={styles.prosCons}>
                            <div>
                              <h6>Key Advantage</h6>
                              <p>{s.keyAdvantage}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      className={styles.aiConclusion}
                      variants={conclusionVariants}
                      initial={prefersReduced ? 'visible' : 'hidden'}
                      animate="visible"
                    >
                      <div className={styles.aiConclusionHeader}>
                        <div className={styles.aiConclusionIcon}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/></svg>
                        </div>
                        <h4>Analyst Summary</h4>
                      </div>
                      <p>{results.overallConclusion}</p>
                    </motion.div>

                    <div className={styles.bottomActions}>
                      <motion.button
                        className={styles.outlineBtn}
                        onClick={() => setStep('preferences')}
                        whileTap={prefersReduced ? {} : { scale: 0.98 }}
                      >
                        Adjust Criteria
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

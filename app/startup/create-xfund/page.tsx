"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBlockchainCampaign } from '@/lib/web3';
import { toast } from 'sonner';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  LayoutGroup
} from 'framer-motion';

// ── Animation Variants ─────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }
};

const formContainerVariants = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.2 } }
};

const fieldVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(3px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  }
};

const warningVariants = {
  initial: { opacity: 0, scale: 0.9, x: 4 },
  animate: {
    opacity: 1, scale: 1, x: 0,
    transition: { type: 'spring' as const, stiffness: 500, damping: 22 }
  },
  exit: { opacity: 0, scale: 0.9, x: 4, transition: { duration: 0.15 } }
};

const conditionalFieldVariants = {
  initial: { opacity: 0, height: 0, y: -8 },
  animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
  exit: { opacity: 0, height: 0, y: -8, transition: { duration: 0.22, ease: 'easeIn' as const } }
};

// ── Icon for header ────────────────────────────────────────────────
const RocketIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

export default function CreateXFundPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    sector: '',
    stage: 'Seed',
    tagline: '',
    pitch: '',
    fundingGoal: '',
    minimumInvestment: '',
    endDate: '',
    location: '',
    fundingModel: 'XFund' as 'XFund' | 'XRaise',
    fundingType: 'Equity' as 'Equity' | 'Debt',
    equityOffered: '',
    interestRate: '',
    repaymentMonths: '',
    xrateReportId: ''
  });

  const fetchReports = (id: string) => {
    setReportsLoading(true);
    fetch(`/api/xrate?ownerId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setReports(data.reports);
        setReportsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setReportsLoading(false);
      });
  };

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
      fetchReports(storedId);
    } else {
      setReportsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.xrateReportId) {
      toast.error("Please select a verified XRate Report to link to this campaign.");
      return;
    }

    setLoading(true);

    try {
      let onChainCampaignId: number | undefined;

      if (formData.fundingModel === 'XFund') {
        const end = new Date(formData.endDate);
        const now = new Date();
        const diffTime = Math.abs(end.getTime() - now.getTime());
        const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const goalAmount = Number(formData.fundingGoal);
        const mockEthGoal = (goalAmount / 250000).toFixed(6);

        const web3Res = await createBlockchainCampaign(mockEthGoal, durationDays);

        if (!web3Res.success) {
          throw new Error(web3Res.error || "Failed resolving blockchain synchrony");
        }

        onChainCampaignId = web3Res.campaignId;
      }

      const payload = {
        ...formData,
        founderId: userId,
        fundingModel: formData.fundingModel,
        fundingGoal: Number(formData.fundingGoal),
        minimumInvestment: Number(formData.minimumInvestment),
        equityOffered: formData.fundingType === 'Equity' ? Number(formData.equityOffered) : undefined,
        interestRate: formData.fundingType === 'Debt' ? Number(formData.interestRate) : undefined,
        repaymentMonths: formData.fundingType === 'Debt' ? Number(formData.repaymentMonths) : undefined,
        endDate: new Date(formData.endDate),
        onChainCampaignId,
        xrateReportId: formData.xrateReportId
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${formData.fundingModel} campaign created successfully!`);
        router.push('/startup/dashboard');
      } else {
        toast.error(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.pageContainer}
      variants={pageVariants}
      initial={prefersReduced ? 'visible' : 'hidden'}
      animate="visible"
    >
      <div className={styles.formCard}>
        {/* Header */}
        <motion.div
          className={styles.header}
          variants={headerVariants}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
        >
          <div className={styles.headerIcon}>
            <RocketIcon />
          </div>
          <h1 className={styles.title}>Create your XFund</h1>
          <p className={styles.subtitle}>
            Fill in the details below to start raising funds from the crowd or attract premium investors.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            className={styles.formGrid}
            variants={formContainerVariants}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate="visible"
          >
            {/* Section: Basics */}
            <motion.div className={styles.sectionLabel} variants={fieldVariants}>
              Campaign Basics
            </motion.div>

            {/* Title */}
            <motion.div className={`${styles.inputGroup} ${styles.fieldFull}`} variants={fieldVariants}>
              <label className={styles.label}>Campaign Title</label>
              <input
                name="title"
                className={styles.input}
                placeholder="e.g. GreenHarvest AI Revolution"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </motion.div>

            {/* Sector */}
            <motion.div className={styles.inputGroup} variants={fieldVariants}>
              <label className={styles.label}>Sector</label>
              <input
                name="sector"
                className={styles.input}
                placeholder="e.g. AgriTech, FinTech…"
                required
                value={formData.sector}
                onChange={handleChange}
              />
            </motion.div>

            {/* Stage */}
            <motion.div className={styles.inputGroup} variants={fieldVariants}>
              <label className={styles.label}>Stage</label>
              <select
                name="stage"
                className={styles.input}
                value={formData.stage}
                onChange={handleChange}
              >
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
            </motion.div>

            {/* Tagline */}
            <motion.div className={`${styles.inputGroup} ${styles.fieldFull}`} variants={fieldVariants}>
              <label className={styles.label}>Tagline</label>
              <input
                name="tagline"
                className={styles.input}
                placeholder="A short punchy sentence about your startup"
                required
                value={formData.tagline}
                onChange={handleChange}
              />
            </motion.div>

            {/* Pitch */}
            <motion.div className={`${styles.inputGroup} ${styles.fieldFull}`} variants={fieldVariants}>
              <label className={styles.label}>The Pitch</label>
              <textarea
                name="pitch"
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Describe what you are building and why…"
                required
                value={formData.pitch}
                onChange={handleChange}
              />
            </motion.div>

            {/* Section: Funding */}
            <motion.div className={styles.sectionLabel} variants={fieldVariants}>
              Funding Structure
            </motion.div>

            {/* Funding Model */}
            <motion.div className={`${styles.inputGroup} ${styles.fieldFull}`} variants={fieldVariants}>
              <label className={styles.label}>Goal Context (Funding Model)</label>
              <LayoutGroup id="fundingModel">
                <div className={styles.typeSelector}>
                  {(['XFund', 'XRaise'] as const).map((model) => (
                    <motion.button
                      key={model}
                      type="button"
                      className={`${styles.typeBtn} ${formData.fundingModel === model ? styles.typeBtnActive : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, fundingModel: model }))}
                      whileHover={prefersReduced ? {} : { y: -1 }}
                      whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    >
                      {model === 'XFund' ? '🏦 XFund (Crowdfunding)' : '🤝 XRaise (One-to-One Bidding)'}
                    </motion.button>
                  ))}
                </div>
              </LayoutGroup>
            </motion.div>

            {/* Funding Goal */}
            <motion.div className={styles.inputGroup} variants={fieldVariants}>
              <label className={styles.label}>Funding Goal (₹)</label>
              <input
                name="fundingGoal"
                type="number"
                className={styles.input}
                placeholder={formData.fundingModel === 'XRaise' ? "e.g. 1000000 (Target)" : "e.g. 1500000"}
                required
                value={formData.fundingGoal}
                onChange={handleChange}
              />
            </motion.div>

            {/* Min Investment */}
            <motion.div className={styles.inputGroup} variants={fieldVariants}>
              <label className={styles.label}>Min Investment (₹)</label>
              <input
                name="minimumInvestment"
                type="number"
                className={styles.input}
                placeholder="e.g. 5000"
                required
                value={formData.minimumInvestment}
                onChange={handleChange}
              />
            </motion.div>

            {/* Funding Type */}
            <motion.div className={`${styles.inputGroup} ${styles.fieldFull}`} variants={fieldVariants}>
              <label className={styles.label}>Funding Type</label>
              <LayoutGroup id="fundingType">
                <div className={styles.typeSelector}>
                  {(['Equity', 'Debt'] as const).map((type) => (
                    <motion.button
                      key={type}
                      type="button"
                      className={`${styles.typeBtn} ${formData.fundingType === type ? styles.typeBtnActive : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, fundingType: type }))}
                      whileHover={prefersReduced ? {} : { y: -1 }}
                      whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    >
                      {type === 'Equity' ? '📈 Equity Stake' : '💳 Debt (Loan)'}
                    </motion.button>
                  ))}
                </div>
              </LayoutGroup>
            </motion.div>

            {/* Conditional — Equity / Debt Fields */}
            <AnimatePresence mode="wait">
              {formData.fundingType === 'Equity' ? (
                <motion.div
                  key="equity"
                  className={`${styles.inputGroup} ${styles.fieldFull}`}
                  variants={conditionalFieldVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <label className={styles.label}>Total Equity Offered (%)</label>
                  <input
                    name="equityOffered"
                    type="number"
                    step="0.1"
                    className={styles.input}
                    placeholder="e.g. 8"
                    required
                    value={formData.equityOffered}
                    onChange={handleChange}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="debt"
                  className={styles.fieldFull}
                  variants={conditionalFieldVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Flat Return Percentage (%)</label>
                    <input
                      name="interestRate"
                      type="number"
                      step="0.1"
                      className={styles.input}
                      placeholder="e.g. 12"
                      required
                      value={formData.interestRate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Repayment Period (Months)</label>
                    <input
                      name="repaymentMonths"
                      type="number"
                      className={styles.input}
                      placeholder="e.g. 18"
                      required
                      value={formData.repaymentMonths}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section: Details */}
            <motion.div className={styles.sectionLabel} variants={fieldVariants}>
              Campaign Details
            </motion.div>

            {/* End Date */}
            <motion.div className={styles.inputGroup} variants={fieldVariants}>
              <label className={styles.label}>Campaign End Date</label>
              <input
                name="endDate"
                type="date"
                className={styles.input}
                required
                value={formData.endDate}
                onChange={handleChange}
              />
            </motion.div>

            {/* Location */}
            <motion.div className={styles.inputGroup} variants={fieldVariants}>
              <label className={styles.label}>Location</label>
              <input
                name="location"
                className={styles.input}
                placeholder="e.g. Mumbai, India"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </motion.div>

            {/* Section: Verification */}
            <motion.div className={styles.sectionLabel} variants={fieldVariants}>
              Institutional Verification
            </motion.div>

            {/* XRate Report */}
            <motion.div className={`${styles.inputGroup} ${styles.fieldFull}`} variants={fieldVariants}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className={styles.label}>Link Institutional XRate Report</label>
                <motion.button
                  type="button"
                  className={styles.btnLink}
                  onClick={() => userId && fetchReports(userId)}
                  whileHover={prefersReduced ? {} : { scale: 1.05 }}
                  whileTap={prefersReduced ? {} : { scale: 0.95 }}
                >
                  ↻ Refresh
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {reportsLoading ? (
                  <motion.div
                    key="loading"
                    className={styles.reportLoader}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Scanning for institutional analyses…
                  </motion.div>
                ) : reports.length === 0 ? (
                  <motion.div
                    key="no-reports"
                    className={styles.noReportsBox}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>
                      No verified institutional analyses found. Every campaign requires a linked XRate report to be visible to investors.
                    </p>
                    <Link href="/startup/xrate">
                      <motion.button
                        type="button"
                        className={styles.btnPrimarySmall}
                        whileHover={prefersReduced ? {} : { scale: 1.03, y: -1 }}
                        whileTap={prefersReduced ? {} : { scale: 0.97 }}
                      >
                        Generate XRate Report Now
                      </motion.button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.select
                    key="select"
                    name="xrateReportId"
                    className={styles.input}
                    required
                    value={formData.xrateReportId}
                    onChange={handleChange}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <option value="">Select a verified report…</option>
                    {reports.map((r: any) => (
                      <option key={r._id} value={r._id}>
                        {r.startupName} — {new Date(r.createdAt).toLocaleDateString()} (Score: {r.overallScore})
                      </option>
                    ))}
                  </motion.select>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Actions */}
            <motion.div className={styles.actions} variants={fieldVariants}>
              <motion.button
                type="button"
                className={styles.btnSecondary}
                onClick={() => router.back()}
                whileHover={prefersReduced ? {} : { y: -1 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
              >
                Cancel
              </motion.button>

              <div className={styles.submitWrapper}>
                <AnimatePresence>
                  {!formData.xrateReportId && reports.length > 0 && (
                    <motion.span
                      className={styles.warningText}
                      variants={warningVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      XRate report selection required
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={loading || !formData.xrateReportId}
                  whileHover={(!loading && formData.xrateReportId && !prefersReduced)
                    ? { scale: 1.03, y: -1 }
                    : {}
                  }
                  whileTap={(!loading && formData.xrateReportId && !prefersReduced)
                    ? { scale: 0.97 }
                    : {}
                  }
                  layout
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Broadcasting to Ethereum…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
                        </svg>
                        Launch XFund
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>

          </motion.div>
        </form>
      </div>

      {/* Global spin keyframe */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}

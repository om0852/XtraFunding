"use client";

import React, { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion
} from 'framer-motion';

// ── Animated Counter Hook ──────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setValue(target);
      return;
    }
    
    // Animate always when target changes (removed inView requirement for reliability)
    let startTime: number;
    let animationFrame: number;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setValue(Math.round(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, prefersReduced]);

  return { value };
}

// ── Animation Variants ─────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } }
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } }
};

// ── Skeleton Loader ────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div className={styles.loading}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonBlock} style={{ width: 220, height: 32 }} />
        <div className={styles.skeletonBlock} style={{ width: 130, height: 40 }} />
      </div>
      <div className={styles.skeletonBlock} style={{ height: 200, borderRadius: 20 }} />
      <div style={{ display: 'flex', gap: 20 }}>
        <div className={styles.skeletonBlock} style={{ flex: '0 0 58%', height: 180, borderRadius: 16 }} />
        <div className={styles.skeletonBlock} style={{ flex: 1, height: 180, borderRadius: 16 }} />
      </div>
    </div>
  );
}

// ── Animated Progress Bar ──────────────────────────────────────────
function AnimatedProgressBar({ percentage }: { percentage: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = useReducedMotion();

  return (
    <div className={styles.progressBarContainerLarge} ref={ref}>
      <motion.div
        className={styles.progressBarFillLarge}
        initial={{ width: 0 }}
        animate={inView ? { width: `${percentage}%` } : { width: 0 }}
        transition={prefersReduced
          ? { duration: 0 }
          : { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
        }
      />
    </div>
  );
}

export default function StartupDashboard() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [repairing, setRepairing] = useState(false);

  const fetchDashboardData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/auth'); return; }

    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (data.success) {
        // Robust filtering in case founderId is returned as an object
        const userCampaigns = data.campaigns.filter((c: any) => 
          c.founderId.toString() === userId || 
          (c.founderId?._id && c.founderId._id.toString() === userId)
        );
        setCampaigns(userCampaigns);

        const reportRes = await fetch(`/api/xrate?ownerId=${userId}`);
        const reportData = await reportRes.json();
        if (reportData.success) setReports(reportData.reports);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const campaign = campaigns[activeCampaignIdx];

  useEffect(() => {
    if (campaign?.fundingModel === 'XRaise') {
      fetch(`/api/negotiations?campaignId=${campaign._id}`)
        .then(res => res.json())
        .then(negData => {
          if (negData.success) setNegotiations(negData.data);
          else setNegotiations([]);
        })
        .catch(() => setNegotiations([]));
    } else {
      setNegotiations([]);
    }
  }, [campaign]);

  const handleRepairLinkage = async () => {
    if (!campaign || !selectedReportId) return;
    setRepairing(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign._id}/link`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xrateReportId: selectedReportId, founderId: localStorage.getItem('userId') })
      });
      const data = await res.json();
      if (data.success) {
        const updated = [...campaigns];
        updated[activeCampaignIdx].xrateReportId = selectedReportId;
        setCampaigns(updated);
        toast.success('Institutional linkage repaired successfully!');
      } else {
        toast.error(data.error || 'Failed to repair linkage');
      }
    } catch {
      toast.error('Something went wrong during repair');
    } finally {
      setRepairing(false);
    }
  };

  // Animated counter for raised amount
  const raisedAmount = Number(campaign?.amountRaised ?? 0);
  const { value: animatedRaised } = useAnimatedCounter(raisedAmount, 1400);

  if (loading) return <SkeletonLoader />;

  const fundingPercent = campaign
    ? Math.min((campaign.amountRaised / campaign.fundingGoal) * 100, 100)
    : 0;

  return (
    <motion.main
      className={styles.content}
      variants={pageVariants}
      initial={prefersReduced ? 'visible' : 'hidden'}
      animate="visible"
    >
      {/* Header */}
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Campaign Overview</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            className={styles.btnSecondary}
            onClick={() => fetchDashboardData()}
            whileHover={prefersReduced ? {} : { scale: 1.05 }}
            whileTap={prefersReduced ? {} : { scale: 0.95 }}
            title="Refresh Totals"
          >
            🔄 Sync
          </motion.button>
          <Link href="/startup/create-xfund">
            <motion.button
              className={styles.btnCreate}
              whileHover={prefersReduced ? {} : { scale: 1.04, y: -1 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
            >
              + New Campaign
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Campaign Selector tabs */}
      {campaigns.length > 1 && (
        <motion.div
          className={styles.campaignSelector}
          initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          {campaigns.map((camp, idx) => (
            <motion.button
              key={camp._id}
              className={`${styles.campaignSelectorBtn} ${activeCampaignIdx === idx ? styles.campaignSelectorBtnActive : ''}`}
              onClick={() => setActiveCampaignIdx(idx)}
              whileHover={prefersReduced ? {} : { y: -1 }}
              whileTap={prefersReduced ? {} : { scale: 0.97 }}
            >
              {camp.title}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* No Campaign */}
      <AnimatePresence mode="wait">
        {!campaign ? (
          <motion.div
            key="empty"
            className={styles.emptyState}
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className={styles.emptyIcon}
              animate={prefersReduced ? {} : {
                y: [0, -14, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🚀
            </motion.div>
            <h2>No active campaigns found</h2>
            <p>You haven't launched a funding campaign yet.</p>
            <Link href="/startup/create-xfund">
              <motion.button
                className={styles.btnPrimaryLarge}
                whileHover={prefersReduced ? {} : { scale: 1.04, y: -2 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
              >
                Launch XFund or XRaise
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="campaign"
            variants={containerVariants}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate="visible"
          >
            {/* Tags */}
            <motion.div className={styles.subtext} variants={cardVariants}>
              <span className={styles.subtextTag}>{campaign.title}</span>
              <span className={styles.subtextTag}>{campaign.sector}</span>
              <span className={styles.subtextTag}>{campaign.stage}</span>
              <span className={styles.subtextTagGold}>
                {campaign.fundingModel === 'XRaise' ? 'XRaise (Auction)' : 'XFund (Crowd)'}
              </span>
            </motion.div>

            {/* Repair Notice */}
            <AnimatePresence>
              {!campaign.xrateReportId && (
                <motion.div
                  className={styles.repairNotice}
                  initial={prefersReduced ? {} : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className={styles.repairInfo}>
                    <h4>⚠️ Missing Institutional Analysis</h4>
                    <p>Investors cannot compare this deal without a linked XRate report.</p>
                  </div>
                  <div className={styles.repairActions}>
                    <select
                      className={styles.repairSelect}
                      value={selectedReportId}
                      onChange={(e) => setSelectedReportId(e.target.value)}
                    >
                      <option value="">Select verified report...</option>
                      {reports.map(r => (
                        <option key={r._id} value={r._id}>
                          {r.startupName} (Score: {r.overallScore})
                        </option>
                      ))}
                    </select>
                    <motion.button
                      className={styles.btnRepair}
                      onClick={handleRepairLinkage}
                      disabled={repairing || !selectedReportId}
                      whileHover={prefersReduced ? {} : { scale: 1.03 }}
                      whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    >
                      {repairing ? 'Linking…' : 'Link Analysis'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Campaign Card — XFund */}
            {campaign.fundingModel === 'XFund' ? (
              <motion.div className={styles.campaignCard} variants={cardVariants}>
                <div className={styles.campaignLeft}>
                  <div className={styles.fundingLabel}>Funding Progress</div>
                  <div className={styles.fundingAmountWrapper}>
                    <div className={styles.fundingAmount}>
                      ₹{animatedRaised.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className={styles.fundingGoal}>
                    raised of ₹{campaign.fundingGoal.toLocaleString('en-IN')} goal
                  </div>

                  <AnimatedProgressBar 
                    percentage={campaign.amountRaised > 0 && fundingPercent < 1 ? 1 : fundingPercent} 
                  />

                  <div className={styles.statsRow}>
                    <span className={`${styles.statItem} ${styles.statBlue}`}>
                      {fundingPercent > 0 && fundingPercent < 0.1 
                        ? '< 0.1%' 
                        : `${fundingPercent.toFixed(1)}%`
                      } Funded
                    </span>
                    <div className={styles.statDivider} />
                    <span className={`${styles.statItem} ${styles.statGray}`}>Active</span>
                    <div className={styles.statDivider} />
                    <span className={`${styles.statItem} ${styles.statAmber}`}>
                      {campaign.status === 'Funded' ? 'Goal Reached! 🎉' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div className={styles.campaignRight}>
                  <motion.div
                    className={styles.countdownCircle}
                    animate={prefersReduced ? {} : {
                      boxShadow: [
                        '0 0 0 3px rgba(245,166,35,0.15), 0 0 0 6px rgba(245,166,35,0.05)',
                        '0 0 0 3px rgba(245,166,35,0.35), 0 0 0 6px rgba(245,166,35,0.12)',
                        '0 0 0 3px rgba(245,166,35,0.15), 0 0 0 6px rgba(245,166,35,0.05)'
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className={styles.countdownValue}>
                      {campaign.status === 'Funded' ? '✓' : '!!'}
                    </div>
                    <div className={styles.countdownLabel}>{campaign.status}</div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* Campaign Card — XRaise Deal Table */
              <motion.div className={styles.tableWrapper} variants={cardVariants} style={{ marginTop: 0 }}>
                <h2 className={styles.tableTitle}>Deal Pipeline (Bids)</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Investor</th>
                      <th className={styles.th}>Latest Bid</th>
                      <th className={styles.th}>Equity</th>
                      <th className={styles.th}>Status</th>
                      <th className={styles.th}>Exchanges</th>
                      <th className={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {negotiations.length === 0 ? (
                        <motion.tr
                          key="empty-row"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan={6} style={{
                            textAlign: 'center', padding: '48px',
                            color: '#9CA3AF', fontSize: '14px'
                          }}>
                            No bids received yet.
                          </td>
                        </motion.tr>
                      ) : (
                        negotiations.map((neg: any, i: number) => {
                          const latestOffer = neg.offers[neg.offers.length - 1];
                          return (
                            <motion.tr
                              key={neg._id}
                              className={styles.tr}
                              variants={rowVariants}
                              initial={prefersReduced ? 'visible' : 'hidden'}
                              animate="visible"
                              transition={{ delay: i * 0.06 }}
                            >
                              <td className={`${styles.td} ${styles.investorName}`}>
                                {neg.investorId.name}
                              </td>
                              <td className={styles.td}>₹{latestOffer.amount.toLocaleString('en-IN')}</td>
                              <td className={styles.td}>{latestOffer.equity}%</td>
                              <td className={styles.td}>
                                <span className={
                                  neg.status === 'Accepted' ? styles.badgeGreen :
                                  neg.status === 'Rejected' ? styles.badgeGray : styles.badgeAmber
                                }>
                                  {neg.status}
                                </span>
                              </td>
                              <td className={styles.td}>{neg.offers.length}</td>
                              <td className={styles.td}>
                                <Link href={`/xraise?id=${neg._id}`}>
                                  <motion.button
                                    className={styles.btnReview}
                                    whileHover={prefersReduced ? {} : { scale: 1.04 }}
                                    whileTap={prefersReduced ? {} : { scale: 0.96 }}
                                  >
                                    Negotiate
                                  </motion.button>
                                </Link>
                              </td>
                            </motion.tr>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Bottom Two-column Cards */}
            <div className={styles.gridTwoCol}>
              <motion.div className={`${styles.card} ${styles.colLeft}`} variants={cardVariants}>
                <h2 className={styles.cardTitle}>Funding Terms</h2>
                <div className={styles.termsBox}>
                  <div className={styles.termRow}>
                    <span>Funding Type</span>
                    <span className={styles.termVal}>{campaign.fundingType}</span>
                  </div>
                  {campaign.fundingType === 'Equity' ? (
                    <div className={styles.termRow}>
                      <span>Equity Offered</span>
                      <span className={styles.termVal}>{campaign.equityOffered}%</span>
                    </div>
                  ) : (
                    <>
                      <div className={styles.termRow}>
                        <span>Flat Return</span>
                        <span className={styles.termVal}>{campaign.interestRate}%</span>
                      </div>
                      <div className={styles.termRow}>
                        <span>Repayment Period</span>
                        <span className={styles.termVal}>{campaign.repaymentMonths} Months</span>
                      </div>
                    </>
                  )}
                  <div className={styles.termRow}>
                    <span>Target Funding</span>
                    <span className={styles.termVal}>
                      ₹{campaign.fundingGoal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div className={`${styles.card} ${styles.colRight}`} variants={cardVariants}>
                <h2 className={styles.cardTitle}>Disbursement Status</h2>
                <div className={styles.disburseContent}>
                  {campaign.status === 'Funded' ? (
                    <div className={styles.successMsg}>
                      <h3>Project Funded! 🎉</h3>
                      <p>
                        Total amount of ₹{campaign.amountRaised.toLocaleString('en-IN')} is now being processed.
                      </p>
                      <motion.button
                        className={styles.btnGoldFull}
                        whileHover={prefersReduced ? {} : { scale: 1.02, y: -1 }}
                        whileTap={prefersReduced ? {} : { scale: 0.98 }}
                      >
                        Initiate Disbursement
                      </motion.button>
                    </div>
                  ) : (
                    <div className={styles.pendingMsg}>
                      <p>
                        Funds will be delivered once a deal is struck (XRaise) or goal met (XFund).
                      </p>
                      <div className={styles.remainingAmount}>
                        {campaign.fundingModel === 'XFund'
                          ? `₹${(campaign.fundingGoal - campaign.amountRaised).toLocaleString('en-IN')} remaining`
                          : 'Awaiting best offer'}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

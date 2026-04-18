"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StartupDashboard() {
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/auth');
        return;
      }

      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        if (data.success) {
          // Find the campaign for this founder
          const userCampaign = data.campaigns.find((c: any) => c.founderId === userId);
          setCampaign(userCampaign);
        }
      } catch (err) {
        console.error('Failed to fetch campaign', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [router]);

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <main className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Campaign Overview</h1>
        {!campaign && (
          <Link href="/startup/create-xfund">
            <button className={styles.btnCreate}>+ Create New XFund</button>
          </Link>
        )}
      </div>

      {!campaign ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🚀</div>
          <h2>No active XFund found</h2>
          <p>You haven't launched a funding campaign yet. Start now to get discovered by investors.</p>
          <Link href="/startup/create-xfund">
            <button className={styles.btnPrimaryLarge}>Launch your first XFund</button>
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.subtext}>
            <span className={styles.subtextTag}>{campaign.title}</span>
            <span className={styles.subtextTag}>{campaign.sector}</span>
            <span className={styles.subtextTag}>{campaign.stage}</span>
            <span className={styles.subtextTagGold}>{campaign.fundingType} Model</span>
          </div>

          <div className={styles.campaignCard}>
            <div className={styles.campaignLeft}>
              <div className={styles.fundingLabel}>Funding Progress</div>
              <div>
                <span className={styles.fundingAmount}>₹{campaign.amountRaised.toLocaleString()}</span>
                <span className={styles.fundingGoal}> raised of ₹{campaign.fundingGoal.toLocaleString()} goal</span>
              </div>
              
              <div className={styles.progressBarContainerLarge}>
                <div 
                  className={styles.progressBarFillLarge} 
                  style={{ width: `${Math.min((campaign.amountRaised / campaign.fundingGoal) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className={styles.statsRow}>
                <div className={`${styles.statItem} ${styles.statBlue}`}>
                  {((campaign.amountRaised / campaign.fundingGoal) * 100).toFixed(1)}% Funded
                </div>
                <div className={styles.statDivider}></div>
                <div className={`${styles.statItem} ${styles.statGray}`}>Active</div>
                <div className={styles.statDivider}></div>
                <div className={`${styles.statItem} ${styles.statAmber}`}>
                  {campaign.status === 'Funded' ? 'Goal Reached! 🎉' : 'In Progress'}
                </div>
              </div>
            </div>
            
            <div className={styles.campaignRight}>
              <div className={styles.countdownCircle}>
                <div className={styles.countdownValue}>{campaign.status === 'Funded' ? '✓' : '!!'}</div>
                <div className={styles.countdownLabel}>{campaign.status}</div>
              </div>
            </div>
          </div>

          <div className={styles.gridTwoCol}>
            <div className={`${styles.card} ${styles.colLeft}`}>
              <h2 className={styles.cardTitle}>Funding Terms</h2>
              <div className={styles.termsBox}>
                <div className={styles.termRow}>
                  <span>Funding Model</span>
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
                  <span>Min Investment</span>
                  <span className={styles.termVal}>₹{campaign.minimumInvestment}</span>
                </div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.colRight}`}>
              <h2 className={styles.cardTitle}>Disbursement Status</h2>
              <div className={styles.disburseContent}>
                {campaign.status === 'Funded' ? (
                  <div className={styles.successMsg}>
                    <h3>Goal Achieved!</h3>
                    <p>Total amount of ₹{campaign.amountRaised.toLocaleString()} is now being processed for disbursement.</p>
                    <button className={styles.btnGoldFull}>Initiate Disbursement</button>
                  </div>
                ) : (
                  <div className={styles.pendingMsg}>
                    <p>Funds will be held in escrow until the goal of ₹{campaign.fundingGoal.toLocaleString()} is met.</p>
                    <div className={styles.remainingAmount}>
                      ₹{(campaign.fundingGoal - campaign.amountRaised).toLocaleString()} remaining
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

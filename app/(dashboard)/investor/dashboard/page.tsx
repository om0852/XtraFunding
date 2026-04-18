"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <main className={styles.content}>
      <h1 className={styles.greeting}>Welcome back 👋</h1>
      <p className={styles.subtext}>Explore the latest XFunds and build your portfolio.</p>

      {/* METRICS ROW (Static for now as per design) */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Invested</div>
          <div className={styles.metricValue}>₹1,25,000</div>
          <div className={styles.metricSubtextGreen}>+₹8,400 returns</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Active XFunds</div>
          <div className={styles.metricValueGold}>{campaigns.length}</div>
          <div className={styles.metricSubtext}>live opportunities</div>
        </div>
      </div>

      {/* LIVE CAMPAIGNS */}
      <div className={styles.sectionWrapper} style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Live XFunds</h2>
          <span className={styles.statusBadgeLive}>• Live Now</span>
        </div>
        
        {loading ? (
          <div>Loading opportunities...</div>
        ) : (
          <div className={styles.startupGrid}>
            {campaigns.length === 0 ? (
              <div className={styles.emptyMsg}>No active XFunds at the moment. Check back soon!</div>
            ) : (
              campaigns.map((camp: any) => (
                <div key={camp._id} className={styles.startupCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.startupName}>{camp.title}</div>
                    <div className={styles.typeBadgeSmall}>{camp.fundingType}</div>
                  </div>
                  <div className={styles.sectorTag}>{camp.sector} · {camp.location}</div>
                  
                  <div className={styles.fundingBarContainer}>
                    <div 
                      className={styles.fundingBarFill} 
                      style={{ width: `${Math.min((camp.amountRaised / camp.fundingGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className={styles.fundingText}>
                    ₹{camp.amountRaised.toLocaleString()} raised of ₹{camp.fundingGoal.toLocaleString()}
                  </div>
                  
                  <div className={styles.cardBottom}>
                    <span className={styles.minText}>Min ₹{camp.minimumInvestment.toLocaleString()}</span>
                    <Link href={`/campaign/${camp._id}`}>
                      <button className={styles.btnInvest}>View XFund</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

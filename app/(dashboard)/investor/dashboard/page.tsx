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
      <header style={{ marginBottom: '48px' }}>
        <h1 className={styles.greeting}>Welcome back 👋</h1>
        <p className={styles.subtext}>Explore the latest XFunds and build your strategic portfolio.</p>
      </header>

      {/* METRICS ROW */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Invested</div>
          <div className={styles.metricValue}>₹1,25,000</div>
          <div className={styles.metricSubtextGreen}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            +₹8,400 returns
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Live Opportunities</div>
          <div className={styles.metricValueGold}>{campaigns.length}</div>
          <div className={styles.metricSubtext}>Across all models</div>
        </div>
      </div>

      {/* XFUND OPPORTUNITIES */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Standard XFunds</h2>
            <p className={styles.metricSubtext}>Steady-rate, milestone-protected crowdfunding</p>
          </div>
          <span className={styles.statusBadgeLive}>• Live Now</span>
        </div>
        
        {loading ? (
          <div className={styles.emptyMsg}>Syncing blockchain data...</div>
        ) : (
          <div className={styles.startupGrid}>
            {campaigns.filter(c => c.fundingModel === 'XFund').length === 0 ? (
              <div className={styles.emptyMsg}>No active standard XFunds currently available.</div>
            ) : (
              campaigns.filter(c => c.fundingModel === 'XFund').map((camp: any) => (
                <div key={camp._id} className={styles.startupCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.startupName}>{camp.title}</div>
                    <div className={styles.typeBadgeSmall} style={{ backgroundColor: '#F0F9FF', color: '#0369A1' }}>XFund</div>
                  </div>
                  <div className={styles.sectorTag}>{camp.sector} · {camp.location}</div>
                  
                  <div className={styles.cardBodyText}>{camp.tagline}</div>
                  
                  <div className={styles.fundingBarContainer}>
                    <div className={styles.fundingBarFill} style={{ width: `${Math.min((camp.amountRaised / camp.fundingGoal) * 100, 100)}%` }}></div>
                  </div>
                  <div className={styles.fundingText}>
                    ₹{camp.amountRaised.toLocaleString()} / ₹{camp.fundingGoal.toLocaleString()}
                  </div>
                  
                  <div className={styles.cardBottom}>
                    <span className={styles.minText}>Min ₹{camp.minimumInvestment.toLocaleString()}</span>
                    <Link href={`/investor/xfund/${camp._id}`}>
                      <button className={styles.btnInvest}>Invest Now</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* XRAISE OPPORTUNITIES */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Strategic XRaise Deals</h2>
            <p className={styles.metricSubtext}>Direct-to-founder negotiations for high-growth ventures</p>
          </div>
          <span className={styles.statusBadgeNeg}>• Open for Bids</span>
        </div>
        
        {loading ? (
          <div className={styles.emptyMsg}>Fetching deal rooms...</div>
        ) : (
          <div className={styles.startupGrid}>
            {campaigns.filter(c => c.fundingModel === 'XRaise').length === 0 ? (
              <div className={styles.emptyMsg}>No strategic negotiation deals currently available.</div>
            ) : (
              campaigns.filter(c => c.fundingModel === 'XRaise').map((camp: any) => (
                <div key={camp._id} className={styles.startupCard} style={{ borderColor: '#F5A623', background: 'linear-gradient(to bottom right, #ffffff, #FFFDF9)' }}>
                  <div className={styles.cardTop}>
                    <div className={styles.startupName}>{camp.title}</div>
                    <div className={styles.typeBadgeSmall} style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>XRaise</div>
                  </div>
                  <div className={styles.sectorTag}>{camp.sector} · {camp.location}</div>
                  
                  <div className={styles.cardBodyText}>
                    {camp.tagline || 'Negotiate custom terms directly with the founder in a private room.'}
                  </div>
                  
                  <div className={styles.cardBottom}>
                    <span className={styles.minText}>Target ₹{camp.fundingGoal.toLocaleString()}</span>
                    <Link href={`/investor/xraise/explore/${camp._id}`}>
                      <button className={`${styles.btnInvest} ${styles.btnInvestGold}`}>
                        Explore Deal
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}

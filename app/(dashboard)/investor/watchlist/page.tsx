"use client"

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useComparison } from '@/context/ComparisonContext';

// Mock data for watchlist startups
const WATCHLIST_STARTUPS = [
  {
    id: '1',
    name: 'SolarFlare Energy',
    logo: 'SF',
    sector: 'CleanTech',
    location: 'Karnataka',
    xrate: 85,
    tagline: 'Next-gen affordable solar storage tiles for residential rooftops.',
    raised: '₹45,00,000',
    goal: '₹60,00,000',
    progress: 75,
    minInv: '₹10,000',
    expiry: '4 days left'
  },
  {
    id: '2',
    name: 'AutoSafe AI',
    logo: 'AS',
    sector: 'Mobility',
    location: 'Tamil Nadu',
    xrate: 78,
    tagline: 'AI-driven collision avoidance systems for public transport.',
    raised: '₹12,00,000',
    goal: '₹30,00,000',
    progress: 40,
    minInv: '₹5,000',
    expiry: '12 days left'
  },
  {
    id: '3',
    name: 'AquaPure',
    logo: 'AP',
    sector: 'AgriTech',
    location: 'Gujarat',
    xrate: 81,
    tagline: 'Graphene-based water purification for small-scale farmlands.',
    raised: '₹55,00,000',
    goal: '₹50,00,000',
    progress: 110,
    minInv: '₹8,000',
    expiry: 'Closing Soon'
  }
];

export default function WatchlistPage() {
  const { selectedDeals, addDeal, removeDeal } = useComparison();
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbHeader}>
        <span className={styles.breadcrumb}>Investments &gt; Watchlist</span>
      </div>

      {/* Summary Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tracked Startups</div>
          <div className={styles.statValue}>3</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg. XRate Score</div>
          <div className={styles.statValueGold}>81.3</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Upcoming Deadline</div>
          <div className={styles.statValue}>SolarFlare (4d)</div>
        </div>
      </div>

      {/* Grid of tracked startups */}
      <div className={styles.grid}>
        {WATCHLIST_STARTUPS.map((startup) => (
          <div key={startup.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTop}>
                <div className={styles.logo}>{startup.logo}</div>
                <div className={styles.info}>
                  <div className={styles.name}>{startup.name}</div>
                  <div className={styles.sector}>{startup.sector} • {startup.location}</div>
                </div>
              </div>
              <div className={styles.xrateBox}>
                <div className={styles.xrateLabel}>XRate</div>
                <div className={styles.xrateValue}>{startup.xrate}</div>
              </div>
            </div>

            <div className={styles.cardBody}>
              <p className={startup.tagline}>{startup.tagline}</p>
              
              <div className={styles.progressSection}>
                <div className={styles.progressLabel}>
                  <span className={styles.raised}>{startup.raised}</span>
                  <span className={styles.goal}>of {startup.goal}</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${Math.min(startup.progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Min. Investment</span>
                  <span className={styles.metaValue}>{startup.minInv}</span>
                </div>
                <div className={styles.metaItem} style={{ alignItems: 'flex-end' }}>
                  <span className={styles.metaLabel}>Funding Status</span>
                  <span className={styles.metaValue}>{startup.expiry}</span>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <button 
                className={styles.btnSelect}
                onClick={() => {
                  const isSelected = selectedDeals.find(s => s.id === startup.id);
                  if (isSelected) removeDeal(startup.id);
                  else addDeal({ id: startup.id, name: startup.name });
                }}
              >
                {selectedDeals.find(s => s.id === startup.id) ? 'Selected' : 'Select'}
              </button>
              <Link href="/campaign" className={styles.btnView}>
                View
              </Link>
              <button className={styles.btnRemove} title="Remove from Watchlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function CampaignPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [amount, setAmount] = useState('');
  
  // Calculate equity logic. Valuation = 15L / 8% = 1.875 Cr (approx)
  // Let's just do: user takes proportion of 15L giving 8%
  // 15L = 1500000. 8% for 15L => 1% for 1.875L. 
  // eq = (amount / 1500000) * 8
  const numAmount = parseInt(amount.replace(/,/g, '')) || 0;
  const eq = numAmount > 0 ? ((numAmount / 1500000) * 8).toFixed(3) : "0.00";
  const isError = numAmount > 0 && numAmount < 5000;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(val);
  };

  const handlePillClick = (val: string) => {
    setAmount(val);
  };

  return (
    <div className={styles.pageContainer}>

      <main className={styles.mainContent}>
        {/* CAMPAIGN HEADER */}
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.logoCircle}>GH</div>
            <div className={styles.headerInfoWrapper}>
              <h1 className={styles.companyName}>GreenHarvest AI</h1>
              <p className={styles.tagline}>AI-powered crop advisory for smallholder farmers across India</p>
              <div className={styles.badgesRow}>
                <span className={styles.badgePill}>AgriTech</span>
                <span className={styles.badgePill}>Seed Stage</span>
                <span className={styles.badgePill}>Maharashtra</span>
                <span className={styles.badgePillGold}>XRate: 74</span>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.miniStat}>23 Investors</div>
            <div className={styles.miniStat}>12 Days Left</div>
            <div className={styles.miniStat}>₹5,000 Min Investment</div>
          </div>
        </div>

        {/* TWO COLUMNS */}
        <div className={styles.gridTwoCol}>
          
          {/* LEFT COLUMN */}
          <div className={styles.colLeft}>
            
            {/* ABOUT & TABS */}
            <div className={styles.card}>
              <div className={styles.tabsContainer}>
                {['Overview', 'Team', 'Documents', 'Updates'].map((tab) => (
                  <button 
                    key={tab} 
                    className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'Overview' && (
                <div className={styles.overviewSection}>
                  <h3>What we're building</h3>
                  <p>GreenHarvest AI is building the first data-driven smart farming application built specifically for smallholder and mid-scale farmers in central India. By integrating real-time regional weather data, satellite crop monitoring, and sophisticated machine learning heuristics, we provide granular crop advisory directly via SMS and WhatsApp.</p>
                  <h3>The Problem</h3>
                  <p>Over 80% of farming yield in tier 3 networks suffers from poor timing relating to pesticide application, crop rotation, and water cycling. Traditional advisory services are generalized across vast regions, failing to account for hyper-local soil variations.</p>
                  <h3>Our Solution</h3>
                  <p>We deploy autonomous sensors at cooperative hubs that feed localized data into our ML model. Farmers receive customized, automated SMS alerts instructing optimal times for their specific seeded plots, resulting in an average 22% increase in seasonal crop yields.</p>
                </div>
              )}

              {activeTab === 'Team' && (
                <div className={styles.teamGrid}>
                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar}>AK</div>
                    <div className={styles.teamName}>Amit Kumar</div>
                    <div className={styles.teamRole}>Founder & CEO</div>
                  </div>
                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar}>SR</div>
                    <div className={styles.teamName}>Sneha Rao</div>
                    <div className={styles.teamRole}>Chief Technology Officer</div>
                  </div>
                  <div className={styles.teamMember}>
                    <div className={styles.teamAvatar}>PJ</div>
                    <div className={styles.teamName}>Priya Jain</div>
                    <div className={styles.teamRole}>Head of Agronomy</div>
                  </div>
                </div>
              )}

              {activeTab === 'Documents' && (
                <div className={styles.docList}>
                  <div className={styles.docItem}>
                    <div className={styles.docItemLeft}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      <span className={styles.docName}>Pitch Deck.pdf</span>
                      <span className={styles.docSize}>2.4 MB</span>
                    </div>
                    <a href="#" className={styles.docLink}>View</a>
                  </div>
                  <div className={styles.docItem}>
                    <div className={styles.docItemLeft}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      <span className={styles.docName}>Financial Projections.xlsx</span>
                      <span className={styles.docSize}>1.1 MB</span>
                    </div>
                    <a href="#" className={styles.docLink}>View</a>
                  </div>
                  <div className={styles.docItem}>
                    <div className={styles.docItemLeft}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      <span className={styles.docName}>MCA Certificate.pdf</span>
                      <span className={styles.docSize}>450 KB</span>
                    </div>
                    <a href="#" className={styles.docLink}>View</a>
                  </div>
                </div>
              )}

              {activeTab === 'Updates' && (
                <div className={styles.overviewSection}>
                  <p>Navigate to Founder Updates section below.</p>
                </div>
              )}
            </div>

            {/* MILESTONE ROADMAP */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Funding Milestones</h2>
              <div className={styles.timelineWrapper}>
                <div className={styles.timelineTrack}></div>
                
                <div className={styles.milestoneCard}>
                  <div className={styles.milestoneIconGreen}>✓</div>
                  <div className={styles.milestoneTitle}>MVP Complete</div>
                  <div className={styles.milestoneFund}>₹3L released</div>
                  <div className={styles.milestoneDate}>Jan 2025</div>
                </div>
                
                <div className={styles.milestoneCard}>
                  <div className={styles.milestoneIconBlue}></div>
                  <div className={styles.milestoneTitle}>Beta Launch</div>
                  <div className={styles.milestoneFund}>₹4L on release</div>
                  <div className={styles.milestoneDate}>Mar 2025</div>
                </div>
                
                <div className={styles.milestoneCard}>
                  <div className={styles.milestoneIconGray}></div>
                  <div className={styles.milestoneTitle}>Revenue ₹5L</div>
                  <div className={styles.milestoneFund}>₹5L on release</div>
                  <div className={styles.milestoneDate}>May 2025</div>
                </div>

                <div className={styles.milestoneCard}>
                  <div className={styles.milestoneIconGray}></div>
                  <div className={styles.milestoneTitle}>Series A Ready</div>
                  <div className={styles.milestoneFund}>₹3L on release</div>
                  <div className={styles.milestoneDate}>Jul 2025</div>
                </div>
              </div>
            </div>

            {/* FOUNDER UPDATES */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Founder Updates</h2>
              
              <div className={styles.updateCard}>
                <div className={styles.updateHeader}>
                  <div className={styles.updateAvatar}>AK</div>
                  <div className={styles.updateMeta}>
                    <span className={styles.updateName}>Amit Kumar</span>
                    <span className={styles.updateDate}>10 April 2025</span>
                  </div>
                </div>
                <p className={styles.updateText}>
                  Great news! We just signed our third LOI with the Vidarbha farming cooperative covering over 1,400 hectares. The integration of our API nodes begins next week. Thanks to all early backers!
                </p>
              </div>

              <div className={styles.updateCard}>
                <div className={styles.updateHeader}>
                  <div className={styles.updateAvatar}>AK</div>
                  <div className={styles.updateMeta}>
                    <span className={styles.updateName}>Amit Kumar</span>
                    <span className={styles.updateDate}>22 March 2025</span>
                  </div>
                </div>
                <p className={styles.updateText}>
                  Our Beta MVP has officially shipped to the Android store. We have 500 waitlisted farmers actively receiving SMS advisories. We'll be submitting validation proof to complete Milestone 2 shortly.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.colRight}>
            <div className={styles.stickySidebar}>
              
              {/* INVEST CARD */}
              <div className={styles.investCard}>
                <div className={styles.investRaised}>₹8,20,000 raised</div>
                <div className={styles.investGoal}>of ₹15,00,000 goal</div>
                
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBarFill} style={{ width: '54%' }}></div>
                </div>
                
                <div className={styles.investStats}>
                  <span className={styles.textBlue}>54% Funded</span>
                  <span className={styles.textGray}>23 Investors</span>
                  <span className={styles.textAmber}>12 Days Left</span>
                </div>
                
                <div className={styles.divider}></div>
                
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Investment Type</span>
                  <span className={styles.infoValue}>Equity · 8% for ₹15L</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Minimum Investment</span>
                  <span className={styles.infoValue}>₹5,000</span>
                </div>
                
                <div className={styles.divider}></div>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Enter Investment Amount</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>₹</span>
                    <input 
                      type="text" 
                      className={`${styles.amountInput} ${isError ? styles.amountInputError : ''}`}
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0"
                    />
                  </div>
                  {isError && <div className={styles.errorText}>Minimum investment is ₹5,000</div>}
                  
                  <div className={styles.quickPills}>
                    <button className={styles.quickPill} onClick={() => handlePillClick('5000')}>₹5K</button>
                    <button className={styles.quickPill} onClick={() => handlePillClick('10000')}>₹10K</button>
                    <button className={styles.quickPill} onClick={() => handlePillClick('25000')}>₹25K</button>
                    <button className={styles.quickPill} onClick={() => handlePillClick('50000')}>₹50K</button>
                  </div>
                  
                  <div className={styles.equityPreview}>
                    You will receive: {eq}% equity
                  </div>
                  
                  <div className={styles.btnInvestWrapper}>
                    <button className={styles.btnInvest} disabled={isError || numAmount === 0}>
                      Invest Now
                    </button>
                  </div>
                  
                  <div className={styles.escrowText}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Funds held in escrow until milestone approval
                  </div>
                  
                  <a href="#" className={styles.linkWatchlist}>Add to Watchlist</a>
                </div>
              </div>

              {/* XRATE BANNER */}
              <div className={styles.xrateBanner}>
                <span className={styles.xrateBannerBadge}>AI Verified</span>
                <div className={styles.xrateTitle}>XRate Score: 74/100</div>
                <div className={styles.xrateMiniBar}>
                  <div className={styles.xrateBarFill}></div>
                  <span className={styles.xrateLabel}>Good</span>
                </div>
                <Link href="/xrate-report" className={styles.linkReport}>
                  View Full Analysis Report →
                </Link>
              </div>

            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

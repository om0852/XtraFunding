"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function XRateReportPage() {
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  const toggleSection = (id: number) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
          </svg>
          XFund
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/campaign" className={styles.navLink}>Explore</Link>
          <Link href="/how-it-works" className={styles.navLink}>How it Works</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
        </div>
        <div className={styles.navButtons}>
          <Link href="/auth">
            <button className={styles.btnLogin}>Login</button>
          </Link>
          <Link href="/auth">
            <button className={styles.btnGetStarted}>Get Started</button>
          </Link>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {/* HEADER CARD */}
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.startupLogo}>GH</div>
            <div className={styles.startupInfo}>
              <h1 className={styles.startupName}>GreenHarvest AI</h1>
              <div className={styles.badgesRow}>
                <span className={styles.badgePill}>AgriTech</span>
                <span className={styles.badgePill}>Seed Stage</span>
                <span className={styles.badgePill}>Maharashtra</span>
              </div>
              <div className={styles.reportDate}>Report generated on 12 April 2025</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.gaugeOuter}>
              <div className={styles.gaugeInner}>74</div>
            </div>
            <div className={styles.gaugeLabel}>XRate Score</div>
            <div className={styles.badgeGreenSolid}>Good Investment Potential</div>
          </div>
        </div>

        {/* SCORE BREAKDOWN GRID */}
        <div className={styles.grid}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Risk Assessment</span>
              <span className={styles.scoreValueGreen}>72/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillGreen} style={{ width: '72%' }}></div>
            </div>
            <span className={styles.cardTagGreen}>Low Risk</span>
            <p className={styles.cardDesc}>
              The startup demonstrates manageable financial risk with diversified revenue streams.
            </p>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Growth Potential</span>
              <span className={styles.scoreValueBlue}>81/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillBlue} style={{ width: '81%' }}></div>
            </div>
            <span className={styles.cardTagBlue}>High Growth</span>
            <p className={styles.cardDesc}>
              Strong product-market fit indicators with 3x YoY user growth trajectory.
            </p>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Team Strength</span>
              <span className={styles.scoreValueGold}>68/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillGold} style={{ width: '68%' }}></div>
            </div>
            <span className={styles.cardTagAmber}>Experienced</span>
            <p className={styles.cardDesc}>
              Founding team has relevant domain expertise with 2 prior startup exits.
            </p>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Market Size</span>
              <span className={styles.scoreValueBlue}>79/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillBlue} style={{ width: '79%' }}></div>
            </div>
            <span className={styles.cardTagBlue}>Large TAM</span>
            <p className={styles.cardDesc}>
              Addressable market of ₹12,000 Cr with low existing competition in tier 2 cities.
            </p>
          </div>
        </div>

        {/* FULL ANALYSIS SECTIONS */}
        <div className={styles.analysisSection}>
          <h2 className={styles.analysisTitle}>Detailed Analysis Report</h2>
          
          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(1)}>
              Executive Summary
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[1] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[1] && (
              <div className={styles.accordionContent}>
                <p>GreenHarvest AI operates at the intersection of agritech and machine learning, providing predictive yield modeling for mid-to-large scale farmers in central India. The core value proposition relies heavily on proprietary data models trained on localized weather and soil health indices.</p>
                <p>The company has successfully launched its beta application and secured initial pilot programs with 3 major agriculture cooperatives, signaling early product-market fit. Their unit economics show a promising path to profitability if acquisition costs can be stabilized through these B2B2C partnerships.</p>
                <p>Key areas of focus for the next 12 months should be scaling the engineering team to handle increased data loads and expanding their sales pipeline into neighboring states to capture early market share before established competitors pivot to their niche.</p>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(2)}>
              Risk Factors
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[2] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[2] && (
              <div className={styles.accordionContent}>
                <ul className={styles.bulletList}>
                  <li><div className={styles.dotRed}></div>High dependency on regional weather data APIs which may face pricing changes.</li>
                  <li><div className={styles.dotAmber}></div>Sales cycle for B2B cooperatives is historically longer (6-9 months).</li>
                  <li><div className={styles.dotAmber}></div>Current runway is only 8 months at current burn rate without new capital.</li>
                  <li><div className={styles.dotRed}></div>Lack of a dedicated Chief Data Officer to oversee QA of predictive models.</li>
                </ul>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(3)}>
              Growth Indicators
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[3] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[3] && (
              <div className={styles.accordionContent}>
                <ul className={styles.bulletList}>
                  <li><div className={styles.dotGreen}></div>Secured LOIs (Letters of Intent) from 12 large farming unions.</li>
                  <li><div className={styles.dotGreen}></div>Customer acquisition cost (CAC) dropped by 40% in the last quarter.</li>
                  <li><div className={styles.dotGreen}></div>High engagement metrics: 85% of active users log in daily during planting season.</li>
                  <li><div className={styles.dotGreen}></div>Proprietary ML model accuracy improved by 18% with latest data ingestion.</li>
                  <li><div className={styles.dotGreen}></div>Recent government grants for agritech align perfectly with their offerings.</li>
                </ul>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(4)}>
              Investment Recommendations
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[4] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[4] && (
              <div className={styles.accordionContent}>
                <p>Based on the current valuation cap of ₹15 Cr and the demonstrated traction, this opportunity is rated as <strong>Good Investment Potential</strong> for investors with a moderate-to-high risk tolerance and a 5-7 year liquidity horizon.</p>
                <p>We recommend a standard equity B-share investment strategy, targeting ₹1L to ₹5L allocation for retail angels. For larger consortiums via XRaise, consider negotiating a board observer seat due to the slightly compressed runway.</p>
              </div>
            )}
          </div>
        </div>

        {/* DOCUMENT VERIFICATION STRIP */}
        <div className={styles.docStrip}>
          <h2 className={styles.docTitle}>Verified Documents</h2>
          <div className={styles.docRow}>
            {['GST Certificate', 'MCA Registration', 'PAN Verified', 'Pitch Deck', 'Financials'].map((doc) => (
              <div key={doc} className={styles.docBadge}>
                {doc}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* BOTTOM ACTION BAR */}
      <div className={styles.bottomBar}>
        <div className={styles.barLeft}>
          <button className={styles.btnOutlinedBlack}>Share Report</button>
          <button className={styles.btnOutlinedBlack}>Compare Startups</button>
        </div>
        <button className={styles.btnDownload}>Download PDF Report</button>
      </div>
    </div>
  );
}

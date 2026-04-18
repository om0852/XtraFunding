import React from 'react';
import styles from './page.module.css';

export default function StartupDashboard() {
  return (
    <main className={styles.content}>
      <h1 className={styles.heading}>Campaign Overview</h1>
      <div className={styles.subtext}>
        <span className={styles.subtextTag}>GreenHarvest AI</span>
        <span className={styles.subtextTag}>AgriTech</span>
        <span className={styles.subtextTag}>Seed Stage</span>
      </div>

      {/* CAMPAIGN HEALTH CARD */}
      <div className={styles.campaignCard}>
        <div className={styles.campaignLeft}>
          <div className={styles.fundingLabel}>Funding Progress</div>
          <div>
            <span className={styles.fundingAmount}>₹8,20,000</span>
            <span className={styles.fundingGoal}> raised of ₹15,00,000 goal</span>
          </div>
          
          <div className={styles.progressBarContainerLarge}>
            <div className={styles.progressBarFillLarge} style={{ width: '54%' }}></div>
          </div>
          
          <div className={styles.statsRow}>
            <div className={`${styles.statItem} ${styles.statBlue}`}>54% Funded</div>
            <div className={styles.statDivider}></div>
            <div className={`${styles.statItem} ${styles.statGray}`}>23 Investors</div>
            <div className={styles.statDivider}></div>
            <div className={`${styles.statItem} ${styles.statAmber}`}>12 Days Left</div>
          </div>
        </div>
        
        <div className={styles.campaignRight}>
          <div className={styles.countdownCircle}>
            <div className={styles.countdownValue}>12</div>
            <div className={styles.countdownLabel}>Days</div>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className={styles.gridTwoCol}>
        {/* MILESTONE TRACKER */}
        <div className={`${styles.card} ${styles.colLeft}`}>
          <h2 className={styles.cardTitle}>Milestone Progress</h2>
          <div className={styles.stepper}>
            
            {/* Step 1 */}
            <div className={styles.step}>
              <div className={styles.stepIndicator}>
                <div className={styles.circleGreen}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepTitle}>MVP Development Complete</div>
                  <span className={styles.badgeGreen}>Done</span>
                </div>
                <div className={styles.stepDate}>Completed 15 Jan 2025</div>
                <div className={styles.linkBlue}>View Proof</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles.step}>
              <div className={styles.stepIndicator}>
                <div className={styles.circleGold}>
                  <div className={styles.dotGold}></div>
                </div>
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepTitle}>Beta Launch & 500 Users</div>
                  <span className={styles.badgeAmber}>In Progress</span>
                </div>
                <div className={styles.stepDate}>Due 28 Feb 2025</div>
                <button className={styles.btnGoldSmall}>Upload Proof</button>
              </div>
            </div>

            {/* Step 3 */}
            <div className={styles.step}>
              <div className={styles.stepIndicator}>
                <div className={styles.circleGray}></div>
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepTitle}>Revenue Generation ₹5L</div>
                  <span className={styles.badgeGray}>Upcoming</span>
                </div>
                <div className={styles.stepDate}>Due 30 Apr 2025</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={styles.step}>
              <div className={styles.stepIndicator}>
                <div className={styles.circleGray}></div>
                <div className={styles.stepLine}></div>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepTitle}>Series A Readiness</div>
                  <span className={styles.badgeGray}>Upcoming</span>
                </div>
                <div className={styles.stepDate}>Due 30 Jun 2025</div>
              </div>
            </div>

          </div>
        </div>

        {/* XRATE SCORE CARD */}
        <div className={`${styles.card} ${styles.colRight}`}>
          <h2 className={styles.cardTitle}>Your XRate Score</h2>
          
          <div className={styles.gaugeContainer}>
            <div className={styles.gaugeCircle}>
              <div className={styles.gaugeInner}>
                <div className={styles.scoreValue}>74</div>
                <div className={styles.scoreLabel}>out of 100</div>
              </div>
            </div>
            <div className={styles.ratingBadge}>Good</div>
          </div>
          
          <div className={styles.metricRows}>
            <div className={styles.metricRow}>
              <div className={styles.metricHeader}>
                <span className={styles.metricName}>Risk Score</span>
                <span className={styles.metricStatus}>Low Risk</span>
              </div>
              <div className={styles.metricBarContainer}>
                <div style={{ width: '72%', height: '100%', background: '#10B981' }}></div>
              </div>
            </div>
            
            <div className={styles.metricRow}>
              <div className={styles.metricHeader}>
                <span className={styles.metricName}>Growth Potential</span>
                <span className={styles.metricStatus}>High</span>
              </div>
              <div className={styles.metricBarContainer}>
                <div style={{ width: '81%', height: '100%', background: '#3B82F6' }}></div>
              </div>
            </div>
            
            <div className={styles.metricRow}>
              <div className={styles.metricHeader}>
                <span className={styles.metricName}>Team Strength</span>
                <span className={styles.metricStatus}>Good</span>
              </div>
              <div className={styles.metricBarContainer}>
                <div style={{ width: '68%', height: '100%', background: '#3B82F6' }}></div>
              </div>
            </div>

            <div className={styles.metricRow}>
              <div className={styles.metricHeader}>
                <span className={styles.metricName}>Market Size</span>
                <span className={styles.metricStatus}>Large</span>
              </div>
              <div className={styles.metricBarContainer}>
                <div style={{ width: '79%', height: '100%', background: '#F5A623' }}></div>
              </div>
            </div>
          </div>
          
          <button className={styles.btnOutlined}>View Full Report</button>
        </div>
      </div>

      {/* RECENT OFFERS CARD */}
      <div className={styles.tableWrapper}>
        <h2 className={styles.tableTitle}>Recent XRaise Offers</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Investor Name</th>
              <th className={styles.th}>Offer Amount</th>
              <th className={styles.th}>Equity Offered</th>
              <th className={styles.th}>Terms</th>
              <th className={styles.th}>Received</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tr}>
              <td className={`${styles.td} ${styles.investorName}`}>Rahul Sharma</td>
              <td className={styles.td}>₹2,00,000</td>
              <td className={styles.td}>12% equity</td>
              <td className={styles.td}>Standard terms</td>
              <td className={styles.td}>2 days ago</td>
              <td className={styles.td}><span className={styles.badgeAmber}>Pending</span></td>
              <td className={styles.td}><button className={styles.btnReview}>Review</button></td>
            </tr>
            <tr className={styles.tr}>
              <td className={`${styles.td} ${styles.investorName}`}>Priya Ventures</td>
              <td className={styles.td}>₹5,00,000</td>
              <td className={styles.td}>18% equity</td>
              <td className={styles.td}>Board seat included</td>
              <td className={styles.td}>5 days ago</td>
              <td className={styles.td}><span className={styles.badgeGray}>Countered</span></td>
              <td className={styles.td}><button className={styles.btnThread}>View Thread</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <main className={styles.content}>
      <h1 className={styles.greeting}>Good morning, Arjun 👋</h1>
      <p className={styles.subtext}>Here's your investment overview for today.</p>

      {/* METRICS ROW */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Invested</div>
          <div className={styles.metricValue}>₹1,25,000</div>
          <div className={styles.metricSubtextGreen}>+₹8,400 returns</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Active Campaigns</div>
          <div className={styles.metricValueGold}>4</div>
          <div className={styles.metricSubtext}>across 3 sectors</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Pending Milestones</div>
          <div className={styles.metricValue}>2</div>
          <div className={styles.metricSubtext}>awaiting startup update</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>XRaise Offers</div>
          <div className={styles.metricValueAmber}>3</div>
          <div className={styles.metricSubtext}>2 awaiting your response</div>
        </div>
      </div>

      {/* PORTFOLIO TABLE */}
      <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My Portfolio</h2>
          <Link href="/investor/investments" className={styles.linkGold}>View All</Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Startup Name</th>
              <th className={styles.th}>Sector</th>
              <th className={styles.th}>Amount Invested</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Milestone Progress</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tr}>
              <td className={`${styles.td} ${styles.companyName}`}>GreenHarvest AI</td>
              <td className={styles.td}>AgriTech</td>
              <td className={styles.td}>₹25,000</td>
              <td className={styles.td}>Equity 8%</td>
              <td className={styles.td}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBarFill} style={{ width: '60%' }}></div>
                </div>
              </td>
              <td className={styles.td}><span className={styles.badgeGreen}>Active</span></td>
              <td className={styles.td}><button className={styles.btnAction}>View</button></td>
            </tr>
            <tr className={styles.tr}>
              <td className={`${styles.td} ${styles.companyName}`}>MediTrack</td>
              <td className={styles.td}>HealthTech</td>
              <td className={styles.td}>₹50,000</td>
              <td className={styles.td}>Royalty 5%</td>
              <td className={styles.td}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBarFill} style={{ width: '30%' }}></div>
                </div>
              </td>
              <td className={styles.td}><span className={styles.badgeAmber}>Milestone Pending</span></td>
              <td className={styles.td}><button className={styles.btnAction}>View</button></td>
            </tr>
            <tr className={styles.tr}>
              <td className={`${styles.td} ${styles.companyName}`}>EduBridge</td>
              <td className={styles.td}>EdTech</td>
              <td className={styles.td}>₹15,000</td>
              <td className={styles.td}>Equity 5%</td>
              <td className={styles.td}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBarFill} style={{ width: '90%' }}></div>
                </div>
              </td>
              <td className={styles.td}><span className={styles.badgeGreen}>Active</span></td>
              <td className={styles.td}><button className={styles.btnAction}>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TRENDING STARTUPS */}
      <div className={styles.sectionWrapper} style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending on XFund</h2>
          <Link href="/explore" className={styles.linkGold}>Browse All</Link>
        </div>
        <div className={styles.startupGrid}>
          {/* Card 1 */}
          <div className={styles.startupCard}>
            <div className={styles.cardTop}>
              <div className={styles.startupName}>FinSphere</div>
              <div className={styles.xratePill}>XRate: 82</div>
            </div>
            <div className={styles.sectorTag}>FinTech</div>
            <div className={styles.fundingBarContainer}>
              <div className={styles.fundingBarFill} style={{ width: '54%' }}></div>
            </div>
            <div className={styles.fundingText}>₹8.2L raised of ₹15L</div>
            <div className={styles.cardBottom}>
              <span className={styles.minText}>Min ₹5,000</span>
              <button className={styles.btnInvest}>Invest Now</button>
            </div>
          </div>
          {/* Card 2 */}
          <div className={styles.startupCard}>
            <div className={styles.cardTop}>
              <div className={styles.startupName}>LogiChain</div>
              <div className={styles.xratePill}>XRate: 88</div>
            </div>
            <div className={styles.sectorTag}>Logistics</div>
            <div className={styles.fundingBarContainer}>
              <div className={styles.fundingBarFill} style={{ width: '75%' }}></div>
            </div>
            <div className={styles.fundingText}>₹15L raised of ₹20L</div>
            <div className={styles.cardBottom}>
              <span className={styles.minText}>Min ₹10,000</span>
              <button className={styles.btnInvest}>Invest Now</button>
            </div>
          </div>
          {/* Card 3 */}
          <div className={styles.startupCard}>
            <div className={styles.cardTop}>
              <div className={styles.startupName}>AeroSpace Prep</div>
              <div className={styles.xratePill}>XRate: 79</div>
            </div>
            <div className={styles.sectorTag}>EdTech</div>
            <div className={styles.fundingBarContainer}>
              <div className={styles.fundingBarFill} style={{ width: '20%' }}></div>
            </div>
            <div className={styles.fundingText}>₹2L raised of ₹10L</div>
            <div className={styles.cardBottom}>
              <span className={styles.minText}>Min ₹2,000</span>
              <button className={styles.btnInvest}>Invest Now</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client"

import React from 'react';
import styles from './page.module.css';

// Mock data for analytics
const SECTOR_ALLOCATION = [
  { name: 'FinTech', value: '₹45,000', percentage: 36, color: '#1B3A6B' },
  { name: 'AgriTech', value: '₹35,000', percentage: 28, color: '#F5A623' },
  { name: 'HealthTech', value: '₹25,000', percentage: 20, color: '#10B981' },
  { name: 'EdTech', value: '₹20,000', percentage: 16, color: '#3B82F6' },
];

const MONTHLY_PERFORMANCE = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 65 },
  { month: 'Mar', value: 45 },
  { month: 'Apr', value: 80 },
  { month: 'May', value: 55 },
  { month: 'Jun', value: 90 },
];

const REPORTS = [
  { id: '1', name: 'Q1 2025 Performance Summary', type: 'PDF', date: 'Apr 01, 2025', status: 'Generated' },
  { id: '2', name: 'Annual Tax Certificate FY24', type: 'PDF', date: 'Mar 15, 2025', status: 'Verified' },
  { id: '3', name: 'Portfolio Allocation CSV', type: 'CSV', date: 'Mar 01, 2025', status: 'Ready' },
  { id: '4', name: 'Monthly Investment Receipt - Feb', type: 'PDF', date: 'Feb 28, 2025', status: 'Generated' },
];

export default function ReportsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbHeader}>
        <span className={styles.breadcrumb}>Dashboard &gt; Reports & Analytics</span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Net Portfolio Worth</div>
          <div className={styles.statValue}>₹1,34,800</div>
          <div className={`${styles.statSubtext} ${styles.positive}`}>+12.4% vs last year</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Realized Yield</div>
          <div className={styles.statValue}>₹8,400</div>
          <div className={`${styles.statSubtext} ${styles.positive}`}>+₹1,200 this mo</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Estimated Tax (FY25)</div>
          <div className={styles.statValue}>₹1,650</div>
          <div className={`${styles.statSubtext} ${styles.negative}`}>Due in 3 months</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg. Portfolio XRate</div>
          <div className={styles.statValue}>78.5</div>
          <div className={`${styles.statSubtext} ${styles.positive}`}>Top 15% of Investors</div>
        </div>
      </div>

      <div className={styles.pageGrid}>
        {/* Left: Charts & Table */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Portfolio Performance
              <select style={{ fontSize: '12px', padding: '4px', borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                <option>Past 6 Months</option>
                <option>Past Year</option>
              </select>
            </div>
            <div className={styles.chartContainer}>
              {MONTHLY_PERFORMANCE.map((item) => (
                <div key={item.month} className={styles.barWrapper}>
                  <div 
                    className={`${styles.bar} ${item.month === 'Jun' ? styles.barActive : ''}`} 
                    style={{ height: `${item.value}%` }}
                  ></div>
                  <span className={styles.barLabel}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.tableHeader}>
              <div className={styles.cardTitle} style={{ marginBottom: 0 }}>Generated Reports</div>
              <button className={styles.btnDownload} style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                Generate New Report
              </button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Report Name</th>
                  <th className={styles.th}>Type</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {REPORTS.map((report) => (
                  <tr key={report.id}>
                    <td className={styles.td}>
                      <div className={styles.reportName}>
                        <svg className={styles.fileIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        {report.name}
                      </div>
                    </td>
                    <td className={styles.td}>{report.type}</td>
                    <td className={styles.td}>{report.date}</td>
                    <td className={styles.td}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>{report.status}</span>
                    </td>
                    <td className={styles.td}>
                      <button className={styles.btnDownload}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Allocation */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Sector Allocation</div>
            <div className={styles.allocationRow}>
              {SECTOR_ALLOCATION.map((item) => (
                <div key={item.name} className={styles.allocationItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemValue}>{item.percentage}%</span>
                  </div>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.barFill} 
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong>Insight:</strong> Your AgriTech holdings have grown by 15% this quarter, outperforming the sector average.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

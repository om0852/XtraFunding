"use client"

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

// Mock data for investments
const MOCK_INVESTMENTS = [
  {
    id: '1',
    startup: 'GreenHarvest AI',
    logo: 'GH',
    sector: 'AgriTech',
    amount: '₹25,000',
    equity: '8%',
    instrument: 'Equity',
    date: '12 Mar 2025',
    status: 'Active'
  },
  {
    id: '2',
    startup: 'MediTrack',
    logo: 'MT',
    sector: 'HealthTech',
    amount: '₹50,000',
    equity: '5%',
    instrument: 'Royalty',
    date: '15 Feb 2025',
    status: 'Pending'
  },
  {
    id: '3',
    startup: 'EduBridge',
    logo: 'EB',
    sector: 'EdTech',
    amount: '₹15,000',
    equity: '5%',
    instrument: 'Equity',
    date: '10 Jan 2025',
    status: 'Active'
  },
  {
    id: '4',
    startup: 'FinSphere',
    logo: 'FS',
    sector: 'FinTech',
    amount: '₹35,000',
    equity: '10%',
    instrument: 'SAFE',
    date: '28 Dec 2024',
    status: 'Completed'
  }
];

export default function InvestmentsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredInvestments = MOCK_INVESTMENTS.filter(inv => {
    const matchesFilter = filter === 'All' || inv.status === filter;
    const matchesSearch = inv.startup.toLowerCase().includes(search.toLowerCase()) || 
                          inv.sector.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbHeader}>
        <span className={styles.breadcrumb}>Investments</span>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Portfolio Value</div>
          <div className={styles.statValue}>₹1,25,000</div>
          <div className={styles.statTrendUp}>↑ 12.4% this year</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Cumulative ROI</div>
          <div className={styles.statValueGold}>8.2%</div>
          <div className={styles.statTrendUp}>↑ 2.1% past 3 months</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Agreements</div>
          <div className={styles.statValue}>3</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Pending Pledges</div>
          <div className={styles.statValue}>1</div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search by startup or sector..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          {['All', 'Active', 'Pending', 'Completed'].map(f => (
            <button 
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Startup</th>
              <th className={styles.th}>Sector</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Equity / Share</th>
              <th className={styles.th}>Instrument</th>
              <th className={styles.th}>Inv. Date</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestments.map((inv) => (
              <tr key={inv.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.startupCell}>
                    <div className={styles.startupLogo}>{inv.logo}</div>
                    <span className={styles.startupName}>{inv.startup}</span>
                  </div>
                </td>
                <td className={styles.td}>{inv.sector}</td>
                <td className={styles.td}>{inv.amount}</td>
                <td className={styles.td}><span className={styles.equityBadge}>{inv.equity}</span></td>
                <td className={styles.td}>{inv.instrument}</td>
                <td className={styles.td}>{inv.date}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${
                    inv.status === 'Active' ? styles.badgeActive : 
                    inv.status === 'Pending' ? styles.badgePending : 
                    styles.badgeCompleted
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className={styles.td}>
                  <button className={styles.btnDetails}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

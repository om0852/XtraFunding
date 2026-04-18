"use client"

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInvestments = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user info for debug
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();
        if (userData.success) setCurrentUser(userData.data.user);

        const res = await fetch(`/api/investments/investor/${userId}`);
        const data = await res.json();
        if (data.success) {
          setInvestments(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch investments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  const filteredInvestments = investments.filter(inv => {
    const startupName = inv.campaignId?.title || 'Unknown';
    const sector = inv.campaignId?.sector || '';
    const matchesFilter = filter === 'All' || inv.status === filter;
    const matchesSearch = startupName.toLowerCase().includes(search.toLowerCase()) || 
                          sector.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate Stats
  const totalValue = investments
    .filter(inv => inv.status === 'Completed' || inv.status === 'Escrow')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const activeCount = investments.filter(inv => inv.status === 'Active' || inv.status === 'Completed').length;
  const pendingCount = investments.filter(inv => inv.status === 'Pending').length;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={styles.breadcrumb}>Investments</span>
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '11px', background: '#f8fafc', padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              Tracing: <strong>{currentUser.name}</strong> ({currentUser._id.substring(0,8)}...)
            </div>
            {currentUser.name !== 'Nishant' && (
              <button 
                onClick={() => { localStorage.setItem('userId', '69e30752203ee6939750006e'); window.location.reload(); }}
                style={{ fontSize: '10px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Switch to Nishant (Demo)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Portfolio Value</div>
          <div className={styles.statValue}>₹{totalValue.toLocaleString()}</div>
          <div className={styles.statTrendUp}>On-Chain Escrowed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Cumulative ROI</div>
          <div className={styles.statValueGold}>12.5%</div>
          <div className={styles.statTrendUp}>Estimated Yield</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Agreements</div>
          <div className={styles.statValue}>{activeCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Pending Pledges</div>
          <div className={styles.statValue}>{pendingCount}</div>
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
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading transactions...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Startup</th>
                <th className={styles.th}>Amount</th>
                <th className={styles.th}>Equity / Return</th>
                <th className={styles.th}>Instrument</th>
                <th className={styles.th}>Blockchain Hash</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No transactions found.</td>
                </tr>
              ) : (
                filteredInvestments.map((inv) => {
                  const startup = inv.campaignId || {};
                  return (
                    <tr key={inv._id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.startupCell}>
                          <div className={styles.startupLogo}>{startup.title?.[0] || 'X'}</div>
                          <span className={styles.startupName}>{startup.title}</span>
                        </div>
                      </td>
                      <td className={styles.td}>₹{inv.amount.toLocaleString()}</td>
                      <td className={styles.td}>
                        <span className={styles.equityBadge}>
                          {startup.fundingType === 'Equity' ? `${inv.equityPercentage}%` : `${startup.interestRate}% Yield`}
                        </span>
                      </td>
                      <td className={styles.td}>{startup.fundingType || 'N/A'}</td>
                      <td className={styles.td}>
                        {inv.blockchainTxHash ? (
                          <div title={inv.blockchainTxHash} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#3b82f6', fontFamily: 'monospace' }}>
                              {inv.blockchainTxHash.substring(0, 8)}...{inv.blockchainTxHash.substring(inv.blockchainTxHash.length - 4)}
                            </span>
                            <a 
                              href={`https://sepolia.etherscan.io/tx/${inv.blockchainTxHash}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ color: '#94a3b8' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            </a>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Off-chain / Legacy</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.badge} ${
                          inv.status === 'Active' || inv.status === 'Completed' ? styles.badgeActive : 
                          inv.status === 'Pending' ? styles.badgePending : 
                          styles.badgeCompleted
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

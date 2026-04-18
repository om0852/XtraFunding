"use client"

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/investor/reports?investorId=${userId}`);
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch reports data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading your reports...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--text-secondary)' }}>No investment data found. Start investing to see your reports!</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbHeader}>
        <span className={styles.breadcrumb}>Dashboard &gt; Reports & Analytics</span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Net Portfolio Worth</div>
          <div className={styles.statValue}>₹{data.netPortfolioWorth.toLocaleString('en-IN')}</div>
          <div className={`${styles.statSubtext} ${styles.positive}`}>Live data</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Realized Yield</div>
          <div className={styles.statValue}>₹{data.totalRealizedYield.toLocaleString('en-IN')}</div>
          <div className={`${styles.statSubtext} ${styles.positive}`}>Estimated</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Estimated Tax (FY25)</div>
          <div className={styles.statValue}>₹{Math.round(data.totalRealizedYield * 0.15).toLocaleString('en-IN')}</div>
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
                <option>All Time</option>
                <option>Past Year</option>
              </select>
            </div>
            
            {data.monthlyPerformance && data.monthlyPerformance.length > 0 ? (
              <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthlyPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <RechartsTooltip 
                      cursor={{ fill: '#F3F4F6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Invested']}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
               <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                 No performance data yet.
               </div>
            )}
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
                {data.reports && data.reports.map((report: any) => (
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
            
            {data.sectorAllocation && data.sectorAllocation.length > 0 ? (
              <>
                <div style={{ height: '220px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.sectorAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.sectorAllocation.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                      formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className={styles.allocationRow}>
                  {data.sectorAllocation.map((item: any) => (
                    <div key={item.name} className={styles.allocationItem} style={{ borderLeft: `4px solid ${item.color}`, paddingLeft: '12px', marginBottom: '16px' }}>
                      <div className={styles.itemHeader} style={{ marginBottom: '4px' }}>
                        <span className={styles.itemName} style={{ fontWeight: 600 }}>{item.name}</span>
                        <span className={styles.itemValue} style={{ fontWeight: 700 }}>{item.percentage}%</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.formattedValue}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>No sector data found.</div>
            )}
            
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong>Insight:</strong> Your portfolio is currently distributed across {data.sectorAllocation?.length || 0} sectors.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

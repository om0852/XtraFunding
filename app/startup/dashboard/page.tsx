"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function StartupDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [repairing, setRepairing] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/auth');
        return;
      }

      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        if (data.success) {
          const userCampaigns = data.campaigns.filter((c: any) => c.founderId === userId);
          setCampaigns(userCampaigns);

          // Fetch user's XRate reports for potential linkage repair
          const reportRes = await fetch(`/api/xrate?ownerId=${userId}`);
          const reportData = await reportRes.json();
          if (reportData.success) {
            setReports(reportData.reports);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const campaign = campaigns[activeCampaignIdx];

  // Fetch negotiations when the active campaign changes and it's an XRaise
  useEffect(() => {
    if (campaign && campaign.fundingModel === 'XRaise') {
      fetch(`/api/negotiations?campaignId=${campaign._id}`)
        .then(res => res.json())
        .then(negData => {
          if (negData.success) {
            setNegotiations(negData.data);
          } else {
            setNegotiations([]);
          }
        })
        .catch(err => console.error(err));
    } else {
      setNegotiations([]);
    }
  }, [campaign]);

  const handleRepairLinkage = async () => {
    if (!campaign || !selectedReportId) return;
    setRepairing(true);
    
    try {
      const res = await fetch(`/api/campaigns/${campaign._id}/link`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          xrateReportId: selectedReportId,
          founderId: localStorage.getItem('userId')
        })
      });
      
      const data = await res.json();
      if (data.success) {
        // Refresh campaign data
        const updatedCampaigns = [...campaigns];
        updatedCampaigns[activeCampaignIdx].xrateReportId = selectedReportId;
        setCampaigns(updatedCampaigns);
        toast.success('Institutional linkage repaired successfully!');
      } else {
        toast.error(data.error || 'Failed to repair linkage');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong during repair');
    } finally {
      setRepairing(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <main className={styles.content}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Campaign Overview</h1>
        <Link href="/startup/create-xfund">
          <button className={styles.btnCreate}>+ New Campaign</button>
        </Link>
      </div>

      {campaigns.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {campaigns.map((camp, idx) => (
            <button 
              key={camp._id}
              onClick={() => setActiveCampaignIdx(idx)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                backgroundColor: activeCampaignIdx === idx ? '#1e293b' : '#ffffff',
                color: activeCampaignIdx === idx ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontWeight: activeCampaignIdx === idx ? '600' : '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {camp.title}
            </button>
          ))}
        </div>
      )}

      {!campaign ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🚀</div>
          <h2>No active campaigns found</h2>
          <p>You haven't launched a funding campaign yet.</p>
          <Link href="/startup/create-xfund">
            <button className={styles.btnPrimaryLarge}>Launch XFund or XRaise</button>
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.subtext}>
            <span className={styles.subtextTag}>{campaign.title}</span>
            <span className={styles.subtextTag}>{campaign.sector}</span>
            <span className={styles.subtextTag}>{campaign.stage}</span>
            <span className={styles.subtextTagGold}>{campaign.fundingModel === 'XRaise' ? 'XRaise (Auction)' : 'XFund (Crowd)'}</span>
          </div>

          {!campaign.xrateReportId && (
            <div className={styles.repairNotice}>
              <div className={styles.repairInfo}>
                <h4>⚠️ Missing Institutional Analysis</h4>
                <p>Investors cannot compare this deal without a linked XRate report. Link one from your list below.</p>
              </div>
              <div className={styles.repairActions}>
                <select 
                  className={styles.repairSelect}
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                >
                  <option value="">Select verified report...</option>
                  {reports.map(r => (
                    <option key={r._id} value={r._id}>{r.startupName} (Score: {r.overallScore})</option>
                  ))}
                </select>
                <button 
                  className={styles.btnRepair}
                  onClick={handleRepairLinkage}
                  disabled={repairing || !selectedReportId}
                >
                  {repairing ? 'Linking...' : 'Link Analysis'}
                </button>
              </div>
            </div>
          )}

          {campaign.fundingModel === 'XFund' ? (
            <div className={styles.campaignCard}>
              <div className={styles.campaignLeft}>
                <div className={styles.fundingLabel}>Funding Progress</div>
                <div>
                  <span className={styles.fundingAmount}>₹{campaign.amountRaised.toLocaleString()}</span>
                  <span className={styles.fundingGoal}> raised of ₹{campaign.fundingGoal.toLocaleString()} goal</span>
                </div>
                
                <div className={styles.progressBarContainerLarge}>
                  <div 
                    className={styles.progressBarFillLarge} 
                    style={{ width: `${Math.min((campaign.amountRaised / campaign.fundingGoal) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className={styles.statsRow}>
                  <div className={`${styles.statItem} ${styles.statBlue}`}>
                    {((campaign.amountRaised / campaign.fundingGoal) * 100).toFixed(1)}% Funded
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={`${styles.statItem} ${styles.statGray}`}>Active</div>
                  <div className={styles.statDivider}></div>
                  <div className={`${styles.statItem} ${styles.statAmber}`}>
                    {campaign.status === 'Funded' ? 'Goal Reached! 🎉' : 'In Progress'}
                  </div>
                </div>
              </div>
              
              <div className={styles.campaignRight}>
                <div className={styles.countdownCircle}>
                  <div className={styles.countdownValue}>{campaign.status === 'Funded' ? '✓' : '!!'}</div>
                  <div className={styles.countdownLabel}>{campaign.status}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.tableWrapper} style={{ marginTop: 0 }}>
              <h2 className={styles.tableTitle}>Deal Pipeline (Bids)</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Investor</th>
                    <th className={styles.th}>Latest Bid</th>
                    <th className={styles.th}>Equity</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Exchanges</th>
                    <th className={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {negotiations.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                        No bids received yet.
                      </td>
                    </tr>
                  ) : (
                    negotiations.map((neg: any) => {
                      const latestOffer = neg.offers[neg.offers.length - 1];
                      return (
                        <tr key={neg._id} className={styles.tr}>
                          <td className={`${styles.td} ${styles.investorName}`}>{neg.investorId.name}</td>
                          <td className={styles.td}>₹{latestOffer.amount.toLocaleString()}</td>
                          <td className={styles.td}>{latestOffer.equity}%</td>
                          <td className={styles.td}>
                            <span className={
                              neg.status === 'Accepted' ? styles.badgeGreen : 
                              neg.status === 'Rejected' ? styles.badgeGray : styles.badgeAmber
                            }>
                              {neg.status}
                            </span>
                          </td>
                          <td className={styles.td}>{neg.offers.length}</td>
                          <td className={styles.td}>
                            <Link href={`/xraise?id=${neg._id}`}>
                              <button className={styles.btnReview}>Negotiate</button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.gridTwoCol}>
            <div className={`${styles.card} ${styles.colLeft}`}>
              <h2 className={styles.cardTitle}>Funding Terms</h2>
              <div className={styles.termsBox}>
                <div className={styles.termRow}>
                  <span>Funding Type</span>
                  <span className={styles.termVal}>{campaign.fundingType}</span>
                </div>
                {campaign.fundingType === 'Equity' ? (
                  <div className={styles.termRow}>
                    <span>Equity Offered</span>
                    <span className={styles.termVal}>{campaign.equityOffered}%</span>
                  </div>
                ) : (
                  <>
                    <div className={styles.termRow}>
                      <span>Flat Return</span>
                      <span className={styles.termVal}>{campaign.interestRate}%</span>
                    </div>
                    <div className={styles.termRow}>
                      <span>Repayment Period</span>
                      <span className={styles.termVal}>{campaign.repaymentMonths} Months</span>
                    </div>
                  </>
                )}
                <div className={styles.termRow}>
                  <span>Target Funding</span>
                  <span className={styles.termVal}>₹{campaign.fundingGoal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.colRight}`}>
              <h2 className={styles.cardTitle}>Disbursement Status</h2>
              <div className={styles.disburseContent}>
                {campaign.status === 'Funded' ? (
                  <div className={styles.successMsg}>
                    <h3>Project Funded!</h3>
                    <p>Total amount of ₹{campaign.amountRaised.toLocaleString()} is now being processed.</p>
                    <button className={styles.btnGoldFull}>Initiate Disbursement</button>
                  </div>
                ) : (
                  <div className={styles.pendingMsg}>
                    <p>Funds will be delivered once a deal is struck (XRaise) or goal met (XFund).</p>
                    <div className={styles.remainingAmount}>
                      {campaign.fundingModel === 'XFund' ? `₹${(campaign.fundingGoal - campaign.amountRaised).toLocaleString()} remaining` : 'Awaiting best offer'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

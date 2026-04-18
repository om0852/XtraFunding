"use client";

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css'; // Using the module CSS from parent directory
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { submitBlockchainInvestment } from '@/lib/web3';
import { toast } from 'sonner';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  
  const [existingNegotiation, setExistingNegotiation] = useState<any>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        const data = await res.json();
        if (data.success) {
          setCampaign(data.data);
          
          // Check for existing negotiation if it's XRaise
          if (data.data.fundingModel === 'XRaise') {
            const userId = localStorage.getItem('userId');
            if (userId) {
              const negRes = await fetch(`/api/negotiations?campaignId=${id}&investorId=${userId}`);
              const negData = await negRes.json();
              if (negData.success && negData.data.length > 0) {
                setExistingNegotiation(negData.data[0]);
              }
            }
          }
        } else {
          console.error('Campaign not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignData();
  }, [id]);

  const numAmount = parseInt(amount.replace(/,/g, '')) || 0;
  const isError = campaign && numAmount > 0 && numAmount < campaign.minimumInvestment;

  const handleStartNegotiation = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to negotiate!');
      return;
    }

    setIsInvesting(true);
    try {
      const res = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: userId,
          startupId: campaign.founderId._id,
          campaignId: id,
          offer: {
            sender: 'INVESTOR',
            amount: numAmount || campaign.fundingGoal,
            equity: campaign.equityOffered || 10,
            instrumentType: 'Equity',
            expiryDays: 7,
            terms: 'Initial bid based on campaign terms. Open to negotiation.'
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        const prefix = window.location.pathname.startsWith('/startup') ? '/startup' : '/investor';
        router.push(`${prefix}/xraise?id=${data.data._id}`);
      } else {
        toast.error(data.error || 'Failed to start negotiation');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsInvesting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(val);
  };

  const handlePillClick = (val: string) => {
    setAmount(val);
  };

  const handleInvest = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to invest in this campaign!');
      return;
    }

    setIsInvesting(true);
    try {
      // Because native UI deals with INR and the contract expects ETH, we'll do a mock conversion.
      // E.g., 1 ETH = ₹250,000 for representation.
      const mockEthAmount = (numAmount / 250000).toFixed(6);

      // Trigger Blockchain Transaction via MetaMask
      if (campaign.onChainCampaignId === undefined || campaign.onChainCampaignId === null) {
        toast.error("This campaign is not yet synchronized with the blockchain. Please contact the founder.");
        setIsInvesting(false);
        return;
      }

      const web3Res = await submitBlockchainInvestment(campaign.onChainCampaignId, mockEthAmount);
      
      if (!web3Res.success) {
        toast.error("Transaction failed on blockchain: " + web3Res.error);
        setIsInvesting(false);
        return;
      }

      // If blockchain succeeds, sync with off-chain database
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: userId,
          campaignId: id,
          amount: numAmount,
          txHash: web3Res.hash // Save the blockchain reference
        })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local state
        setCampaign((prev: any) => ({
          ...prev,
          amountRaised: data.amountRaised,
          status: data.campaignStatus
        }));
        setAmount('');
        toast.success('Investment successful! Funds are securely locked in the smart contract escrow.');
      } else {
        toast.error(data.error || 'Investment database sync failed, but blockchain succeeded. Transaction: ' + web3Res.hash);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('An error occurred: ' + (err.message || 'Unknown error'));
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Campaign...</div>;
  if (!campaign) return <div style={{ padding: '40px', textAlign: 'center' }}>Campaign not found.</div>;

  const progress = Math.min((campaign.amountRaised / campaign.fundingGoal) * 100, 100);

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.logoCircle}>{campaign.title.substring(0, 2).toUpperCase()}</div>
            <div className={styles.headerInfoWrapper}>
              <h1 className={styles.companyName}>{campaign.title}</h1>
              <p className={styles.tagline}>{campaign.tagline}</p>
              <div className={styles.badgesRow}>
                <span className={styles.badgePill}>{campaign.sector}</span>
                <span className={styles.badgePill}>{campaign.stage}</span>
                <span className={styles.badgePill}>{campaign.location}</span>
                <span className={styles.badgePillGold}>{campaign.fundingType} Model</span>
                {campaign.onChainCampaignId !== undefined && (
                  <span className={styles.badgePill} style={{ background: '#ecfdf5', color: '#059669', borderColor: '#10b981' }}>
                    🔗 On-Chain ID: {campaign.onChainCampaignId}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.miniStat}>{campaign.status}</div>
            <div className={styles.miniStat}>₹{campaign.minimumInvestment.toLocaleString()} Min</div>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.colLeft}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>The Pitch</h2>
              <div className={styles.overviewSection}>
                <p>{campaign.pitch}</p>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Funding Terms</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span>Funding Type</span>
                  <strong>{campaign.fundingType}</strong>
                </div>
                {campaign.fundingType === 'Equity' ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span>Equity Offered</span>
                    <strong>{campaign.equityOffered}%</strong>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span>Flat Return Percentage</span>
                      <strong>{campaign.interestRate}%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span>Repayment Period</span>
                      <strong>{campaign.repaymentMonths} Months</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={styles.colRight}>
            <div className={styles.stickySidebar}>
              <div className={styles.investCard}>
                <div className={styles.investRaised}>₹{campaign.amountRaised.toLocaleString()} raised</div>
                <div className={styles.investGoal}>of ₹{campaign.fundingGoal.toLocaleString()} goal</div>
                
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
                </div>
                
                <div className={styles.investStats}>
                  <span className={styles.textBlue}>{progress.toFixed(1)}% Funded</span>
                  <span className={styles.textAmber}>{campaign.status}</span>
                </div>
                
                <div className={styles.divider}></div>
                
                {campaign.status !== 'Funded' ? (
                  <div className={styles.inputGroup}>
                    {campaign.fundingModel === 'XFund' ? (
                      <>
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
                        {isError && <div className={styles.errorText}>Min investment: ₹{campaign.minimumInvestment}</div>}
                        
                        <div className={styles.quickPills}>
                          <button className={styles.quickPill} onClick={() => handlePillClick(campaign.minimumInvestment.toString())}>Min</button>
                          <button className={styles.quickPill} onClick={() => handlePillClick('10000')}>₹10K</button>
                          <button className={styles.quickPill} onClick={() => handlePillClick('50000')}>₹50K</button>
                        </div>
                        
                        <div className={styles.btnInvestWrapper}>
                          <button 
                            className={styles.btnInvest} 
                            disabled={isError || numAmount === 0 || isInvesting}
                            onClick={handleInvest}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          >
                            {isInvesting ? 'Processing Tx...' : (
                              <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                                Invest with MetaMask
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {existingNegotiation ? (
                          <div className={styles.negotiationStatusCard}>
                            <p>You have an active negotiation for this project.</p>
                            <Link href={`${window.location.pathname.startsWith('/startup') ? '/startup' : '/investor'}/xraise?id=${existingNegotiation._id}`}>
                              <button className={styles.btnInvest}>View Negotiation Thread</button>
                            </Link>
                          </div>
                        ) : (
                          <>
                            <label className={styles.inputLabel}>Pitch your Bid (₹)</label>
                            <div className={styles.inputWrapper}>
                              <span className={styles.inputPrefix}>₹</span>
                              <input 
                                type="text" 
                                className={styles.amountInput}
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder={campaign.fundingGoal.toLocaleString()}
                              />
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0' }}>
                              You are starting a private negotiation with the founder.
                            </p>
                            <div className={styles.btnInvestWrapper}>
                              <button 
                                className={styles.btnInvest} 
                                disabled={isInvesting}
                                onClick={handleStartNegotiation}
                              >
                                {isInvesting ? 'Starting Deal...' : 'Start Negotiation'}
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    
                    <div className={styles.escrowText}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      {campaign.fundingModel === 'XFund' ? 'Funds held in escrow until target reached' : 'Private & Secure Negotiation'}
                    </div>
                  </div>
                ) : (
                  <div className={styles.fundedBadge}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                    <h3>Fully Funded!</h3>
                    <p>This XFund has reached its goal. Funding is now closed and disbursement is pending.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

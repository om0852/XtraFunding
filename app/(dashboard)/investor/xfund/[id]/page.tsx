'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/components/features/Campaign/CampaignContent.module.css';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { submitBlockchainInvestment } from '@/lib/web3';
import { toast } from 'sonner';

export default function XFundDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        const data = await res.json();
        if (data.success && data.data.fundingModel === 'XFund') {
          setCampaign(data.data);
        } else {
            console.error('Campaign not found or not XFund');
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
      toast.error('Please login to invest!');
      return;
    }

    setIsInvesting(true);
    try {
      const mockEthAmount = (numAmount / 250000).toFixed(6);

      if (campaign.onChainCampaignId === undefined || campaign.onChainCampaignId === null) {
        toast.error("This campaign is not yet synchronized with the blockchain.");
        setIsInvesting(false);
        return;
      }

      const web3Res = await submitBlockchainInvestment(campaign.onChainCampaignId, mockEthAmount);
      
      if (!web3Res.success) {
        toast.error("Transaction failed on blockchain: " + web3Res.error);
        setIsInvesting(false);
        return;
      }

      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: userId,
          campaignId: id,
          amount: numAmount,
          txHash: web3Res.hash
        })
      });
      const data = await res.json();
      if (data.success) {
        setCampaign((prev: any) => ({
          ...prev,
          amountRaised: data.amountRaised,
          status: data.campaignStatus
        }));
        setAmount('');
        toast.success('Investment successful! Funds are securely locked in the smart contract escrow.');
      }
    } catch (err: any) {
      toast.error('An error occurred: ' + (err.message || 'Unknown error'));
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading XFund...</div>;
  if (!campaign) return <div className={styles.error}>Campaign not found or not an XFund model.</div>;

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
                <span className={styles.badgePill}>{campaign.location}</span>
                <span className={styles.badgePillGold}>XFund Model</span>
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
              <h2 className={styles.cardTitle}>Funding Milestones</h2>
              <div className={styles.milestoneInfo}>
                <p>This startup uses the <strong>XFund Escrow Model</strong>. Your funds are released to the founder ONLY when they hit verified milestones. If they fail, your pending capital is protected.</p>
              </div>
              {/* Milestone visual would go here, reusing the same logic */}
              <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '20px' }}>
                 <p style={{fontSize: '14px', color: '#64748B'}}>Current Phase: Stage {campaign.disbursed ? '2' : '1'} (Development)</p>
              </div>
            </div>
            
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>The Pitch</h2>
              <p className={styles.overviewText}>{campaign.pitch}</p>
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
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Investment Amount</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>₹</span>
                    <input 
                      type="text" 
                      className={`${styles.amountInput} ${isError ? styles.amountInputError : ''}`}
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                    />
                  </div>
                  {isError && <div className={styles.errorText}>Min: ₹{campaign.minimumInvestment}</div>}
                  
                  <div className={styles.quickPills}>
                    <button className={styles.quickPill} onClick={() => handlePillClick(campaign.minimumInvestment.toString())}>Min</button>
                    <button className={styles.quickPill} onClick={() => handlePillClick('50000')}>₹50K</button>
                  </div>
                  
                  <button 
                    className={styles.btnInvest} 
                    disabled={isError || numAmount === 0 || isInvesting}
                    onClick={handleInvest}
                    style={{marginTop: '20px'}}
                  >
                    {isInvesting ? 'Connecting MetaMask...' : 'Invest with MetaMask'}
                  </button>
                  
                  <div className={styles.escrowText}>
                    🛡️ Funds held in Secure Escrow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

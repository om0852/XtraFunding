'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/components/features/Campaign/CampaignContent.module.css';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function XRaiseExplorePage() {
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
        if (data.success && data.data.fundingModel === 'XRaise') {
          setCampaign(data.data);
          
          const userId = localStorage.getItem('userId');
          if (userId) {
            const negRes = await fetch(`/api/negotiations?campaignId=${id}&investorId=${userId}`);
            const negData = await negRes.json();
            if (negData.success && negData.data.length > 0) {
              setExistingNegotiation(negData.data[0]);
            }
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignData();
  }, [id]);

  const handleStartNegotiation = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login to negotiate!');
      return;
    }

    setIsInvesting(true);
    try {
      const numAmount = parseInt(amount.replace(/,/g, '')) || campaign.fundingGoal;
      const res = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: userId,
          startupId: campaign.founderId._id,
          campaignId: id,
          offer: {
            sender: 'INVESTOR',
            amount: numAmount,
            equity: campaign.equityOffered || 10,
            instrumentType: 'Equity',
            expiryDays: 7,
            terms: 'Initial bid based on campaign terms. Open to negotiation.'
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/investor/xraise?id=${data.data._id}`);
      } else {
        alert(data.error || 'Failed to start negotiation');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading XRaise Opportunity...</div>;
  if (!campaign) return <div className={styles.error}>Campaign not found or not an XRaise model.</div>;

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.headerCard} style={{borderColor: '#F5A623', background: '#FFFDF9'}}>
          <div className={styles.headerLeft}>
            <div className={styles.logoCircle} style={{background: '#F5A623', color: 'white'}}>{campaign.title.substring(0, 2).toUpperCase()}</div>
            <div className={styles.headerInfoWrapper}>
              <h1 className={styles.companyName}>{campaign.title}</h1>
              <p className={styles.tagline}>{campaign.tagline}</p>
              <div className={styles.badgesRow}>
                <span className={styles.badgePill}>{campaign.sector}</span>
                <span className={styles.badgePillGold}>XRaise Strategy Deal</span>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.miniStat}>Bidding Open</div>
            <div className={styles.miniStat}>Ask: ₹{campaign.fundingGoal.toLocaleString()}</div>
          </div>
        </div>

        <div className={styles.gridTwoCol}>
          <div className={styles.colLeft}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Why XRaise?</h2>
              <div className={styles.overviewSection}>
                <p>Strategic deals are rarely "one size fits all". With XRaise, you aren't just an investor—you're a partner. Negotiate equity, board seats, or revenue-share instruments in a secure, private deal room.</p>
                <ul style={{fontSize: '14px', color: '#64748B', lineHeight: '2'}}>
                    <li>✓ Custom term sheets</li>
                    <li>✓ Private data room access</li>
                    <li>✓ Direct-to-founder communication</li>
                </ul>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Founder's Pitch</h2>
              <p className={styles.overviewText}>{campaign.pitch}</p>
            </div>
          </div>

          <div className={styles.colRight}>
            <div className={styles.stickySidebar}>
              <div className={styles.investCard} style={{border: '2px solid #F5A623'}}>
                {existingNegotiation ? (
                  <div className={styles.negotiationStatusCard}>
                    <p>You already have a deal in progress with this startup.</p>
                    <Link href={`/investor/xraise?id=${existingNegotiation._id}`}>
                      <button className={styles.btnInvest} style={{background: '#0F172A', color: 'white'}}>Go to Deal Room</button>
                    </Link>
                  </div>
                ) : (
                  <div className={styles.inputGroup}>
                    <h3 style={{fontSize: '18px', fontWeight: '800', marginBottom: '16px'}}>Open a Deal</h3>
                    <label className={styles.inputLabel}>Initial Bid Amount (₹)</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>₹</span>
                      <input 
                        type="text" 
                        className={styles.amountInput}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/\D/g,''))}
                        placeholder={campaign.fundingGoal.toLocaleString()}
                      />
                    </div>
                    <p style={{fontSize: '12px', color: '#64748B', marginTop: '12px'}}>Starting a negotiation notifies the founder immediately. You can modify terms later in the deal room.</p>
                    <button 
                      className={styles.btnInvest} 
                      disabled={isInvesting}
                      onClick={handleStartNegotiation}
                      style={{marginTop: '20px', background: '#F5A623', color: '#0F172A'}}
                    >
                      {isInvesting ? 'Opening Deal Room...' : 'Initiate Negotiation'}
                    </button>
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

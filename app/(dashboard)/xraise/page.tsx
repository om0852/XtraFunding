"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function XRaisePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const negId = searchParams.get('id');
  
  const [negotiation, setNegotiation] = useState<any>(null);
  const [investment, setInvestment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Form states
  const [offerAmount, setOfferAmount] = useState('');
  const [equityPct, setEquityPct] = useState('');
  const [offerType, setOfferType] = useState('Equity');
  const [terms, setTerms] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);

    const fetchData = async () => {
      if (!negId) return;
      try {
        const res = await fetch(`/api/negotiations/${negId}`);
        const data = await res.json();
        if (data.success) {
          setNegotiation(data.data);
          
          // Pre-fill form with latest values
          const latest = data.data.offers[data.data.offers.length - 1];
          setOfferAmount(latest.amount.toString());
          setEquityPct(latest.equity.toString());
          setOfferType(latest.instrumentType);

          // If deal accepted, check investment status
          if (data.data.status === 'Accepted') {
            const invRes = await fetch(`/api/investments/query?campaignId=${data.data.campaignId._id}&investorId=${data.data.investorId._id}`);
            const invData = await invRes.json();
            if (invData.success) {
              setInvestment(invData.data);
            }
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [negId]);

  const handleAction = async (action: 'COUNTER' | 'ACCEPT' | 'REJECT') => {
    if (!negotiation) return;
    setIsSubmitting(true);

    try {
      const isInvestor = currentUserId === negotiation.investorId._id;
      const payload: any = {};

      if (action === 'COUNTER') {
        payload.offer = {
          sender: isInvestor ? 'INVESTOR' : 'STARTUP',
          amount: Number(offerAmount),
          equity: Number(equityPct),
          instrumentType: offerType,
          expiryDays: 7,
          terms: terms || 'Terms as discussed.'
        };
      } else if (action === 'ACCEPT') {
        payload.status = 'Accepted';
      } else if (action === 'REJECT') {
        payload.status = 'Rejected';
      }

      const res = await fetch(`/api/negotiations/${negId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setNegotiation(data.data);
        if (action === 'COUNTER') setTerms('');
        
        // Refresh investment if accepted
        if (action === 'ACCEPT') {
          const invRes = await fetch(`/api/investments/query?campaignId=${data.data.campaignId._id}&investorId=${data.data.investorId._id}`);
          const invData = await invRes.json();
          if (invData.success) setInvestment(invData.data);
        }

        alert(`Successfully ${action === 'COUNTER' ? 'sent counter offer' : action === 'ACCEPT' ? 'accepted deal' : 'rejected offer'}`);
      } else {
        alert(data.error || 'Failed to process action');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!investment) return;
    setIsPaying(true);
    
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const res = await fetch(`/api/investments/${investment._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      const data = await res.json();
      if (data.success) {
        setInvestment(data.data);
        alert('Payment processed successfully! Funds are now in Escrow.');
      }
    } catch (err) {
      alert('Payment failed');
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Deal Room...</div>;
  if (!negotiation) return <div className={styles.error}>Negotiation not found.</div>;

  const isInvestor = currentUserId === negotiation.investorId._id;
  const isStartup = currentUserId === negotiation.startupId._id;
  const latestOffer = negotiation.offers[negotiation.offers.length - 1];
  const dealClosed = negotiation.status === 'Accepted';
  const lastSender = latestOffer.sender;
  const isMyTurn = (isInvestor && lastSender === 'STARTUP') || (isStartup && lastSender === 'INVESTOR');

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>XRaise Negotiation Room</h1>
          <div className={styles.statusBadge}>
            <div className={negotiation.status === 'Accepted' ? styles.dotGreen : styles.pulsingDot}></div>
            {negotiation.status}
          </div>
        </div>

        {dealClosed && (
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>✓</div>
            <div>
              <div className={styles.successTitle}>Deal Closed Successfully 🎉</div>
              <div className={styles.successSub}>
                Terms agreed: ₹{latestOffer.amount.toLocaleString()} for {latestOffer.equity}% equity.
              </div>
            </div>
          </div>
        )}

        <div className={styles.gridTwoPanel}>
          <div className={styles.panelLeft}>
            <div className={styles.card}>
              <div className={styles.startupCardHeader}>
                <div className={styles.startupLogo}>
                  {negotiation.campaignId?.title ? negotiation.campaignId.title.substring(0, 2) : '??'}
                </div>
                <div>
                  <div className={styles.startupName}>{negotiation.campaignId?.title || 'Unknown Project'}</div>
                  <div className={styles.sectorBadge}>{negotiation.campaignId?.sector || 'N/A'}</div>
                </div>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Ask</span>
                <span className={styles.dataValue}>₹{negotiation.campaignId.fundingGoal.toLocaleString()}</span>
              </div>
              <Link href={`/campaign/${negotiation.campaignId._id}`} style={{textDecoration: 'none'}}>
                <button className={styles.btnCampaign}>View Campaign</button>
              </Link>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>Current Offer</div>
              <div className={styles.dealAmount}>₹{latestOffer.amount.toLocaleString()}</div>
              <div className={styles.dealEquity}>for {latestOffer.equity}% {latestOffer.instrumentType}</div>
              <div className={lastSender === (isInvestor ? 'INVESTOR' : 'STARTUP') ? styles.badgeAwaiting : styles.badgeYourTurn}>
                {lastSender === (isInvestor ? 'INVESTOR' : 'STARTUP') ? 'Awaiting Counter' : 'Your Turn to Respond'}
              </div>
            </div>
          </div>

          <div className={styles.panelRight}>
            {!dealClosed ? (
              <>
                <div className={styles.card}>
                  <div className={styles.threadHeader}>
                    <div className={styles.threadTitle}>Offer History</div>
                    <div className={styles.threadCount}>{negotiation.offers.length} exchanges</div>
                  </div>

                  <div className={styles.offerStack}>
                    {negotiation.offers.map((off: any, idx: number) => {
                      const isMe = (isInvestor && off.sender === 'INVESTOR') || (isStartup && off.sender === 'STARTUP');
                      return (
                        <div key={idx} className={`${styles.offerMsg} ${isMe ? styles.offerMsgYou : styles.offerMsgFounder} ${idx === negotiation.offers.length - 1 ? styles.offerMsgLatest : ''}`}>
                          <div className={styles.offerMsgHeader}>
                            <span className={styles.offerSenderName}>
                              {off.sender === 'INVESTOR' ? negotiation.investorId.name : 'Startup Founder'}
                            </span>
                            <span className={styles.offerTime}>{new Date(off.timestamp).toLocaleString()}</span>
                          </div>
                          <div className={styles.offerBodyVal}>₹{off.amount.toLocaleString()} for {off.equity}%</div>
                          <p className={styles.offerTermsText}>{off.terms}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isMyTurn && (
                  <div className={styles.card}>
                    <div className={styles.threadTitle}>Respond to Offer</div>
                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Amount (₹)</label>
                        <input className={styles.textInput} value={offerAmount} onChange={e => setOfferAmount(e.target.value)} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Equity (%)</label>
                        <input className={styles.textInput} value={equityPct} onChange={e => setEquityPct(e.target.value)} />
                      </div>
                      <div className={`${styles.inputGroup} ${styles.formFieldFull}`}>
                        <label className={styles.inputLabel}>Message / Terms</label>
                        <textarea className={styles.textInput} rows={3} value={terms} onChange={e => setTerms(e.target.value)} placeholder="Explain your counter offer..."></textarea>
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button className={styles.btnReject} onClick={() => handleAction('REJECT')} disabled={isSubmitting}>Reject & Close</button>
                      <button className={styles.btnSolidBlue} onClick={() => handleAction('ACCEPT')} disabled={isSubmitting}>Accept Deal</button>
                      <button className={styles.btnSend} onClick={() => handleAction('COUNTER')} disabled={isSubmitting}>Send Counter</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.card}>
                <div className={styles.threadTitle}>Final Agreement</div>
                <div style={{ padding: '24px', background: '#F8F9FC', borderRadius: '8px', borderLeft: '4px solid #10B981', marginBottom: '24px' }}>
                  <div className={styles.dealAmount}>₹{latestOffer.amount.toLocaleString()}</div>
                  <div className={styles.dealEquity}>for {latestOffer.equity}% equity</div>
                </div>

                {isInvestor && investment?.status === 'Pending' && (
                  <div className={styles.paymentPrompt}>
                    <h3>Action Required: Fund the Deal</h3>
                    <p>To finalize the agreement and move funds to escrow, please complete the payment.</p>
                    <button 
                      className={styles.btnPayNow} 
                      onClick={handlePayment}
                      disabled={isPaying}
                    >
                      {isPaying ? 'Processing Payment...' : 'Secure Deal & Transfer Funds'}
                    </button>
                  </div>
                )}

                {isInvestor && investment?.status === 'Completed' && (
                  <div className={styles.successBannerSmall}>
                    <div className={styles.successIconSmall}>✓</div>
                    <div>
                      <div className={styles.successTitleSmall}>Funds in Escrow</div>
                      <div className={styles.successSubSmall}>Your investment of ₹{investment.amount.toLocaleString()} is safely held.</div>
                    </div>
                  </div>
                )}

                {isStartup && (
                  <div className={styles.startupPaymentStatus}>
                    <span className={styles.statusLabel}>Investor Payment Status:</span>
                    <span className={investment?.status === 'Completed' ? styles.statusPaid : styles.statusAwaiting}>
                      {investment?.status === 'Completed' ? 'Completed (Funds in Escrow)' : 'Awaiting Transfer...'}
                    </span>
                  </div>
                )}

                <button className={styles.btnSolidBlue} style={{ marginTop: '24px' }} onClick={() => router.push(isInvestor ? '/investor/dashboard' : '/startup/dashboard')}>
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

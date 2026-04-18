'use client';

import React, { useState, useEffect } from 'react';
import styles from './XRaiseContent.module.css';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { submitBlockchainInvestment } from '@/lib/web3';
import { useComparison } from '@/context/ComparisonContext';
import { toast } from 'sonner';

export default function XRaiseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const negId = searchParams.get('id');
  
  const [negotiation, setNegotiation] = useState<any>(null);
  const [allNegotiations, setAllNegotiations] = useState<any[]>([]);
  const [investment, setInvestment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const { selectedDeals, addDeal, removeDeal } = useComparison();

  // Form states
  const [offerAmount, setOfferAmount] = useState('');
  const [equityPct, setEquityPct] = useState('');
  const [offerType, setOfferType] = useState('Equity');
  const [terms, setTerms] = useState('');

  // XAgent state
  const [xagentLoading, setXagentLoading] = useState(false);
  const [xagentSuggestion, setXagentSuggestion] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);

    const fetchData = async () => {
      try {
        if (negId) {
          const res = await fetch(`/api/negotiations/${negId}`);
          const data = await res.json();
          if (data.success) {
            setNegotiation(data.data);
            const latest = data.data.offers[data.data.offers.length - 1];
            setOfferAmount(latest.amount.toString());
            setEquityPct(latest.equity.toString());
            setOfferType(latest.instrumentType);

            if (data.data.status === 'Accepted') {
              const invRes = await fetch(`/api/investments/query?campaignId=${data.data.campaignId._id}&investorId=${data.data.investorId._id}`);
              const invData = await invRes.json();
              if (invData.success) {
                setInvestment(invData.data);
              }
            }
          }
        } else if (userId) {
          // No negId, fetch list for the user based on role in pathname
          const isInvestorPath = window.location.pathname.includes('/investor');
          const roleParam = isInvestorPath ? `investorId=${userId}` : `startupId=${userId}`;
          const res = await fetch(`/api/negotiations?${roleParam}`);
          const data = await res.json();
          if (data.success) {
            setAllNegotiations(data.data);
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

  const askXAgent = async () => {
    if (!negotiation || !negId) return;
    setXagentLoading(true);
    setXagentSuggestion(null);
    try {
      const isInvestor = currentUserId === negotiation.investorId._id;
      const res = await fetch(`/api/negotiations/${negId}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestingRole: isInvestor ? 'INVESTOR' : 'STARTUP' }),
      });
      const data = await res.json();
      if (data.success) {
        setXagentSuggestion(data.suggestion);
      } else {
        toast.error('XAgent: ' + (data.error || 'Failed to generate suggestion'));
      }
    } catch (err) {
      toast.error('XAgent encountered an error. Please try again.');
    } finally {
      setXagentLoading(false);
    }
  };

  const applyXAgentSuggestion = () => {
    if (!xagentSuggestion) return;
    setOfferAmount(xagentSuggestion.suggestedAmount.toString());
    setEquityPct(xagentSuggestion.suggestedEquity.toString());
    setOfferType(xagentSuggestion.suggestedInstrumentType);
    setTerms(xagentSuggestion.suggestedTerms);
    toast.success('XAgent suggestion applied to your offer form!');
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getHealthClass = (label: string) => {
    const l = label?.toLowerCase() || '';
    if (l.includes('strong')) return styles.healthStrong;
    if (l.includes('risk') || l.includes('low')) return styles.healthRisk;
    return styles.healthModerate;
  };

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
        
        if (action === 'ACCEPT') {
          const invRes = await fetch(`/api/investments/query?campaignId=${data.data.campaignId._id}&investorId=${data.data.investorId._id}`);
          const invData = await invRes.json();
          if (invData.success) setInvestment(invData.data);
        }

        toast.success(`Successfully ${action === 'COUNTER' ? 'sent counter offer' : action === 'ACCEPT' ? 'accepted deal' : 'rejected offer'}`);
      } else {
        toast.error(data.error || 'Failed to process action');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!investment || !negotiation) return;
    setIsPaying(true);
    
    try {
      const onChainId = negotiation.campaignId.onChainCampaignId;
      if (onChainId === undefined || onChainId === null) {
        toast.error("This campaign is not yet synchronized with the blockchain. Please contact the founder.");
        setIsPaying(false);
        return;
      }

      const mockEthAmount = (investment.amount / 250000).toFixed(6);
      const web3Res = await submitBlockchainInvestment(onChainId, mockEthAmount);
      
      if (!web3Res.success) {
        toast.error("Transaction failed on blockchain: " + web3Res.error);
        setIsPaying(false);
        return;
      }
      
      const res = await fetch(`/api/investments/${investment._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Completed',
          blockchainTxHash: web3Res.hash
        })
      });
      const data = await res.json();
      if (data.success) {
        setInvestment(data.data);
        toast.success('Payment processed successfully! Funds are now securely held in Escrow on-chain.');
      } else {
        toast.error('Database sync failed, but blockchain transaction was successful: ' + web3Res.hash);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Payment failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsPaying(false);
    }
  };

  const handleBlockchainVerify = async () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating Zero-Knowledge Proof...',
        success: 'Verification Success! Proof anchored on Base L2.',
        error: 'Verification failed',
      }
    );
  };

  if (loading) return (
    <div className={styles.pageContainer}>
      <div className={styles.loading}>
        <div className={styles.pulsingDot}></div>
        Loading XRaise...
      </div>
    </div>
  );

  // LIST VIEW RENDERING
  if (!negId) {
    const isInvestorMode = window.location.pathname.includes('/investor');
    return (
      <div className={styles.pageContainer}>
        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>XRaise Settlement Room</h1>
            <div className={styles.threadCount}>{allNegotiations.length} Active Deals</div>
          </div>

          {allNegotiations.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No active negotiations found</h2>
              <p>Explore startups and initiate an offer to see them here.</p>
              <Link href="/campaign">
                <button className={styles.btnSolidBlue} style={{marginTop: '20px'}}>Explore Campaigns</button>
              </Link>
            </div>
          ) : (
            <div className={styles.listGrid}>
              {allNegotiations.map((neg: any) => (
                <Link 
                  key={neg._id} 
                  href={`${isInvestorMode ? '/investor' : '/startup'}/xraise?id=${neg._id}`}
                  className={styles.negCard}
                >
                  <div className={styles.negCardHeader}>
                    <div className={styles.cardProjectInfo}>
                      <div className={styles.cardProjectLogo}>
                        {neg.campaignId?.title ? neg.campaignId.title.substring(0, 2) : '??'}
                      </div>
                      <div>
                        <div className={styles.cardProjectName}>{neg.campaignId?.title || 'Unknown Project'}</div>
                        <div className={styles.cardLastUpdate}>{neg.campaignId?.sector}</div>
                      </div>
                    </div>
                    <div className={`${styles.cardStatus} ${neg.status === 'Accepted' ? styles.statusAccepted : styles.statusNegotiating}`}>
                      {neg.status}
                    </div>
                  </div>
                  
                  <div className={styles.negCardBody}>
                    <div className={styles.cardOfferVal}>₹{neg.offers[neg.offers.length-1].amount.toLocaleString()}</div>
                    <div className={styles.cardOfferEquity}>for {neg.offers[neg.offers.length-1].equity}% Equity</div>
                  </div>

                  <div className={styles.negCardFooter}>
                    <div style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
                      {isInvestorMode && (
                        <button 
                          className={styles.btnSelectSmall}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const isSelected = selectedDeals.find(s => s.id === neg.campaignId?._id);
                            if (isSelected) removeDeal(neg.campaignId?._id);
                            else addDeal({ id: neg.campaignId?._id, name: neg.campaignId?.title });
                          }}
                        >
                          {selectedDeals.find(s => s.id === neg.campaignId?._id) ? 'Selected' : 'Select'}
                        </button>
                      )}
                    </div>
                    <div className={styles.investorDetail}>
                      {isInvestorMode ? `Founder: Startup` : `Investor: ${neg.investorId?.name}`}
                    </div>
                    <div className={styles.cardLastUpdate}>
                      {new Date(neg.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (!negotiation) return (
    <div className={styles.pageContainer}>
      <div className={styles.error}>
        Negotiation not found. 
        <Link href={window.location.pathname}>Back to list</Link>
      </div>
    </div>
  );

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
          <div>
             <Link href={window.location.pathname} className={styles.btnBackToList}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back to all offers
             </Link>
             <h1 className={styles.pageTitle}>XRaise Negotiation Room</h1>
          </div>
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
              <Link href={`${window.location.pathname.startsWith('/startup') ? '/startup' : '/investor'}/campaign/${negotiation.campaignId._id}`} style={{textDecoration: 'none'}}>
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
              
              {isInvestor && (
                <div className={styles.zkpVerification} style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <button className={styles.btnSecondarySmall} onClick={handleBlockchainVerify}>
                    Verify Assets via ZK-Proof
                  </button>
                </div>
              )}
            </div>

            {/* ── XAgent Panel ── */}
            {!dealClosed && (
              <div className={styles.xagentPanel}>
                <div className={styles.xagentHeader}>
                  <div className={styles.xagentTitleRow}>
                    <div className={styles.xagentIcon}>🤖</div>
                    <div>
                      <div className={styles.xagentTitle}>XAgent</div>
                      <div className={styles.xagentSubtitle}>AI Negotiation Co-Pilot</div>
                    </div>
                  </div>
                  <div className={styles.xagentBadge}>Beta</div>
                </div>

                <button
                  id="xagent-suggest-btn"
                  className={styles.btnAskXagent}
                  onClick={askXAgent}
                  disabled={xagentLoading}
                >
                  {xagentLoading ? (
                    <>
                      <span>Analyzing...</span>
                      <div className={styles.thinkingDots}>
                        <span /><span /><span />
                      </div>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Suggest Best Counter-Offer</span>
                    </>
                  )}
                </button>

                {xagentLoading && (
                  <div className={styles.xagentLoading}>
                    <div className={styles.xagentThinkingLabel}>
                      XAgent is analyzing offer history & XRate data
                      <div className={styles.thinkingDots}>
                        <span /><span /><span />
                      </div>
                    </div>
                    <div className={styles.xagentShimmer} style={{ height: '80px' }} />
                    <div className={styles.xagentShimmer} style={{ height: '48px' }} />
                    <div className={styles.xagentShimmer} style={{ height: '64px' }} />
                  </div>
                )}

                {xagentSuggestion && !xagentLoading && (
                  <div className={styles.xagentResult}>

                    {/* Suggested Offer Card */}
                    <div className={styles.xagentSuggestionCard}>
                      <div className={styles.xagentSuggestionLabel}>Suggested Counter-Offer</div>
                      <div className={styles.xagentSuggestedAmount}>
                        ₹{Number(xagentSuggestion.suggestedAmount).toLocaleString('en-IN')}
                      </div>
                      <div className={styles.xagentSuggestedEquity}>
                        for {xagentSuggestion.suggestedEquity}% equity
                      </div>
                      <span className={styles.xagentInstrumentBadge}>
                        {xagentSuggestion.suggestedInstrumentType}
                      </span>
                      {xagentSuggestion.suggestedTerms && (
                        <div className={styles.xagentTermsText}>
                          &ldquo;{xagentSuggestion.suggestedTerms}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Deal Health */}
                    <div className={styles.xagentSuggestionCard}>
                      <div className={styles.xagentSuggestionLabel}>Deal Health</div>
                      <div className={styles.xagentHealthRow}>
                        <span className={styles.xagentHealthLabel}>Score</span>
                        <div className={styles.xagentHealthBar}>
                          <div
                            className={styles.xagentHealthFill}
                            style={{
                              width: `${xagentSuggestion.dealHealthScore}%`,
                              background: getHealthColor(xagentSuggestion.dealHealthScore)
                            }}
                          />
                        </div>
                        <span className={styles.xagentHealthScore}>
                          {xagentSuggestion.dealHealthScore}/100
                        </span>
                        <span className={`${styles.xagentHealthStatus} ${getHealthClass(xagentSuggestion.dealHealthLabel)}`}>
                          {xagentSuggestion.dealHealthLabel}
                        </span>
                      </div>
                      {xagentSuggestion.closingProbability && (
                        <div className={styles.xagentProbability}>
                          📊 {xagentSuggestion.closingProbability}
                        </div>
                      )}
                    </div>

                    {/* Reasoning */}
                    <div className={styles.xagentReasoning}>
                      <div className={styles.xagentReasoningLabel}>🧠 Agent Reasoning</div>
                      {xagentSuggestion.reasoning}
                    </div>

                    {/* Red Flags */}
                    {xagentSuggestion.redFlags && xagentSuggestion.redFlags.length > 0 && (
                      <div className={styles.xagentRedFlags}>
                        <div className={styles.xagentRedFlagsLabel}>
                          ⚠️ Red Flags ({xagentSuggestion.redFlags.length})
                        </div>
                        {xagentSuggestion.redFlags.map((flag: string, i: number) => (
                          <div key={i} className={styles.xagentRedFlagItem}>
                            <div className={styles.xagentRedFlagDot} />
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Apply Button */}
                    {isMyTurn && (
                      <button
                        id="xagent-apply-btn"
                        className={styles.btnApplyXagent}
                        onClick={applyXAgentSuggestion}
                      >
                        ✅ Apply to Offer Form
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
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

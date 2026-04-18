"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function XRaisePage() {
  const [dealClosed, setDealClosed] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [equityPct, setEquityPct] = useState('');
  const [offerType, setOfferType] = useState('');
  const [terms, setTerms] = useState('');
  
  const numAmount = parseInt(offerAmount.replace(/\D/g, ''), 10) || 0;
  const numEq = parseFloat(equityPct) || 0;
  
  const isAmountError = numAmount > 0 && numAmount < 10000;
  const isEqError = (numEq > 0 && (numEq < 0.1 || numEq > 49));
  
  // Form requires fields to be not empty and valid
  const canSubmit = !isAmountError && !isEqError && numAmount >= 10000 && numEq >= 0.1 && numEq <= 49 && offerType !== '';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setOfferAmount(val);
  };

  const handleDealCloseToggle = () => {
    setDealClosed(!dealClosed);
  };

  return (
    <div className={styles.pageContainer}>

      <main className={styles.mainContent}>
        
        {/* PAGE HEADER */}
        <div className={styles.pageHeader}>
          <div>

            <h1 className={styles.pageTitle}>XRaise Negotiation</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={handleDealCloseToggle} style={{ color: '#F5A623', background: 'none', border: '1px solid #F5A623', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '12px' }}>
              [Toggle Deal State]
            </button>
            <div className={styles.statusBadge}>
              <div className={styles.pulsingDot}></div>
              Negotiating
            </div>
          </div>
        </div>

        {dealClosed && (
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <div className={styles.successTitle}>Deal Closed Successfully 🎉</div>
              <div className={styles.successSub}>You and GreenHarvest AI have agreed on the final terms of ₹2,00,000 for 12% equity.</div>
            </div>
          </div>
        )}

        {/* TWO PANEL LAYOUT */}
        <div className={styles.gridTwoPanel}>
          
          {/* LEFT PANEL */}
          <div className={styles.panelLeft}>
            
            <div className={styles.card}>
              <div className={styles.startupCardHeader}>
                <div className={styles.startupLogo}>GH</div>
                <div>
                  <div className={styles.startupName}>GreenHarvest AI</div>
                  <div className={styles.sectorBadge}>AgriTech</div>
                </div>
              </div>
              <div className={styles.divider}></div>
              
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Funding Ask</span>
                <span className={styles.dataValue}>₹15,00,000</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Equity Offered</span>
                <span className={styles.dataValue}>8%</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>XRate Score</span>
                <span className={styles.xrateBadge}>74</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Stage</span>
                <span className={styles.dataValue}>Seed</span>
              </div>
              
              <Link href="/campaign" style={{textDecoration: 'none'}}>
                <button className={styles.btnCampaign}>View Full Campaign</button>
              </Link>
            </div>

            <div className={styles.card}>
              <div className={styles.investorHeader}>
                <div className={styles.investorAvatar}>RS</div>
                <div>
                  <div className={styles.investorName}>
                    You (Rahul Sharma)
                    <span className={styles.verifiedBadge}>Verified Investor</span>
                  </div>
                  <div className={styles.investorDetail}>Investment capacity: ₹5L — ₹25L</div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>Current Best Offer</div>
              <div className={styles.dealAmount}>₹2,00,000</div>
              <div className={styles.dealEquity}>for 12% equity</div>
              <div className={styles.dealCountdown}>Expires in 18:24:06</div>
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className={styles.panelRight}>
            
            {!dealClosed ? (
              <>
                {/* OFFER THREAD */}
                <div className={styles.card}>
                  <div className={styles.threadHeader}>
                    <div className={styles.threadTitle}>Offer History</div>
                    <div className={styles.threadCount}>3 exchanges</div>
                  </div>

                  <div className={styles.offerStack}>
                    
                    {/* Offer 1 (You) */}
                    <div className={`${styles.offerMsg} ${styles.offerMsgYou}`}>
                      <div className={styles.offerMsgHeader}>
                        <div className={styles.offerSender}>
                          <div className={`${styles.offerAvatarSmall} ${styles.avatarYou}`}>RS</div>
                          <span className={styles.offerSenderName}>You · Rahul Sharma</span>
                        </div>
                        <span className={styles.offerTime}>Apr 10, 2025 · 2:34 PM</span>
                      </div>
                      <div className={`${styles.offerBodyVal} ${styles.valBlue}`}>₹1,50,000 for 10% equity</div>
                      <div className={styles.offerTermsText}>Standard terms, no board seat, 18-month lock-in</div>
                      <div className={styles.offerFooter}>
                        <span className={`${styles.offerTag} ${styles.tagGray}`}>Initial Offer</span>
                      </div>
                    </div>

                    {/* Offer 2 (Startup) */}
                    <div className={`${styles.offerMsg} ${styles.offerMsgFounder}`}>
                      <div className={styles.offerMsgHeader}>
                        <div className={styles.offerSender}>
                          <div className={`${styles.offerAvatarSmall} ${styles.avatarGH}`}>GH</div>
                          <span className={styles.offerSenderName}>GreenHarvest AI · Founder</span>
                        </div>
                        <span className={styles.offerTime}>Apr 11, 2025 · 9:15 AM</span>
                      </div>
                      <div className={`${styles.offerBodyVal} ${styles.valGold}`}>₹1,50,000 for 14% equity</div>
                      <div className={styles.offerTermsText}>Requesting board observer rights, 24-month lock-in</div>
                      <div className={styles.offerFooter}>
                        <span className={`${styles.offerTag} ${styles.tagAmber}`}>Counter Offer</span>
                      </div>
                    </div>

                    {/* Offer 3 (You Latest) */}
                    <div className={`${styles.offerMsg} ${styles.offerMsgLatest}`}>
                      <div className={styles.offerMsgHeader}>
                        <div className={styles.offerSender}>
                          <div className={`${styles.offerAvatarSmall} ${styles.avatarYou}`}>RS</div>
                          <span className={styles.offerSenderName}>You · Rahul Sharma</span>
                        </div>
                        <span className={styles.offerTime}>Apr 12, 2025 · 1:40 PM</span>
                      </div>
                      <div className={`${styles.offerBodyVal} ${styles.valBlue}`}>₹2,00,000 for 12% equity</div>
                      <div className={styles.offerTermsText}>No board seat, 18-month lock-in, pro-rata rights</div>
                      <div className={styles.offerFooter}>
                        <span className={`${styles.offerTag} ${styles.tagBlue}`}>Latest Offer</span>
                        <span className={styles.badgeAwaiting}>Awaiting Response</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* FORM */}
                <div className={styles.card}>
                  <div className={styles.threadTitle} style={{ marginBottom: '8px' }}>Make a Counter Offer</div>
                  
                  <div className={styles.formGrid}>
                    
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Offer Amount <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputPrefix}>₹</span>
                        <input 
                          type="text" 
                          className={`${styles.textInput} ${styles.inputWithPrefix} ${isAmountError ? styles.textInputError : ''}`}
                          placeholder="e.g. 200000"
                          value={offerAmount}
                          onChange={handleAmountChange}
                        />
                      </div>
                      {isAmountError && <span className={styles.errorText}>Minimum offer is ₹10,000</span>}
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Equity / Royalty Percentage <span>*</span></label>
                      <div className={styles.inputWrapper}>
                        <input 
                          type="number" 
                          step="0.1"
                          className={`${styles.textInput} ${styles.inputWithSuffix} ${isEqError ? styles.textInputError : ''}`}
                          placeholder="e.g. 12"
                          value={equityPct}
                          onChange={e => setEquityPct(e.target.value)}
                        />
                        <span className={styles.inputSuffix}>%</span>
                      </div>
                      {isEqError && <span className={styles.errorText}>Equity must be between 0.1% and 49%</span>}
                    </div>

                    <div className={`${styles.inputGroup} ${styles.formFieldFull}`}>
                      <label className={styles.inputLabel}>Offer Type <span>*</span></label>
                      <select 
                        className={styles.textInput}
                        value={offerType}
                        onChange={e => setOfferType(e.target.value)}
                      >
                        <option value="" disabled>Select offer type</option>
                        <option value="Equity stake">Equity stake</option>
                        <option value="Revenue royalty">Revenue royalty</option>
                        <option value="Convertible note">Convertible note</option>
                        <option value="SAFE agreement">SAFE agreement</option>
                      </select>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.formFieldFull}`}>
                      <label className={styles.inputLabel}>Terms & Conditions</label>
                      <textarea 
                        className={styles.textInput} 
                        rows={3} 
                        maxLength={500}
                        placeholder="Describe any specific terms, conditions, or requests... (e.g. board seat, lock-in period, pro-rata rights)"
                        value={terms}
                        onChange={e => setTerms(e.target.value)}
                      ></textarea>
                      <div className={styles.charCount}>{terms.length} / 500 characters</div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>This offer expires in <span>*</span></label>
                      <select className={styles.textInput} defaultValue="48 hours">
                        <option value="24 hours">24 hours</option>
                        <option value="48 hours">48 hours</option>
                        <option value="72 hours">72 hours</option>
                        <option value="1 week">1 week</option>
                      </select>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.formFieldFull}`}>
                      <label className={styles.inputLabel}>Additional Notes</label>
                      <textarea 
                        className={styles.textInput} 
                        rows={2} 
                        placeholder="Any message to the founder..."
                      ></textarea>
                    </div>

                  </div>

                  <div className={styles.formActions}>
                    <button className={styles.btnWithdraw}>Withdraw Current Offer</button>
                    <button className={styles.btnSend} disabled={!canSubmit}>Send Offer</button>
                  </div>
                </div>
              </>
            ) : (
              // DEAL CLOSED STATE
              <div className={styles.card}>
                <div className={styles.threadTitle} style={{ marginBottom: '24px' }}>Final Deal Terms</div>
                
                <div style={{ padding: '24px', background: '#F8F9FC', borderRadius: '8px', borderLeft: '4px solid #10B981', marginBottom: '24px' }}>
                  <div className={styles.dealAmount}>₹2,00,000</div>
                  <div className={styles.dealEquity}>for 12% equity</div>
                  <p style={{ color: '#4B5563', fontSize: '14px', marginTop: '12px' }}>
                    Agreed Terms: No board seat, 18-month lock-in, pro-rata rights
                  </p>
                </div>
                
                <div className={styles.successActions}>
                  <button className={styles.btnOutlineGold}>Download Agreement PDF</button>
                  <button className={styles.btnSolidBlue}>Proceed to Investment</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

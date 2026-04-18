"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBlockchainCampaign } from '@/lib/web3';
import { toast } from 'sonner';

export default function CreateXFundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    sector: '',
    stage: 'Seed',
    tagline: '',
    pitch: '',
    fundingGoal: '',
    minimumInvestment: '',
    endDate: '',
    location: '',
    fundingModel: 'XFund' as 'XFund' | 'XRaise',
    fundingType: 'Equity' as 'Equity' | 'Debt',
    equityOffered: '',
    interestRate: '',
    repaymentMonths: '',
    xrateReportId: ''
  });

  const fetchReports = (id: string) => {
    setReportsLoading(true);
    fetch(`/api/xrate?ownerId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReports(data.reports);
        }
        setReportsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setReportsLoading(false);
      });
  };

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
      fetchReports(storedId);
    } else {
      setReportsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.xrateReportId) {
      toast.error("Please select a verified XRate Report to link to this campaign.");
      return;
    }

    setLoading(true);

    try {
      let onChainCampaignId: number | undefined;
      
      // Only XFund campaigns need on-chain escrow at creation time.
      // XRaise campaigns are private negotiations — no escrow until a deal is accepted.
      if (formData.fundingModel === 'XFund') {
        // Calculate duration days based on endDate
        const end = new Date(formData.endDate);
        const now = new Date();
        const diffTime = Math.abs(end.getTime() - now.getTime());
        const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Convert INR goal to mock ETH string
        const goalAmount = Number(formData.fundingGoal);
        const mockEthGoal = (goalAmount / 250000).toFixed(6);

        // Trigger Web3 MetaMask interaction to create campaign permanently on-chain
        const web3Res = await createBlockchainCampaign(mockEthGoal, durationDays);
        
        if (!web3Res.success) {
          throw new Error(web3Res.error || "Failed resolving blockchain synchrony");
        }
        
        onChainCampaignId = web3Res.campaignId;
      }

      const payload = {
        ...formData,
        founderId: userId,
        fundingModel: formData.fundingModel,
        fundingGoal: Number(formData.fundingGoal),
        minimumInvestment: Number(formData.minimumInvestment),
        equityOffered: formData.fundingType === 'Equity' ? Number(formData.equityOffered) : undefined,
        interestRate: formData.fundingType === 'Debt' ? Number(formData.interestRate) : undefined,
        repaymentMonths: formData.fundingType === 'Debt' ? Number(formData.repaymentMonths) : undefined,
        endDate: new Date(formData.endDate),
        onChainCampaignId,
        xrateReportId: formData.xrateReportId
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${formData.fundingModel} campaign created successfully!`);
        router.push('/startup/dashboard');
      } else {
        toast.error(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create your XFund</h1>
          <p className={styles.subtitle}>Fill in the details to start raising funds from the crowd.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formGrid}>

          <div className={`${styles.inputGroup} ${styles.fieldFull}`}>
            <label className={styles.label}>Campaign Title</label>
            <input 
              name="title"
              className={styles.input} 
              placeholder="e.g. GreenHarvest AI Revolution" 
              required 
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div className={`${styles.inputGroup} ${styles.fieldFull}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className={styles.label}>Link Institutional XRate Report</label>
              <button 
                type="button" 
                className={styles.btnLink} 
                onClick={() => userId && fetchReports(userId)}
                style={{ fontSize: '11px' }}
              >
                ↻ Refresh List
              </button>
            </div>
            {reportsLoading ? (
              <div className={styles.reportLoader}>Scanning for reports...</div>
            ) : reports.length === 0 ? (
              <div className={styles.noReportsBox}>
                <p>No verified institutional analyses found. Every funding campaign requires a linked XRate report to be visible to investors.</p>
                <div style={{ marginTop: '12px' }}>
                  <Link href="/startup/xrate">
                    <button type="button" className={styles.btnPrimarySmall}>Generate XRate Report Now</button>
                  </Link>
                </div>
              </div>
            ) : (
              <select 
                name="xrateReportId"
                className={styles.input} 
                required 
                value={formData.xrateReportId}
                onChange={handleChange}
              >
                <option value="">Select a verified report...</option>
                {reports.map((r: any) => (
                  <option key={r._id} value={r._id}>
                    {r.startupName} - {new Date(r.createdAt).toLocaleDateString()} (Score: {r.overallScore})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Sector</label>
            <input 
              name="sector"
              className={styles.input} 
              placeholder="e.g. AgriTech" 
              required 
              value={formData.sector}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Stage</label>
            <select 
              name="stage"
              className={styles.input} 
              value={formData.stage}
              onChange={handleChange}
            >
              <option value="Pre-Seed">Pre-Seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
            </select>
          </div>

          <div className={`${styles.inputGroup} ${styles.fieldFull}`}>
            <label className={styles.label}>Tagline</label>
            <input 
              name="tagline"
              className={styles.input} 
              placeholder="A short punchy sentence about your startup" 
              required 
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fieldFull}`}>
            <label className={styles.label}>The Pitch</label>
            <textarea 
              name="pitch"
              className={`${styles.input} ${styles.textarea}`} 
              placeholder="Describe what you are building and why..." 
              required 
              value={formData.pitch}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fieldFull}`}>
            <label className={styles.label}>Goal Context (Funding Model)</label>
            <div className={styles.typeSelector}>
              <button 
                type="button" 
                className={`${styles.typeBtn} ${formData.fundingModel === 'XFund' ? styles.typeBtnActive : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, fundingModel: 'XFund' }))}
              >
                XFund (Crowdfunding)
              </button>
              <button 
                type="button" 
                className={`${styles.typeBtn} ${formData.fundingModel === 'XRaise' ? styles.typeBtnActive : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, fundingModel: 'XRaise' }))}
              >
                XRaise (One-to-One Bidding)
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Funding Goal (₹)</label>
            <input 
              name="fundingGoal"
              type="number" 
              className={styles.input} 
              placeholder={formData.fundingModel === 'XRaise' ? "e.g. 1000000 (Target)" : "e.g. 1500000"} 
              required 
              value={formData.fundingGoal}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Min Investment (₹)</label>
            <input 
              name="minimumInvestment"
              type="number" 
              className={styles.input} 
              placeholder="e.g. 5000" 
              required 
              value={formData.minimumInvestment}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fieldFull}`}>
            <label className={styles.label}>Funding Type</label>
            <div className={styles.typeSelector}>
              <button 
                type="button" 
                className={`${styles.typeBtn} ${formData.fundingType === 'Equity' ? styles.typeBtnActive : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, fundingType: 'Equity' }))}
              >
                Equity Stake
              </button>
              <button 
                type="button" 
                className={`${styles.typeBtn} ${formData.fundingType === 'Debt' ? styles.typeBtnActive : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, fundingType: 'Debt' }))}
              >
                Debt (Loan)
              </button>
            </div>
          </div>

          {formData.fundingType === 'Equity' ? (
            <div className={`${styles.inputGroup} ${styles.fieldFull}`}>
              <label className={styles.label}>Total Equity Offered (%)</label>
              <input 
                name="equityOffered"
                type="number" 
                step="0.1" 
                className={styles.input} 
                placeholder="e.g. 8" 
                required 
                value={formData.equityOffered}
                onChange={handleChange}
              />
            </div>
          ) : (
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Flat Return Percentage (%)</label>
                <input 
                  name="interestRate"
                  type="number" 
                  step="0.1" 
                  className={styles.input} 
                  placeholder="e.g. 12" 
                  required 
                  value={formData.interestRate}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Repayment Period (Months)</label>
                <input 
                  name="repaymentMonths"
                  type="number" 
                  className={styles.input} 
                  placeholder="e.g. 18" 
                  required 
                  value={formData.repaymentMonths}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Campaign End Date</label>
            <input 
              name="endDate"
              type="date" 
              className={styles.input} 
              required 
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Location</label>
            <input 
              name="location"
              className={styles.input} 
              placeholder="e.g. Mumbai, India" 
              required 
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={() => router.back()}>Cancel</button>
            <div className={styles.submitWrapper}>
              {!formData.xrateReportId && reports.length > 0 && <span className={styles.warningText}>Selection required</span>}
              <button 
                type="submit" 
                className={styles.btnPrimary} 
                disabled={loading || !formData.xrateReportId} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {loading ? 'Broadcasting to Ethereum...' : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                    Launch XFund
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

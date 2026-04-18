"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function CreateXFundPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
    repaymentMonths: ''
  });

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        founderId: userId,
        fundingModel: formData.fundingModel,
        fundingGoal: Number(formData.fundingGoal),
        minimumInvestment: Number(formData.minimumInvestment),
        equityOffered: formData.fundingType === 'Equity' ? Number(formData.equityOffered) : undefined,
        interestRate: formData.fundingType === 'Debt' ? Number(formData.interestRate) : undefined,
        repaymentMonths: formData.fundingType === 'Debt' ? Number(formData.repaymentMonths) : undefined,
        endDate: new Date(formData.endDate)
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        router.push('/startup/dashboard');
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
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
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Creating...' : 'Launch XFund'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function XrateFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    campaignId: '',
    overallScore: '',
    riskScore: '',
    growthScore: '',
    teamScore: '',
    marketScore: '',
    executiveSummary: '',
    riskFactors: '',
    growthIndicators: '',
    investmentRecommendations: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/xrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate XRate report');
      }

      setSuccess('XRate Report generated! Redirecting to report view...');
      
      // Navigate to the report page after a brief delay to show the success message
      setTimeout(() => {
        router.push(`/xrate-report/${data.data._id}`);
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Generate Xrate</h1>
        <p className={styles.subtitle}>Fill in the evaluation metrics to generate a comprehensive XRate Report</p>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Campaign Details</h2>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="campaignId">Campaign ID</label>
              <input
                type="text"
                id="campaignId"
                name="campaignId"
                value={formData.campaignId}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter associated Campaign ObjectId"
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Scoring Metrics (0-100)</h2>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="overallScore">Overall Score</label>
                <input
                  type="number"
                  id="overallScore"
                  name="overallScore"
                  min="0"
                  max="100"
                  value={formData.overallScore}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="riskScore">Risk Score</label>
                <input
                  type="number"
                  id="riskScore"
                  name="riskScore"
                  min="0"
                  max="100"
                  value={formData.riskScore}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="growthScore">Growth Score</label>
                <input
                  type="number"
                  id="growthScore"
                  name="growthScore"
                  min="0"
                  max="100"
                  value={formData.growthScore}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="teamScore">Team Score</label>
                <input
                  type="number"
                  id="teamScore"
                  name="teamScore"
                  min="0"
                  max="100"
                  value={formData.teamScore}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="marketScore">Market Score</label>
                <input
                  type="number"
                  id="marketScore"
                  name="marketScore"
                  min="0"
                  max="100"
                  value={formData.marketScore}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Detailed Analysis</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="executiveSummary">Executive Summary</label>
              <textarea
                id="executiveSummary"
                name="executiveSummary"
                value={formData.executiveSummary}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Provide a high-level summary of the analysis..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="riskFactors">Risk Factors</label>
              <textarea
                id="riskFactors"
                name="riskFactors"
                value={formData.riskFactors}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Enter each risk factor on a new line..."
              />
              <span className={styles.helpText}>Line breaks will separate items into a list.</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="growthIndicators">Growth Indicators</label>
              <textarea
                id="growthIndicators"
                name="growthIndicators"
                value={formData.growthIndicators}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Enter each growth indicator on a new line..."
              />
              <span className={styles.helpText}>Line breaks will separate items into a list.</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="investmentRecommendations">Investment Recommendations</label>
              <textarea
                id="investmentRecommendations"
                name="investmentRecommendations"
                value={formData.investmentRecommendations}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Final verdict and recommendations for investors..."
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Generating Report...' : 'Generate XRate Report'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function XrateFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    description: '',
    fundingGoal: '',
    keyFeatures: '',
    campaignId: ''
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

      setSuccess('AI Analysis Complete! XRate Report generated. Redirecting...');
      
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
        <h1 className={styles.title}>AI Xrate Generator</h1>
        <p className={styles.subtitle}>Our Gemini AI will analyze your startup details to generate a comprehensive XRate report and risk analysis.</p>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Startup Profile</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="startupName">Startup Name</label>
              <input
                type="text"
                id="startupName"
                name="startupName"
                value={formData.startupName}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. NexaGrid AI"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="industry">Industry / Sector</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. CleanTech / AI Distribution"
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Business Details</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">Elevator Pitch / Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Describe your startup, problem you solve, and your solution..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="keyFeatures">Key Features & Success Factors</label>
              <textarea
                id="keyFeatures"
                name="keyFeatures"
                value={formData.keyFeatures}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="What makes your startup unique? (USP, patents, team strength, etc.)"
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="fundingGoal">Funding Goal ($)</label>
                <input
                  type="text"
                  id="fundingGoal"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="e.g. 500,000"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="campaignId">Campaign ID (Optional)</label>
                <input
                  type="text"
                  id="campaignId"
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Associated Campaign ID"
                />
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'AI analyzing...' : 'Generate XRate with AI'}
          </button>
        </form>
      </div>
    </div>
  );
}

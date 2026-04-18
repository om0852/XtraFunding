'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './XRateContent.module.css';

// Dynamically import pdfjs only on the client
async function getPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + '\n';
  }

  return fullText;
}

export default function XRateContent() {
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
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await getPdfText(file);
      
      const response = await fetch('/api/xrate/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract data from PDF');
      }

      if (!result.found) {
        setError('No data could be extracted. Note: Old screenshot-based reports or PDFs without selectable text cannot be autofilled.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        ...result.data
      }));
      setSuccess('Form successfully autofilled from past report!');
    } catch (err: any) {
      console.error('PDF Parsing Error:', err);
      setError('Could not parse PDF. Please ensure it is a valid XRate report.');
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const ownerId = localStorage.getItem('userId');
      const response = await fetch('/api/xrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ownerId }),
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
        <h1 className={styles.title}>Xrate</h1>
        <p className={styles.subtitle}>Generate a professional institutional-grade analysis using Gemini 3 Flash.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.autofillContainer}>
          <div className={styles.autofillLabel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Autofill from Past XRate Report
          </div>
          <div className={styles.fileInputWrapper}>
            <button className={styles.fileInputBtn} type="button">
              {parsing ? 'Analyzing PDF...' : 'Choose PDF Report'}
            </button>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handlePdfUpload} 
              className={styles.fileInput}
              disabled={parsing}
            />
          </div>
          {parsing && <span className={styles.parsingText}>Gemini is extracting your data...</span>}
        </div>

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

          <button type="submit" className={styles.submitBtn} disabled={loading || parsing}>
            {loading ? 'AI analyzing...' : 'Generate Refined XRate'}
          </button>
        </form>
      </div>
    </div>
  );
}

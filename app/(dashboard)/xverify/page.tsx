'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function XverifyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [textData, setTextData] = useState({
    fullName: '',
    phone: '',
    companyName: '',
    registrationNumber: '',
    walletAddress: ''
  });

  const [files, setFiles] = useState<{
    aadhar: File | null;
    pan: File | null;
    companyLicense: File | null;
  }>({
    aadhar: null,
    pan: null,
    companyLicense: null,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!files.aadhar || !files.pan || !files.companyLicense) {
      setError('Please upload all three required documents.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('fullName', textData.fullName);
      formData.append('phone', textData.phone);
      formData.append('companyName', textData.companyName);
      formData.append('registrationNumber', textData.registrationNumber);
      formData.append('walletAddress', textData.walletAddress);
      formData.append('aadhar', files.aadhar);
      formData.append('pan', files.pan);
      formData.append('companyLicense', files.companyLicense);

      const response = await fetch('/api/xverify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload documents.');
      }

      setSuccess('Documents verified successfully! Your verification is now pending review.');
      setFiles({ aadhar: null, pan: null, companyLicense: null });
      setTextData({ fullName: '', phone: '', companyName: '', registrationNumber: '', walletAddress: '' });
      (document.getElementById('form-xverify') as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>XVerify</h1>
        <p className={styles.subtitle}>Complete your secure KYC to unlock transparent, blockchain-verified investing.</p>
      </div>

      <div className={styles.trustBanner}>
        <div className={styles.trustItem}>
          <svg className={styles.trustIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Bank-Grade Security
        </div>
        <div className={styles.trustItem}>
          <svg className={styles.trustIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          Blockchain Transparency
        </div>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form id="form-xverify" onSubmit={handleSubmit}>
          
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="fullName">Full Legal Name</label>
              <input type="text" id="fullName" name="fullName" required className={styles.inputField} placeholder="John Doe" value={textData.fullName} onChange={handleTextChange} disabled={loading} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required className={styles.inputField} placeholder="+91 9876543210" value={textData.phone} onChange={handleTextChange} disabled={loading} />
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Business Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="companyName">Company / Entity Name</label>
              <input type="text" id="companyName" name="companyName" required className={styles.inputField} placeholder="Acme Corp Ltd." value={textData.companyName} onChange={handleTextChange} disabled={loading} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="registrationNumber">Registration No. (CIN / GST)</label>
              <input type="text" id="registrationNumber" name="registrationNumber" required className={styles.inputField} placeholder="L12345MH2026PTC123456" value={textData.registrationNumber} onChange={handleTextChange} disabled={loading} />
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.label} htmlFor="walletAddress">Web3 Wallet Address (For Transparent Fund Allocation)</label>
              <input type="text" id="walletAddress" name="walletAddress" required className={styles.inputField} placeholder="0x..." value={textData.walletAddress} onChange={handleTextChange} disabled={loading} />
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Document Uploads</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Aadhar Card (PDF or Image)</label>
              <div className={`${styles.uploadBox} ${files.aadhar ? styles.uploadBoxActive : ''}`}>
                <input type="file" id="aadhar" accept=".pdf,image/png,image/jpeg,image/webp" className={styles.fileInputHidden} onChange={(e) => handleFileChange(e, 'aadhar')} disabled={loading} />
                <svg className={styles.uploadIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div className={styles.uploadText}>{files.aadhar ? 'Aadhar Selected' : 'Click or drag Aadhar here'}</div>
                <div className={styles.uploadSubtext}>Supports PDF, JPG, PNG up to 5MB</div>
                {files.aadhar && <div className={styles.fileName}>✓ {files.aadhar.name}</div>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>PAN Card</label>
              <div className={`${styles.uploadBox} ${files.pan ? styles.uploadBoxActive : ''}`}>
                <input type="file" id="pan" accept=".pdf,image/png,image/jpeg,image/webp" className={styles.fileInputHidden} onChange={(e) => handleFileChange(e, 'pan')} disabled={loading} />
                <svg className={styles.uploadIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div className={styles.uploadText}>{files.pan ? 'Selected' : 'Upload PAN'}</div>
                {files.pan && <div className={styles.fileName}>✓ {files.pan.name}</div>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Company License</label>
              <div className={`${styles.uploadBox} ${files.companyLicense ? styles.uploadBoxActive : ''}`}>
                <input type="file" id="companyLicense" accept=".pdf,image/png,image/jpeg,image/webp" className={styles.fileInputHidden} onChange={(e) => handleFileChange(e, 'companyLicense')} disabled={loading} />
                <svg className={styles.uploadIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div className={styles.uploadText}>{files.companyLicense ? 'Selected' : 'Upload License'}</div>
                {files.companyLicense && <div className={styles.fileName}>✓ {files.companyLicense.name}</div>}
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing Verification...' : 'Submit Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}

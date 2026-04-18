'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function XverifyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [files, setFiles] = useState<{
    aadhar: File | null;
    pan: File | null;
    companyLicense: File | null;
  }>({
    aadhar: null,
    pan: null,
    companyLicense: null,
  });

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
      // Reset file inputs manually
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
        <h1 className={styles.title}>Xverify</h1>
        <p className={styles.subtitle}>Upload your required documents for verification</p>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form id="form-xverify" onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="aadhar">
              Aadhar Card (PDF or Image)
            </label>
            <input
              type="file"
              id="aadhar"
              accept=".pdf,image/png,image/jpeg,image/webp"
              className={styles.fileInput}
              onChange={(e) => handleFileChange(e, 'aadhar')}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="pan">
              PAN Card (PDF or Image)
            </label>
            <input
              type="file"
              id="pan"
              accept=".pdf,image/png,image/jpeg,image/webp"
              className={styles.fileInput}
              onChange={(e) => handleFileChange(e, 'pan')}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="companyLicense">
              Company License (PDF or Image)
            </label>
            <input
              type="file"
              id="companyLicense"
              accept=".pdf,image/png,image/jpeg,image/webp"
              className={styles.fileInput}
              onChange={(e) => handleFileChange(e, 'companyLicense')}
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Uploading & Verifying...' : 'Submit Documents'}
          </button>
        </form>
      </div>
    </div>
  );
}

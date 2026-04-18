"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ProfileSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    expertise: '',
    network: '',
    personality: '',
    investmentFocus: ''
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/auth');
      return;
    }
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data.user);
          if (data.data.user.investorDetails) {
            setFormData({
              expertise: data.data.user.investorDetails.expertise || '',
              network: data.data.user.investorDetails.network || '',
              personality: data.data.user.investorDetails.personality || '',
              investmentFocus: data.data.user.investorDetails.investmentFocus || ''
            });
          }
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorDetails: formData
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/investor/ai-matcher');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <div className={styles.aiBadge}>AI POWERED</div>
          <h1 className={styles.title}>Strategic Profile Setup</h1>
          <p className={styles.subtitle}>Help Gemini understand your "Investor DNA" to find perfect strategic matches.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Expertise & Industry Knowledge</label>
            <input 
              type="text" 
              placeholder="e.g. Web3 Infrastructure, SaaS Scaling, D2C Marketing" 
              value={formData.expertise}
              onChange={e => setFormData({...formData, expertise: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Strategic Network</label>
            <input 
              type="text" 
              placeholder="e.g. Strong ties with US Retailers, access to hospital chains in EU" 
              value={formData.network}
              onChange={e => setFormData({...formData, network: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Investment Focus</label>
            <input 
              type="text" 
              placeholder="e.g. Early stage tech, sustainable energy, social impact" 
              value={formData.investmentFocus}
              onChange={e => setFormData({...formData, investmentFocus: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Describe your Investor Personality</label>
            <textarea 
              rows={4} 
              placeholder="Tell us about how you work with founders. Are you a hands-on mentor, a silent partner, an aggressive growth driver, or a steady operations optimizer?" 
              value={formData.personality}
              onChange={e => setFormData({...formData, personality: e.target.value})}
              required
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Optimizing Profile...' : 'Save & Explore Matches'}
          </button>
        </form>
      </div>
    </main>
  );
}

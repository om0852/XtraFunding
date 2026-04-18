"use client";

import React, { useState } from 'react';
import styles from './ComparisonModal.module.css';
import { useComparison } from '@/context/ComparisonContext';
import { toast } from 'sonner';

type Step = 'preferences' | 'loading' | 'results';

export default function ComparisonModal() {
  const { isComparisonOpen, setComparisonOpen, selectedDeals } = useComparison();
  const [step, setStep] = useState<Step>('preferences');
  const [results, setResults] = useState<any>(null);
  
  // Form state
  const [preferences, setPreferences] = useState({
    horizon: 'Long-term (5-10 yrs)',
    risk: 'Moderate',
    goal: 'Capital Appreciation',
    focus: ''
  });

  if (!isComparisonOpen) return null;

  const handleStartComparison = async () => {
    setStep('loading');
    
    try {
      const res = await fetch('/api/investor/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealIds: selectedDeals.map(s => s.id),
          preferences
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setResults(data.comparison);
        setStep('results');
      } else {
        toast.error(data.error || "Failed to generate comparison");
        setStep('preferences');
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setStep('preferences');
    }
  };

  const handleClose = () => {
    setComparisonOpen(false);
    setTimeout(() => {
      setStep('preferences');
      setResults(null);
    }, 300);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeIcon} onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {step === 'preferences' && (
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.aiBadge}>GEMINI ANALYST</div>
              <h2 className={styles.title}>Define your Deal Preferences</h2>
              <p className={styles.subtitle}>Our AI will match your preferences against the detailed XRate reports of your selected funding deals.</p>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Investment Horizon</label>
                <select 
                  value={preferences.horizon} 
                  onChange={(e) => setPreferences({...preferences, horizon: e.target.value})}
                >
                  <option>Short-term (1-3 yrs)</option>
                  <option>Medium-term (3-5 yrs)</option>
                  <option>Long-term (5-10 yrs)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Risk Tolerance</label>
                <div className={styles.radioGroup}>
                  {['Low', 'Moderate', 'High'].map(r => (
                    <button 
                      key={r}
                      className={preferences.risk === r ? styles.radioActive : ''}
                      onClick={() => setPreferences({...preferences, risk: r})}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Primary Goal</label>
                <select 
                  value={preferences.goal} 
                  onChange={(e) => setPreferences({...preferences, goal: e.target.value})}
                >
                  <option>Capital Appreciation</option>
                  <option>Regular Dividends</option>
                  <option>Strategic Synergy</option>
                  <option>Social/Environmental Impact</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Specific Focus (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. AI ethics, female founders, clean energy only..." 
                  value={preferences.focus}
                  onChange={(e) => setPreferences({...preferences, focus: e.target.value})}
                />
              </div>

              <button className={styles.primaryBtn} onClick={handleStartComparison}>
                Analyze Deals with Gemini
              </button>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <h3 className={styles.loadingTitle}>Gemini is cross-referencing XRate data...</h3>
            <p className={styles.loadingText}>Comparing growth indicators and risk vectors for {selectedDeals.length} funding deals.</p>
          </div>
        )}

        {step === 'results' && results && (
          <div className={styles.resultsContent}>
             <div className={styles.header}>
              <div className={styles.aiBadge}>COMPARISON RESULT</div>
              <h2 className={styles.title}>Your Strategic Match</h2>
            </div>

            <div className={styles.resultsGrid}>
              {results.deals? results.deals.map((s: any) => (
                <div key={s.id} className={`${styles.resultCard} ${s.recommendation === 'TOP_PICK' ? styles.recommendationCard : ''}`}>
                  {s.recommendation === 'TOP_PICK' && <div className={styles.winnerBadge}>RECOMMENDED DEAL</div>}
                  <div className={styles.resCardHeader}>
                    <h4>{s.name}</h4>
                    <div className={styles.suitabilityScore}>
                      <span className={styles.scoreVal}>{s.suitabilityScore}%</span>
                      <span className={styles.scoreLabel}>Match</span>
                    </div>
                  </div>
                  
                  <div className={styles.metricsRow}>
                    <div className={styles.miniMetric}>
                      <span className={styles.mmLabel}>XRate</span>
                      <span className={styles.mmVal}>{s.xrateScore}</span>
                    </div>
                    <div className={styles.miniMetric}>
                      <span className={styles.mmLabel}>Risk</span>
                      <span className={styles.mmVal}>{s.riskScore}</span>
                    </div>
                  </div>

                  <div className={styles.rationale}>
                    <h5>Why this deal?</h5>
                    <p>{s.suitabilityRationale}</p>
                  </div>

                  <div className={styles.prosCons}>
                    <div className={styles.pcSection}>
                      <h6>Key Advantage</h6>
                      <p>{s.keyAdvantage}</p>
                    </div>
                  </div>
                </div>
              )) : results.startups.map((s: any) => (
                <div key={s.id} className={`${styles.resultCard} ${s.recommendation === 'TOP_PICK' ? styles.recommendationCard : ''}`}>
                  {s.recommendation === 'TOP_PICK' && <div className={styles.winnerBadge}>RECOMMENDED DEAL</div>}
                  <div className={styles.resCardHeader}>
                    <h4>{s.name}</h4>
                    <div className={styles.suitabilityScore}>
                      <span className={styles.scoreVal}>{s.suitabilityScore}%</span>
                      <span className={styles.scoreLabel}>Match</span>
                    </div>
                  </div>
                  
                  <div className={styles.metricsRow}>
                    <div className={styles.miniMetric}>
                      <span className={styles.mmLabel}>XRate</span>
                      <span className={styles.mmVal}>{s.xrateScore}</span>
                    </div>
                    <div className={styles.miniMetric}>
                      <span className={styles.mmLabel}>Risk</span>
                      <span className={styles.mmVal}>{s.riskScore}</span>
                    </div>
                  </div>

                  <div className={styles.rationale}>
                    <h5>Why this deal?</h5>
                    <p>{s.suitabilityRationale}</p>
                  </div>

                  <div className={styles.prosCons}>
                    <div className={styles.pcSection}>
                      <h6>Key Advantage</h6>
                      <p>{s.keyAdvantage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.aiConclusion}>
              <h4>AI Analyst Conclusion</h4>
              <p>{results.overallConclusion}</p>
            </div>

            <button className={styles.outlineBtn} onClick={() => setStep('preferences')}>
              Adjust Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

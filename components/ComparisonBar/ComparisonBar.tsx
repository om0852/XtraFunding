"use client";

import React from 'react';
import styles from './ComparisonBar.module.css';
import { useComparison } from '@/context/ComparisonContext';

export default function ComparisonBar() {
  const { selectedDeals, removeDeal, clearSelection, setComparisonOpen } = useComparison();

  if (selectedDeals.length === 0) return null;

  return (
    <div className={styles.comparisonBarWrapper}>
      <div className={styles.comparisonBar}>
        <div className={styles.infoSection}>
          <div className={styles.countBadge}>{selectedDeals.length}</div>
          <span className={styles.label}>Funding deals selected to compare</span>
        </div>

        <div className={styles.startupsList}>
          {selectedDeals.map((deal) => (
            <div key={deal.id} className={styles.startupTag}>
              <span className={styles.tagName}>{deal.name}</span>
              <button 
                className={styles.removeBtn} 
                onClick={() => removeDeal(deal.id)}
                aria-label={`Remove ${deal.name}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.clearBtn} onClick={clearSelection}>Clear All</button>
          <button 
            className={styles.compareBtn} 
            disabled={selectedDeals.length < 2}
            onClick={() => setComparisonOpen(true)}
          >
            Compare Deals
          </button>
        </div>
      </div>
    </div>
  );
}

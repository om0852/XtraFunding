"use client";

import React, { useState, useEffect, Suspense } from 'react';
import styles from '@/app/(dashboard)/investor/dashboard/page.module.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useComparison } from '@/context/ComparisonContext';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialModel = (searchParams.get('model') as 'All' | 'XFund' | 'XRaise') || 'All';
  const initialSearch = searchParams.get('search') || '';
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'XFund' | 'XRaise'>(initialModel);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { selectedDeals, addDeal, removeDeal } = useComparison();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const model = searchParams.get('model') as 'All' | 'XFund' | 'XRaise';
    if (model) {
      setFilter(model);
    } else {
      setFilter('All');
    }
    
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesModel = filter === 'All' || c.fundingModel === filter;
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesModel && matchesSearch;
  });

  return (
    <div className={styles.content}>
      <header className={styles.sectionHeader} style={{ marginBottom: '40px', alignItems: 'center' }}>
        <div>
          <h1 className={styles.greeting} style={{ fontSize: '36px' }}>
            {filter === 'All' ? 'Discover Opportunities' : filter === 'XFund' ? 'Standard XFund' : 'XRaise Deals'}
          </h1>
          <p className={styles.subtext}>Filter by funding model to find the right deal for your portfolio.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '6px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          {['All', 'XFund', 'XRaise'].map((f) => (
            <button 
              key={f}
              onClick={() => {
                setFilter(f as any);
                if (searchQuery) setSearchQuery(''); // Clear search on tab switch for better UX
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                transition: 'all 0.2s',
                background: filter === f ? 'white' : 'transparent',
                color: filter === f ? '#0F172A' : '#64748B',
                boxShadow: filter === f ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {f === 'All' ? 'All Models' : f === 'XFund' ? 'Standard XFund' : 'XRaise Deals'}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className={styles.emptyMsg}>Syncing opportunities...</div>
      ) : (
        <div className={styles.startupGrid}>
          {filteredCampaigns.length === 0 ? (
            <div className={styles.emptyMsg}>
              {searchQuery 
                ? `No campaigns found matching "${searchQuery}".` 
                : `No campaigns found matching the "${filter}" criteria.`}
            </div>
          ) : (
            filteredCampaigns.map((camp: any) => (
              <div key={camp._id} className={styles.startupCard} style={camp.fundingModel === 'XRaise' ? { borderColor: '#F5A623', background: 'linear-gradient(to bottom right, #ffffff, #FFFDF9)' } : {}}>
                <div className={styles.cardTop}>
                  <div className={styles.startupName}>{camp.title}</div>
                  <div className={styles.typeBadgeSmall} style={camp.fundingModel === 'XRaise' ? { backgroundColor: '#FEF3C7', color: '#B45309' } : { backgroundColor: '#F0F9FF', color: '#0369A1' }}>
                    {camp.fundingModel}
                  </div>
                </div>
                <div className={styles.sectorTag}>{camp.sector} · {camp.location}</div>
                
                <div className={styles.cardBodyText}>{camp.tagline}</div>

                {camp.fundingModel === 'XFund' ? (
                  <>
                    <div className={styles.fundingBarContainer}>
                      <div className={styles.fundingBarFill} style={{ width: `${Math.min((camp.amountRaised / camp.fundingGoal) * 100, 100)}%` }}></div>
                    </div>
                    <div className={styles.fundingText}>
                      ₹{camp.amountRaised.toLocaleString()} / ₹{camp.fundingGoal.toLocaleString()}
                    </div>
                  </>
                ) : (
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '12px', color: '#B45309', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strategic Negotiation</p>
                  </div>
                )}
                
                <div className={styles.cardBottom}>
                  <span className={styles.minText}>
                    {camp.fundingModel === 'XFund' ? `Min ₹${camp.minimumInvestment.toLocaleString()}` : `Target ₹${camp.fundingGoal.toLocaleString()}`}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className={camp.fundingModel === 'XRaise' ? styles.btnSelectGold : styles.btnSelect}
                      onClick={() => {
                        const isSelected = selectedDeals.find(s => s.id === camp._id);
                        if (isSelected) removeDeal(camp._id);
                        else addDeal({ id: camp._id, name: camp.title });
                      }}
                    >
                      {selectedDeals.find(s => s.id === camp._id) ? 'Selected' : 'Select'}
                    </button>
                    <Link href={`/investor/${camp.fundingModel.toLowerCase()}${camp.fundingModel === 'XRaise' ? '/explore' : ''}/${camp._id}`}>
                      <button className={`${styles.btnInvest} ${camp.fundingModel === 'XRaise' ? styles.btnInvestGold : ''}`}>
                        {camp.fundingModel === 'XFund' ? 'Invest' : 'Explore'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className={styles.content}><div className={styles.emptyMsg}>Loading campaigns...</div></div>}>
      <ExploreContent />
    </Suspense>
  );
}

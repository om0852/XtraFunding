"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function AIMatcher() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("Please log in to see matches.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/investor/strategic-matches?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setMatches(data.matches);
        } else if (res.status === 404) {
            setError("PROFILE_NOT_SET");
        } else {
          setError(data.message || "Something went wrong.");
        }
      } catch (err) {
        setError("Failed to fetch matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loader}></div>
        <p>Gemini is analyzing your Strategic Edge against current startups...</p>
      </div>
    );
  }

  if (error === "PROFILE_NOT_SET") {
    return (
       <div className={styles.emptyState}>
        <div className={styles.aiBadge}>AI DISCOVERY</div>
        <h1>Profile Incomplete</h1>
        <p>Your strategic matches are based on your unique expertise and personality.</p>
        <Link href="/investor/profile-setup">
          <button className={styles.primaryBtn}>Set Up Profile</button>
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.aiBadge}>AI POWERED DISCOVERY</div>
        <h1 className={styles.title}>Strategic Opportunities</h1>
        <p className={styles.subtitle}>These startups aren't just good investments—they are companies where <strong>YOU</strong> are the missing catalyst for success.</p>
      </header>

      <div className={styles.matchGrid}>
        {matches.map((match, idx) => (
          <div key={idx} className={styles.matchCard}>
            <div className={styles.scoreBadge}>{match.impactScore}% Match</div>
            <div className={styles.cardHeader}>
              <h2 className={styles.startupName}>{match.campaign.title}</h2>
              <span className={styles.sectorTag}>{match.campaign.sector}</span>
            </div>
            
            <div className={styles.rationaleBox}>
              <h3>Your Strategic Edge</h3>
              <p>{match.strategicEdge}</p>
            </div>

            <div className={styles.detailsBox}>
              <h3>Synergy Rationale</h3>
              <p>{match.synergyRationale}</p>
            </div>

            <div className={styles.footer}>
              <div className={styles.recomAction}>
                <strong>Recommendation:</strong> {match.recommendedAction}
              </div>
              <Link href={`/investor/xraise/explore/${match.campaign._id}`}>
                <button className={styles.exploreBtn}>Open Deal Room</button>
              </Link>
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div className={styles.emptyMsg}>
            No perfect strategic matches found currently. Check back as new campaigns go live!
          </div>
        )}
      </div>
    </main>
  );
}

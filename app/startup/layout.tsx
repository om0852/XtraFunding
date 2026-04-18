"use client";

import React, { useState, useEffect } from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
          setUser(data.data);
        } else {
          localStorage.removeItem('userId');
          router.push('/auth');
        }
      })
      .catch(err => console.error("Error fetching user data:", err));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/auth');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
          </svg>
          XtraFunds
        </div>
        
        <nav className={styles.nav}>
          <Link href="/startup/dashboard" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className={styles.navIcon}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><path d="M22 12A10 10 0 0 0 12 2v20a10 10 0 0 0 10-10z"></path></svg>
            </span>
            My Campaign
          </Link>
          <Link href="/xrate-report" className={styles.navItem}>
            <span className={styles.navIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </span>
            XRate Report
            <span className={styles.badgeNew} style={{backgroundColor: '#F5A623'}}>New</span>
          </Link>
          <Link href="/startup/milestones" className={styles.navItem}>
            <span className={styles.navIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </span>
            Milestone Tracker
          </Link>
          <Link href="/xraise" className={styles.navItem}>
            <span className={styles.navIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
            </span>
            Offers Received
            <span className={styles.badge}>2</span>
          </Link>
          <Link href="/startup/funds" className={styles.navItem}>
            <span className={styles.navIcon}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            </span>
            Fund Usage
          </Link>
          <Link href="/startup/settings" className={styles.navItem}>
             <span className={styles.navIcon}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </span>
            Settings
          </Link>
        </nav>
        
        <div className={styles.sidebarBottom}>
          <div className={styles.avatar}>{user?.startupDetails?.companyName ? getInitials(user.startupDetails.companyName) : '...'}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.startupDetails?.companyName ? user.startupDetails.companyName : user?.name || 'Loading...'}</div>
            <div className={styles.userRole}>{user ? user.name : 'Startup Founder'}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </aside>

      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <div className={styles.pageTitle}>Dashboard</div>
          <div className={styles.topbarActions}>
            <button className={styles.iconBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button className={styles.iconBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className={styles.dot}></span>
            </button>
            <div className={styles.topAvatar}>
              {user?.startupDetails?.companyName ? getInitials(user.startupDetails.companyName) : <span style={{fontSize: '10px'}}>...</span>}
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

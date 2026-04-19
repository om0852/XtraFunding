"use client";

import React, { useState, useEffect } from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// ── Animation Variants ─────────────────────────────────────────────
const sidebarVariants = {
  hidden: { x: -260, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  }
};

const navContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.2 }
  }
};

const navItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  }
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  }
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.92, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -8,
    transition: { duration: 0.16, ease: 'easeIn' as const }
  }
};

const badgeVariants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 500, damping: 20 }
  }
};

const topbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.1 }
  }
};

const userInfoVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: 0.55 }
  }
};

// ── Nav Items Definition ───────────────────────────────────────────
const NAV_ITEMS = [
  {
    href: '/startup/dashboard',
    label: 'My Campaign',
    matchFn: (p: string) => p === '/startup/dashboard',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
        <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
      </svg>
    )
  },
  {
    href: '/feed',
    label: 'Feed',
    matchFn: (p: string) => p === '/feed',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/>
        <circle cx="5" cy="19" r="1"/>
      </svg>
    )
  },
  {
    href: '/startup/posts',
    label: 'My Posts',
    matchFn: (p: string) => p.includes('/posts'),
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    )
  },
  {
    href: '/startup/xverify',
    label: 'XVerify Docs',
    matchFn: (p: string) => p.includes('/xverify'),
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  {
    href: '/startup/xrate',
    label: 'XRate AI',
    matchFn: (p: string) => p.includes('/xrate'),
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
  },
  {
    href: '/startup/milestones',
    label: 'Milestone Tracker',
    matchFn: (p: string) => p.includes('/milestones'),
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    )
  },
  {
    href: '/startup/xraise',
    label: 'Offers Received',
    matchFn: (p: string) => p.includes('/xraise'),
    badge: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
    )
  },
  {
    href: '/startup/funds',
    label: 'Fund Usage',
    matchFn: (p: string) => p.includes('/funds'),
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
      </svg>
    )
  },
  {
    href: '/startup/settings',
    label: 'Settings',
    matchFn: (p: string) => p.includes('/settings'),
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )
  }
];

export default function StartupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [user, setUser] = useState<any>(null);
  const [offerCount, setOfferCount] = useState<number>(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/startup/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.data.user);
          } else {
            localStorage.removeItem('userId');
          }
        })
        .catch(err => console.error("Error fetching user data:", err));
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      const fetchOfferCount = async () => {
        try {
          const res = await fetch(`/api/negotiations?startupId=${user._id}`);
          const data = await res.json();
          if (data.success) {
            const pendingOffers = data.data.filter((neg: any) =>
              neg.status === 'Negotiating' &&
              neg.offers.length > 0 &&
              neg.offers[neg.offers.length - 1].sender === 'INVESTOR'
            );
            setOfferCount(pendingOffers.length);
          }
        } catch (err) {
          console.error("Error fetching offer count:", err);
        }
      };
      fetchOfferCount();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/auth');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const pageTitleMap: Record<string, string> = {
    '/startup/dashboard': 'Dashboard',
    '/startup/xverify': 'Verification',
    '/startup/xrate': 'AI Analysis',
    '/startup/xraise': 'Deal Room',
    '/startup/posts': 'My Posts',
    '/startup/funds': 'Fund Usage',
    '/startup/settings': 'Settings',
    '/startup/create-xfund': 'New Campaign',
    '/startup/milestones': 'Milestones',
  };

  const getPageTitle = () => {
    for (const [key, val] of Object.entries(pageTitleMap)) {
      if (pathname.includes(key.split('/').pop()!)) return val;
    }
    return 'Startup';
  };

  // Respect reduced motion preference
  const shouldAnimate = !prefersReducedMotion;

  return (
    <div className={styles.layoutContainer}>
      {/* Mobile sidebar overlay */}
      <div
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ── SIDEBAR ── */}
      <motion.aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        initial={shouldAnimate ? 'hidden' : 'visible'}
        animate="visible"
        variants={sidebarVariants}
      >
        {/* Logo */}
        <motion.div
          className={styles.logoContainer}
          variants={logoVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623" opacity="0.7"/>
          </svg>
          XtraFunds
        </motion.div>

        <div className={styles.logoSeparator} />

        {/* Nav links */}
        <motion.nav
          className={styles.nav}
          variants={navContainerVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.matchFn(pathname);
            return (
              <motion.div key={item.href} variants={navItemVariants}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                  <motion.span
                    className={styles.navIcon}
                    whileHover={shouldAnimate ? { scale: 1.15 } : {}}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {item.icon}
                  </motion.span>
                  {item.label}
                  {item.badge && offerCount > 0 && (
                    <motion.span
                      className={styles.badge}
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {offerCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* User info */}
        <motion.div
          className={styles.sidebarBottom}
          variants={userInfoVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
        >
          <div className={styles.avatar}>
            {user?.startupDetails?.companyName ? getInitials(user.startupDetails.companyName) : '…'}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {user?.startupDetails?.companyName || user?.name || 'Loading…'}
            </div>
            <div className={styles.userRole}>{user?.name || 'Startup Founder'}</div>
          </div>
          <motion.button
            className={styles.logoutBtn}
            onClick={handleLogout}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* ── MAIN WRAPPER ── */}
      <div className={styles.mainWrapper}>
        {/* Topbar */}
        <motion.header
          className={styles.topbar}
          variants={topbarVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
        >
          {/* Mobile menu toggle */}
          <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className={styles.pageTitle}>{getPageTitle()}</div>

          <form className={styles.searchContainer} onSubmit={handleSearch}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search campaigns, reports…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </form>

          <div className={styles.topbarActions}>
            <motion.button
              className={styles.iconBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className={styles.dot}/>
            </motion.button>

            <motion.div
              className={styles.topAvatar}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.startupDetails?.companyName
                ? getInitials(user.startupDetails.companyName)
                : <span style={{ fontSize: '10px' }}>…</span>}
            </motion.div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Backdrop to close */}
                  <motion.div
                    style={{
                      position: 'fixed', inset: 0, zIndex: 199
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div
                    className={styles.profileDropdown}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>
                        {user?.startupDetails?.companyName ? getInitials(user.startupDetails.companyName) : 'S'}
                      </div>
                      <div className={styles.dropdownUserInfo}>
                        <div className={styles.dropdownName}>
                          {user?.startupDetails?.companyName || user?.name || 'Startup Founder'}
                        </div>
                        <div className={styles.dropdownRole}>{user?.email || 'founder@startup.com'}</div>
                      </div>
                    </div>

                    <div className={styles.dropdownStats}>
                      <div className={styles.dropdownStat}>
                        <div className={styles.dropdownStatValue}>1</div>
                        <div className={styles.dropdownStatLabel}>Campaign</div>
                      </div>
                      <div className={styles.dropdownStat}>
                        <div className={styles.dropdownStatValue}>₹75K</div>
                        <div className={styles.dropdownStatLabel}>Raised</div>
                      </div>
                    </div>

                    <div className={styles.dropdownLinks}>
                      <Link href="/startup/settings" className={styles.dropdownLink} onClick={() => setIsProfileOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        Settings
                      </Link>
                      <Link href="/startup/dashboard" className={styles.dropdownLink} onClick={() => setIsProfileOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
                          <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
                        </svg>
                        My Campaign
                      </Link>
                      <Link href="/startup/funds" className={styles.dropdownLink} onClick={() => setIsProfileOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
                        </svg>
                        Fund Usage
                      </Link>
                      <button className={styles.dropdownLogout} onClick={handleLogout}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {children}
      </div>
    </div>
  );
}

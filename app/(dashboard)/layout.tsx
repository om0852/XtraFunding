"use client";

import React, { Suspense, useState, useEffect } from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ComparisonProvider } from '@/context/ComparisonContext';
import ComparisonBar from '@/components/ComparisonBar/ComparisonBar';
import ComparisonModal from '@/components/ComparisonModal/ComparisonModal';
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
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const navItemVariants = {
  hidden: { x: -18, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }
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
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.1 }
  }
};

// Inner component holds all useSearchParams() logic so it can be Suspense-wrapped
function InvestorLayoutInner({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentModel = searchParams.get('model');
  const prefersReduced = useReducedMotion();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [offerCount, setOfferCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/campaign?search=${encodeURIComponent(searchQuery.trim())}`);
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
          const res = await fetch(`/api/negotiations?investorId=${user._id}`);
          const data = await res.json();
          if (data.success) {
            // Count negotiations where the last offer sender was the startup and status is 'Negotiating'
            const pendingOffers = data.data.filter((neg: any) => 
              neg.status === 'Negotiating' && 
              neg.offers.length > 0 && 
              neg.offers[neg.offers.length - 1].sender === 'STARTUP'
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

  let pageTitle = "Dashboard";
  if (pathname.includes('/campaign')) {
    if (currentModel === 'XRaise') pageTitle = "XRaise Deals";
    else if (currentModel === 'XFund') pageTitle = "Standard XFund";
    else pageTitle = "Explore Startups";
  }
  else if (pathname.includes('/investor/investments')) pageTitle = "My Investments";
  else if (pathname.includes('/xraise')) pageTitle = "XRaise Offers";
  else if (pathname.includes('/investor/watchlist')) pageTitle = "Watchlist";
  else if (pathname.includes('/investor/reports')) pageTitle = "Reports";
  else if (pathname.includes('/investor/settings')) pageTitle = "Settings";

  // Close sidebar on nav
  const closeMobileSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.layoutContainer}>
      {/* Mobile sidebar overlay */}
      <div
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.overlayVisible : ''}`}
        onClick={closeMobileSidebar}
      />

      {/* ── SIDEBAR ──────────────────────────────── */}
      <motion.aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        variants={sidebarVariants}
        initial={prefersReduced ? 'visible' : 'hidden'}
        animate="visible"
      >
        <motion.div
          className={styles.logoContainer}
          variants={logoVariants}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
          </svg>
          XtraFunds
        </motion.div>
        
        <motion.nav
          className={styles.nav}
          variants={navContainerVariants}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
        >
          <motion.div variants={navItemVariants}>
            <Link href="/investor/dashboard" className={`${styles.navItem} ${pathname === '/investor/dashboard' ? styles.navItemActive : ''}`}>
              <motion.span
                className={styles.navIcon}
                whileHover={prefersReduced ? {} : { scale: 1.15 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              </motion.span>
              Dashboard
            </Link>
          </motion.div>
          
          <div style={{marginTop: '16px', marginBottom: '8px', fontSize: '10.5px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', padding: '0 14px', letterSpacing: '1px', textTransform: 'uppercase'}}>DISCOVER</div>
          
          <motion.div variants={navItemVariants}>
            <Link href="/campaign?model=XFund" className={`${styles.navItem} ${pathname === '/campaign' && currentModel !== 'XRaise' ? styles.navItemActive : ''}`}>
              <motion.span className={styles.navIcon} whileHover={prefersReduced ? {} : { scale: 1.15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </motion.span>
              XFund Standard
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link href="/campaign?model=XRaise" className={`${styles.navItem} ${(pathname === '/campaign' && currentModel === 'XRaise') || pathname.includes('/xraise/explore') ? styles.navItemActive : ''}`}>
              <motion.span className={styles.navIcon} whileHover={prefersReduced ? {} : { scale: 1.15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="m2 12 5-3 5 3-5 3-5-3Z"/><path d="m12 12 5-3 5 3-5 3-5-3Z"/></svg>
              </motion.span>
              XRaise Bidding
            </Link>
          </motion.div>

          <div style={{marginTop: '16px', marginBottom: '8px', fontSize: '10.5px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', padding: '0 14px', letterSpacing: '1px', textTransform: 'uppercase'}}>MY PORTFOLIO</div>

          <motion.div variants={navItemVariants}>
            <Link href="/investor/investments" className={`${styles.navItem} ${pathname.includes('/investor/investments') ? styles.navItemActive : ''}`}>
              <motion.span className={styles.navIcon} whileHover={prefersReduced ? {} : { scale: 1.15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              </motion.span>
              My Investments
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link href="/investor/xraise" className={`${styles.navItem} ${pathname === '/investor/xraise' ? styles.navItemActive : ''}`}>
              <motion.span className={styles.navIcon} whileHover={prefersReduced ? {} : { scale: 1.15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </motion.span>
              Active Deal Rooms
              <AnimatePresence>
                {offerCount > 0 && (
                  <motion.span
                    className={styles.badge}
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit={{ scale: 0, transition: { duration: 0.15 } }}
                    key="badge"
                  >
                    {offerCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link href="/investor/watchlist" className={`${styles.navItem} ${pathname.includes('/investor/watchlist') ? styles.navItemActive : ''}`}>
              <motion.span className={styles.navIcon} whileHover={prefersReduced ? {} : { scale: 1.15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </motion.span>
              Watchlist
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link href="/investor/reports" className={`${styles.navItem} ${pathname.includes('/investor/reports') ? styles.navItemActive : ''}`}>
              <motion.span className={styles.navIcon} whileHover={prefersReduced ? {} : { scale: 1.15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="8" y1="18" x2="8" y2="15"/><line x1="16" y1="18" x2="16" y2="14"/></svg>
              </motion.span>
              Reports
            </Link>
          </motion.div>

          <motion.div variants={navItemVariants}>
            <Link href="/investor/settings" className={`${styles.navItem} ${pathname.includes('/investor/settings') ? styles.navItemActive : ''}`}>
              <motion.span className={styles.navIcon} whileHover={prefersReduced ? {} : { scale: 1.15 }}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </motion.span>
              Settings
            </Link>
          </motion.div>
        </motion.nav>
        
        <motion.div
          className={styles.sidebarBottom}
          initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const, delay: 0.5 }}
        >
          <div className={styles.avatar}>{user ? getInitials(user.name) : '...'}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user ? user.name : 'Loading...'}</div>
            <div className={styles.userRole}>Investor</div>
          </div>
          <motion.button
            className={styles.logoutBtn}
            onClick={handleLogout}
            whileHover={prefersReduced ? {} : { scale: 1.1 }}
            whileTap={prefersReduced ? {} : { scale: 0.9 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <div className={styles.mainWrapper}>
        <motion.header
          className={styles.topbar}
          variants={topbarVariants}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
        >
          {/* Mobile menu toggle */}
          <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className={styles.pageTitle}>{pageTitle}</div>
          
          {pathname.includes('/investor') || pathname.includes('/campaign') ? (
            <form className={styles.searchContainer} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search startups, sectors, technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </form>
          ) : <div></div>}

          <div className={styles.topbarActions}>
            <motion.button
              className={styles.iconBtn}
              whileHover={prefersReduced ? {} : { scale: 1.08 }}
              whileTap={prefersReduced ? {} : { scale: 0.92 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className={styles.dot}></span>
            </motion.button>

            <motion.div
              className={styles.topAvatar}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={prefersReduced ? {} : { scale: 1.06 }}
              whileTap={prefersReduced ? {} : { scale: 0.94 }}
            >
              {user ? getInitials(user.name) : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
            </motion.div>
            
            {/* PROFILE DROPDOWN */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className={styles.profileBackdrop} onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    className={styles.profileDropdown}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>{user ? getInitials(user.name) : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}</div>
                      <div className={styles.dropdownUserInfo}>
                        <div className={styles.dropdownName}>{user ? user.name : 'Guest User'}</div>
                        <div className={styles.dropdownRole}>{user ? user.email : 'guest@xtrafunds.com'}</div>
                      </div>
                    </div>
                    
                    <div className={styles.dropdownStats}>
                      <div className={styles.dropdownStat}>
                        <div className={styles.dropdownStatValue}>₹1,25,000</div>
                        <div className={styles.dropdownStatLabel}>Invested</div>
                      </div>
                      <div className={styles.dropdownStat}>
                        <div className={styles.dropdownStatValue}>4</div>
                        <div className={styles.dropdownStatLabel}>Startups</div>
                      </div>
                    </div>
                    
                    <div className={styles.dropdownLinks}>
                      <Link href="/investor/settings" className={styles.dropdownLink} onClick={() => setIsProfileOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Account Settings
                      </Link>
                      <Link href="/investor/investments" className={styles.dropdownLink} onClick={() => setIsProfileOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        My Portfolio
                      </Link>
                      <Link href="/investor/reports" className={styles.dropdownLink} onClick={() => setIsProfileOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        Tax Reports
                      </Link>
                      <button className={styles.dropdownLogout} onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        <ComparisonProvider>
          {children}
          <ComparisonBar />
          <ComparisonModal />
        </ComparisonProvider>
      </div>
    </div>
  );
}

// Outer shell — just wraps InvestorLayoutInner in Suspense so that
// useSearchParams() inside it is always within a Suspense boundary.
export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <InvestorLayoutInner>{children}</InvestorLayoutInner>
    </Suspense>
  );
}

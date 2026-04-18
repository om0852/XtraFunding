"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function LandingPage() {
  const [activeFeatureModal, setActiveFeatureModal] = useState<string | null>(null);

  const featureDetails: Record<string, { title: string, desc: string, action: string, link: string, highlights?: string[], flowchart?: { title: string, steps: string[] } }> = {
    'XFund': {
      title: 'XFund Access',
      desc: 'XtraFunds is a secure platform that connects investors directly with verified startups. Rather than handing over all capital upfront, your investment is held in a smart escrow account and released in phases—only when the startup successfully completes predefined business milestones.',
      highlights: ['Milestone-based release', 'Smart Escrow Contracts', 'Zero upfront fees', 'Live Portfolio Tracking'],
      flowchart: {
        title: 'How XFund Works',
        steps: ['You pledge capital to a promising startup campaign', 'Your funds are locked securely in our Smart Escrow', 'The startup hits their predefined growth milestones', 'Capital is automatically released to the founder']
      },
      action: 'Explore Campaigns',
      link: '/campaign'
    },
    'XRate': {
      title: 'XRate AI Scoring',
      desc: 'Investing in startups is risky, so we built an AI to help you evaluate them. XRate analyzes a startup’s market fit, founder background, and financial health to generate a straightforward credibility score from 1 to 100, helping you invest with complete confidence.',
      highlights: ['Proprietary AI Algorithm', 'Deep Market Analysis', 'Founder Background Checks', 'Financial Health Score'],
      flowchart: {
        title: 'The XRate Process',
        steps: ['Our AI engine analyzes the startup pitch deck and financials', 'Market data and founder histories are cross-referenced', 'A detailed XRate Score (1-100) and Risk Profile is generated', 'You review the clear, actionable report before investing']
      },
      action: 'View AI Reports',
      link: '/xrate'
    },
    'XRaise': {
      title: 'XRaise Negotiations',
      desc: 'Skip the middlemen. XRaise allows investors and founders to negotiate equity and valuations directly. Make offers, issue counter-offers, and finalize deals instantly with our auto-generated, legally binding term sheets.',
      highlights: ['Direct 1-on-1 Negotiations', 'Custom Equity Offers', 'Auto-generated Term Sheets', 'No Intermediary Brokers'],
      flowchart: {
        title: 'Deal Negotiation Flow',
        steps: ['You send a custom valuation and equity offer to the founder', 'The founder reviews and issues a counter-offer', 'Both parties agree on the final terms and equity split', 'The platform instantly generates a legally binding Term Sheet']
      },
      action: 'Start Negotiating',
      link: '/xraise'
    },
    'Pricing': {
      title: 'Transparent Pricing',
      desc: 'We believe in complete financial transparency with absolutely no hidden fees. We only make money when you succeed. Startups pay a 2% fee on successful fundraises, and investors pay a 1% transaction fee.',
      highlights: ['Flat 2% Success Fee', '1% Investor Fee', 'Zero Listing Fees', 'Free XRate AI Scans'],
      flowchart: {
        title: 'Fee Structure Breakdown',
        steps: ['Startups create campaigns and list for free', 'Investors pledge capital without upfront charges', 'Upon a successful fundraise, a 2% fee is deducted', 'Net funds are securely transferred to the startup']
      },
      action: 'View Pricing Details',
      link: '#'
    },
    'About': {
      title: 'About XtraFunds',
      desc: 'We are on a global mission to democratize startup investing. By combining cutting-edge AI analysis with blockchain-level transparency, we make it vastly safer and more accessible for angel investors and syndicates to fund the next generation of game-changing unicorns.',
      action: 'Read Our Story',
      link: '#'
    },
    'Blog': {
      title: 'XtraFunds Blog',
      desc: 'Stay informed and updated with the latest macroeconomic trends in angel investing, rapid startup growth strategies, success stories from our platform, and major feature updates straight from our team of industry experts and analysts.',
      action: 'Read Latest Articles',
      link: '#'
    },
    'Careers': {
      title: 'Join Our Team',
      desc: 'Help us aggressively build the future of decentralized finance. We are constantly looking for passionate software engineers, creative product designers, and brilliant finance professionals to join our remote-first, globally distributed team.',
      action: 'View Open Positions',
      link: '#'
    },
    'Press': {
      title: 'Press & Media',
      desc: 'Download our comprehensive media kit, read our latest press releases regarding funding milestones, and find direct contact information for all media, PR, and journalism inquiries.',
      action: 'View Media Kit',
      link: '#'
    },
    'Privacy Policy': {
      title: 'Privacy Policy',
      desc: 'Your data security and privacy is our absolute top priority. Read exactly how we collect, securely encrypt, use, and protect your personal and financial information in strict compliance with GDPR, DPDP, and international privacy laws.',
      action: 'Read Privacy Policy',
      link: '#'
    },
    'Terms': {
      title: 'Terms of Service',
      desc: 'Review the comprehensive rules, guidelines, and legal agreements for using the XtraFunds platform. This includes detailed investor accreditation requirements, KYC prerequisites, and strict founder obligations.',
      action: 'Read Terms',
      link: '#'
    },
    'Compliance': {
      title: 'Regulatory Compliance',
      desc: 'We operate strictly within the legal bounds of SEBI and other premier financial regulatory bodies. All KYC/AML checks are completely automated, heavily encrypted, and securely verified in real-time through our government-backed third-party partners.',
      action: 'View Compliance Details',
      link: '#'
    }
  };

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
          </svg>
          XtraFunds
        </div>
        <div className={styles.navLinks}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Home</button>
          <button onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Explore</button>
          <button onClick={() => document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' })} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>How to Use</button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>About</button>
        </div>
        <div className={styles.navActions}>
          <Link href="/auth"><button className={styles.btnLogin}>Login</button></Link>
          <Link href="/auth"><button className={styles.btnGetStarted}>Get Started</button></Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.heroWrapper}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>✨ The Future of Startup Funding</div>
            <h1 className={styles.heroHeading}>Invest in Tomorrow's Startups — <span className={styles.heroHighlight}>Transparently</span></h1>
            <p className={styles.heroSubheading}>
              XtraFunds connects verified startups with smart investors through transparent fund tracking, AI-powered ratings, and milestone-based releases.
            </p>
            <div className={styles.heroActions}>
              <Link href="/campaign"><button className={styles.btnStartInvesting}>Start Investing</button></Link>
              <Link href="/xverify"><button className={styles.btnListStartup}>List Your Startup</button></Link>
            </div>
            <div className={styles.heroTrustContainer}>
              <p className={styles.heroTrust}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.9999 16.8284L6.05018 11.8787L7.46439 10.4645L10.9999 14L17.3639 7.63604L18.7781 9.05025L10.9999 16.8284Z" fill="#F5A623"/></svg>
                No hidden fees · Blockchain-verified · SEBI compliant
              </p>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <div className={styles.heroImageWrapper}>
              <div className={styles.cssDashboardMockup}>
                <div className={styles.mockupHeader}>
                  <div className={styles.mockupDots}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <div className={styles.mockupBody}>
                  <div className={styles.mockupSidebar}>
                    <div className={styles.mockupSidebarItem}></div>
                    <div className={styles.mockupSidebarItem}></div>
                    <div className={styles.mockupSidebarItem}></div>
                  </div>
                  <div className={styles.mockupMain}>
                    <div className={styles.mockupChart}>
                      <div className={styles.bar1}></div>
                      <div className={styles.bar2}></div>
                      <div className={styles.bar3}></div>
                      <div className={styles.bar4}></div>
                      <div className={styles.bar5}></div>
                    </div>
                    <div className={styles.mockupGrid}>
                      <div className={styles.mockupCard}></div>
                      <div className={styles.mockupCard}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.heroImageCard}>
                <div className={styles.heroImageCardIcon}>📈</div>
                <div className={styles.heroImageCardText}>
                  <div className={styles.heroCardStat}><strong>+320%</strong> <span className={styles.heroCardRoi}>ROI</span></div>
                  <p className={styles.heroCardLabel}>Top performing fund</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="explore" className={styles.features}>
        <div className={styles.featuresLabel}>PLATFORM FEATURES</div>
        <h2 className={styles.featuresHeading}>Everything you need to invest with confidence</h2>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Crowdfunding Analytics" className={styles.featureImage} />
            </div>
            <div className={styles.featureCardContent}>
              <div className={`${styles.featureIcon} ${styles.iconCrowd}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z" fill="currentColor"/>
                  <path d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z" fill="currentColor"/>
                  <path d="M12 14C9.33333 14 4 15.3333 4 18V20H20V18C20 15.3333 14.6667 14 12 14Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>XFund Access</h3>
              <p className={styles.featureDesc}>Crowdfund your startup or invest in multiple campaigns. Milestone-based fund release ensures accountability at every step.</p>
              <div className={`${styles.featureTag} ${styles.tagBlue}`}>Crowdfunding</div>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=800" alt="AI Scoring Dashboard" className={styles.featureImage} />
            </div>
            <div className={styles.featureCardContent}>
              <div className={`${styles.featureIcon} ${styles.iconStar}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>XRate AI Scoring</h3>
              <p className={styles.featureDesc}>AI-powered startup credibility scoring. Get a full risk, growth, and market analysis report before you invest a single rupee.</p>
              <div className={`${styles.featureTag} ${styles.tagGold}`}>AI Scoring</div>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureImageContainer}>
              <img src="https://images.pexels.com/photos/327540/pexels-photo-327540.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Negotiation and Contracts" className={styles.featureImage} />
            </div>
            <div className={styles.featureCardContent}>
              <div className={`${styles.featureIcon} ${styles.iconHandshake}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10V14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14V10L12 6L8 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>XRaise Negotiations</h3>
              <p className={styles.featureDesc}>One-on-one negotiation between investor and founder. Make offers, counter-offers, and close deals safely on your terms.</p>
              <div className={`${styles.featureTag} ${styles.tagBlue}`}>Negotiation</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className={styles.statsWrapper}>
        <div className={styles.statsOverlay}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>₹2.4Cr+</div>
              <div className={styles.statLabel}>Total Invested</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>142</div>
              <div className={styles.statLabel}>Startups Listed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumberGold}>89%</div>
              <div className={styles.statLabel}>Milestone Success</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1,200+</div>
              <div className={styles.statLabel}>Active Investors</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-to-use" className={styles.howItWorks}>
        <div className={styles.howHeader}>
          <h2 className={styles.howHeading}>How XtraFunds works</h2>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.tabActive}`}>For Investors</button>
            <button className={`${styles.tab} ${styles.tabInactive}`}>For Startups</button>
          </div>
        </div>
        
        <div className={styles.howContent}>
          <div className={styles.timelineVertical}>
            <div className={styles.timelineVerticalLine}></div>
            <div className={styles.stepVertical}>
              <div className={styles.stepCircle}>1</div>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>Create Account</h3>
                <p className={styles.stepDesc}>Sign up and complete KYC verification with our bank-grade security system.</p>
              </div>
            </div>
            <div className={styles.stepVertical}>
              <div className={styles.stepCircle}>2</div>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>Explore Startups</h3>
                <p className={styles.stepDesc}>Browse AI-rated campaigns with full transparency and detailed market analysis reports.</p>
              </div>
            </div>
            <div className={styles.stepVertical}>
              <div className={styles.stepCircle}>3</div>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>Invest Securely</h3>
                <p className={styles.stepDesc}>Pledge funds safely held in escrow using our verified blockchain architecture.</p>
              </div>
            </div>
            <div className={styles.stepVertical}>
              <div className={styles.stepCircle}>4</div>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>Track Returns</h3>
                <p className={styles.stepDesc}>Monitor progress and receive automated milestone-based updates right on your dashboard.</p>
              </div>
            </div>
          </div>
          <div className={styles.howImageContainer}>
            <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Analytics Dashboard" className={styles.howImage} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={`${styles.footerCol} ${styles.footerLogoCol}`}>
            <div className={styles.footerLogo}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
                <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
              </svg>
              XtraFunds
            </div>
            <p className={styles.footerLink} style={{maxWidth: '250px', lineHeight: '1.6'}}>Empowering the next generation of startups with intelligent, transparent funding solutions.</p>
          </div>
          
          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Product</div>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('XFund')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>XFund</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('XRate')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>XRate</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('XRaise')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>XRaise</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('Pricing')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Pricing</button>
          </div>
          
          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Company</div>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('About')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>About</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('Blog')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Blog</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('Careers')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Careers</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('Press')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Press</button>
          </div>
          
          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Legal</div>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('Privacy Policy')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Privacy Policy</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('Terms')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Terms</button>
            <button className={styles.footerLink} onClick={() => setActiveFeatureModal('Compliance')} style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Compliance</button>
          </div>
          
          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Connect</div>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.06 20.45H3.56V9h3.5v11.45zM5.31 7.44c-1.12 0-2.03-.91-2.03-2.03S4.19 3.38 5.31 3.38c1.12 0 2.03.91 2.03 2.03s-.91 2.03-2.03 2.03zM20.45 20.45h-3.5v-5.59c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.69h-3.5V9h3.36v1.56h.05c.47-.89 1.62-1.83 3.33-1.83 3.56 0 4.22 2.34 4.22 5.39v6.33z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.073-4.947-.197-4.354-2.62-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © 2026 XtraFunds. All rights reserved.
        </div>
      </footer>

      {/* FEATURE MODAL */}
      {activeFeatureModal && featureDetails[activeFeatureModal] && (
        <div className={styles.modalOverlay} onClick={() => setActiveFeatureModal(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setActiveFeatureModal(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h3 className={styles.modalTitle}>{featureDetails[activeFeatureModal].title}</h3>
            <p className={styles.modalDesc}>{featureDetails[activeFeatureModal].desc}</p>
            
            {featureDetails[activeFeatureModal].highlights && (
              <div className={styles.modalHighlights}>
                {featureDetails[activeFeatureModal].highlights.map((highlight, idx) => (
                  <div key={idx} className={styles.modalHighlightItem}>
                    <svg className={styles.modalHighlightIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {highlight}
                  </div>
                ))}
              </div>
            )}
            
            {featureDetails[activeFeatureModal].flowchart && (
              <div className={styles.modalFlowchart}>
                <div className={styles.modalFlowTitle}>{featureDetails[activeFeatureModal].flowchart.title}</div>
                {featureDetails[activeFeatureModal].flowchart.steps.map((step, idx) => (
                  <div key={`step-${idx}`} className={styles.flowStep}>
                    <div className={styles.flowStepNumber}>{idx + 1}</div>
                    <div className={styles.flowStepText}>{step}</div>
                  </div>
                ))}
              </div>
            )}
            
            <Link href={featureDetails[activeFeatureModal].link} className={styles.modalAction} onClick={() => setActiveFeatureModal(null)}>
              {featureDetails[activeFeatureModal].action}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

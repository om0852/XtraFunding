import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function LandingPage() {
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
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/auth" className={styles.navLink}>Explore</Link>
          <Link href="#" className={styles.navLink}>How it Works</Link>
          <Link href="#" className={styles.navLink}>About</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/auth"><button className={styles.btnLogin}>Login</button></Link>
          <Link href="/auth"><button className={styles.btnGetStarted}>Get Started</button></Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <h1 className={styles.heroHeading}>Invest in Tomorrow's Startups — Transparently</h1>
        <p className={styles.heroSubheading}>
          XFund connects verified startups with smart investors through transparent fund tracking, AI-powered ratings, and milestone-based releases.
        </p>
        <div className={styles.heroActions}>
          <Link href="/auth"><button className={styles.btnStartInvesting}>Start Investing</button></Link>
          <Link href="/auth"><button className={styles.btnListStartup}>List Your Startup</button></Link>
        </div>
        <p className={styles.heroTrust}>No hidden fees · Blockchain-verified · SEBI compliant</p>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.features}>
        <div className={styles.featuresLabel}>PLATFORM FEATURES</div>
        <h2 className={styles.featuresHeading}>Everything you need to invest with confidence</h2>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.iconCrowd}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z" fill="currentColor"/>
                <path d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z" fill="currentColor"/>
                <path d="M12 14C9.33333 14 4 15.3333 4 18V20H20V18C20 15.3333 14.6667 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>XFund</h3>
            <p className={styles.featureDesc}>Crowdfund your startup or invest in multiple campaigns. Milestone-based fund release ensures accountability at every step.</p>
            <div className={`${styles.featureTag} ${styles.tagBlue}`}>Crowdfunding</div>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.iconStar}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>XRate</h3>
            <p className={styles.featureDesc}>AI-powered startup credibility scoring. Get a full risk, growth, and market analysis report before you invest a single rupee.</p>
            <div className={`${styles.featureTag} ${styles.tagGold}`}>AI Scoring</div>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.iconHandshake}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10V14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14V10L12 6L8 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>XRaise</h3>
            <p className={styles.featureDesc}>One-on-one negotiation between investor and founder. Make offers, counter-offers, and close deals on your terms.</p>
            <div className={`${styles.featureTag} ${styles.tagBlue}`}>Negotiation</div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className={styles.stats}>
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
            <div className={styles.statLabel}>Milestone Success Rate</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1,200+</div>
            <div className={styles.statLabel}>Active Investors</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howItWorks}>
        <h2 className={styles.howHeading}>How XFund works</h2>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>For Investors</button>
          <button className={`${styles.tab} ${styles.tabInactive}`}>For Startups</button>
        </div>
        
        <div className={styles.timeline}>
          <div className={styles.timelineLine}></div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>1</div>
            <h3 className={styles.stepTitle}>Create Account</h3>
            <p className={styles.stepDesc}>Sign up and complete KYC verification</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>2</div>
            <h3 className={styles.stepTitle}>Explore Startups</h3>
            <p className={styles.stepDesc}>Browse AI-rated campaigns with full transparency</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>3</div>
            <h3 className={styles.stepTitle}>Invest Securely</h3>
            <p className={styles.stepDesc}>Pledge funds held in escrow until milestones are met</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepCircle}>4</div>
            <h3 className={styles.stepTitle}>Track Returns</h3>
            <p className={styles.stepDesc}>Monitor progress and receive milestone-based updates</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
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
            <a href="#" className={styles.footerLink}>XFund</a>
            <a href="#" className={styles.footerLink}>XRate</a>
            <a href="#" className={styles.footerLink}>XRaise</a>
            <a href="#" className={styles.footerLink}>Pricing</a>
          </div>
          
          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Company</div>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Blog</a>
            <a href="#" className={styles.footerLink}>Careers</a>
            <a href="#" className={styles.footerLink}>Press</a>
          </div>
          
          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Legal</div>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Terms</a>
            <a href="#" className={styles.footerLink}>Compliance</a>
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
          © 2025 XFund. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

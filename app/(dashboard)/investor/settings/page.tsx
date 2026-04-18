"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>Manage your account, preferences, and security settings.</p>
      </div>

      <div className={styles.settingsLayout}>
        {/* TABS */}
        <div className={styles.tabsContainer}>
          {['Profile', 'Preferences', 'Notifications', 'Security & KYC'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className={styles.card}>
          
          {/* PROFILE TAB */}
          {activeTab === 'Profile' && (
            <div>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>AM</div>
                <div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                    <button className={styles.btnUpload}>Upload new photo</button>
                    <button className={styles.btnRemove}>Remove</button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280' }}>JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input type="text" className={styles.input} defaultValue="Arjun" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input type="text" className={styles.input} defaultValue="Mehta" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input type="email" className={styles.input} defaultValue="arjun.mehta@example.com" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input type="tel" className={styles.input} defaultValue="+91 98765 43210" />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Bio / Investment Thesis</label>
                  <textarea className={styles.input} rows={4} defaultValue="Angel investor focused on early-stage AgriTech and FinTech startups in India. Looking for passionate founders building scalable solutions for tier-2/3 cities."></textarea>
                </div>
              </div>

              <div className={styles.actionsRow}>
                <button className={styles.btnPrimary}>Save Changes</button>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'Preferences' && (
            <div>
              <h2 className={styles.sectionTitle}>Investment Preferences</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Preferred Sectors</label>
                  <select className={styles.input} multiple style={{ height: '120px' }} defaultValue={['AgriTech', 'FinTech']}>
                    <option value="AgriTech">AgriTech</option>
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="SaaS">B2B SaaS</option>
                    <option value="CleanTech">CleanTech</option>
                  </select>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Hold Ctrl/Cmd to select multiple sectors.</p>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Typical Ticket Size</label>
                  <select className={styles.input} defaultValue="1L-5L">
                    <option value="0-1L">Under ₹1 Lakh</option>
                    <option value="1L-5L">₹1 Lakh - ₹5 Lakhs</option>
                    <option value="5L-10L">₹5 Lakhs - ₹10 Lakhs</option>
                    <option value="10L+">₹10 Lakhs+</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Preferred Investment Stage</label>
                  <select className={styles.input} defaultValue="Seed">
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Pre-Series A">Pre-Series A</option>
                    <option value="Series A">Series A</option>
                  </select>
                </div>
              </div>

              <div className={styles.divider}></div>

              <h2 className={styles.sectionTitle}>Platform Display</h2>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Public Profile</div>
                  <div className={styles.toggleDesc}>Allow founders to view your investment history and thesis.</div>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.actionsRow}>
                <button className={styles.btnPrimary}>Update Preferences</button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'Notifications' && (
            <div>
              <h2 className={styles.sectionTitle}>Email Notifications</h2>
              
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>New Campaigns</div>
                  <div className={styles.toggleDesc}>Get notified when a new startup matching your preferences is listed.</div>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Milestone Updates</div>
                  <div className={styles.toggleDesc}>Receive reports when your portfolio startups achieve milestones.</div>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>XRaise Offers</div>
                  <div className={styles.toggleDesc}>Alert me immediately when a founder counters or accepts my offer.</div>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.divider}></div>

              <h2 className={styles.sectionTitle}>SMS Alerts</h2>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Critical Alerts Only</div>
                  <div className={styles.toggleDesc}>Security alerts, failed transactions, and escrow unlocks.</div>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

            </div>
          )}

          {/* SECURITY & KYC TAB */}
          {activeTab === 'Security & KYC' && (
            <div>
              <h2 className={styles.sectionTitle}>KYC Verification</h2>
              
              <div className={styles.kycRow}>
                <div>
                  <div className={styles.kycDoc}>PAN Card</div>
                  <div className={styles.kycDesc}>XXXXX1234X</div>
                </div>
                <div className={styles.badgeVerified}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Verified
                </div>
              </div>

              <div className={styles.kycRow}>
                <div>
                  <div className={styles.kycDoc}>Aadhaar / Address Proof</div>
                  <div className={styles.kycDesc}>Verified via DigiLocker on Jan 12, 2025</div>
                </div>
                <div className={styles.badgeVerified}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Verified
                </div>
              </div>

              <div className={styles.kycRow}>
                <div>
                  <div className={styles.kycDoc}>Bank Account Link</div>
                  <div className={styles.kycDesc}>HDFC Bank ending in 5678</div>
                </div>
                <div className={styles.badgeVerified}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Verified
                </div>
              </div>

              <div className={styles.divider}></div>

              <h2 className={styles.sectionTitle}>Security</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Current Password</label>
                  <input type="password" className={styles.input} placeholder="••••••••" />
                </div>
                <div style={{ display: 'none' }}></div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>New Password</label>
                  <input type="password" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirm New Password</label>
                  <input type="password" className={styles.input} />
                </div>
              </div>

              <div className={styles.actionsRow}>
                <button className={styles.btnPrimary} style={{ background: '#1B3A6B' }}>Update Password</button>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <div className={styles.toggleTitle}>Two-Factor Authentication (2FA)</div>
                  <div className={styles.toggleDesc}>Require an OTP from an authenticator app when logging in.</div>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

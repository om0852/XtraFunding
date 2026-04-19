"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ViewState = 'ROLE_SELECT' | 'SIGNUP' | 'LOGIN';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>('ROLE_SELECT');
  const [role, setRole] = useState<'investor' | 'startup' | null>(null);

  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [startupName, setStartupName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timer, setTimer] = useState(30);

  // Password validation logic
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  }

  // Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (name.length < 3 || /[^a-zA-Z\s]/.test(name)) {
      newErrors.name = "Name must be at least 3 characters and letters only";
    }
    if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!validatePhone(phone)) newErrors.phone = "Enter a valid 10-digit mobile number";
    if (score < 4) newErrors.password = "Please fulfill all password requirements";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (role === 'startup') {
      if (startupName.length < 2) newErrors.startupName = "Required (min 2 characters)";
      if (!businessType) newErrors.businessType = "Please select a business type";
    }

    if (!termsAccepted) newErrors.terms = "You must accept the terms to continue";

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: role?.toUpperCase(),
            name,
            email,
            phone,
            password,
            startupDetails: role === 'startup' ? {
              companyName: startupName,
              registrationType: businessType
            } : undefined
          })
        });
        
        const data = await res.json();
        setLoading(false);
        
        if (data.success) {
          localStorage.setItem('userId', data.data._id);
          router.push(role === 'startup' ? '/startup/dashboard' : '/investor/dashboard');
        } else {
          setErrors({ form: data.message || data.error || 'Error creating account' });
        }
      } catch (err) {
        setLoading(false);
        setErrors({ form: 'Network error occurred' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        localStorage.setItem('userId', data.data._id);
        router.push(data.data.role === 'STARTUP' ? '/startup/dashboard' : '/investor/dashboard');
      } else {
        setErrors({ login: data.message || 'Invalid credentials' });
      }
    } catch (err) {
      setLoading(false);
      setErrors({ login: 'Network error occurred' });
    }
  };

  const renderLeftHalf = () => (
    <div className={styles.leftHalf}>
      {/* BACKGROUND VIDEO */}
      <video autoPlay loop muted playsInline className={styles.videoBackground}>
        <source src="https://cdn.pixabay.com/video/2020/05/21/39695-424750278_large.mp4" type="video/mp4" />
      </video>

      <div className={styles.leftOverlay}></div>

      <Link href="/" className={styles.logo}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623" />
          <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623" />
        </svg>
        XtraFunds
      </Link>

      <div className={styles.leftContentWrapper}>

      <div className={styles.leftContent}>
        <h2 className={styles.quote}>The Future of Verified Investments</h2>
        <p className={styles.subquote}>Experience the first fully transparent ecosystem for startup funding. AI-driven ratings, smart contract escrows, and robust blockchain verification.</p>

        <div className={styles.trustBadges}>
          <div className={styles.trustBadge}>
            <div className={styles.trustIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <span>Blockchain Verified</span>
          </div>
          <div className={styles.trustBadge}>
            <div className={styles.trustIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <span>AI XRate Analysis</span>
          </div>
          <div className={styles.trustBadge}>
            <div className={styles.trustIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <span>Escrow Protected</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {renderLeftHalf()}

      <div className={styles.rightHalf}>
        {view === 'ROLE_SELECT' && (
          <div className={styles.formCard}>
            <h1 className={styles.heading}>Welcome to XtraFunding</h1>
            <p className={styles.subtext}>Choose how you want to continue</p>

            <div className={styles.roleContainer}>
              <button
                className={`${styles.roleCard} ${role === 'investor' ? styles.roleCardSelected : ''}`}
                onClick={() => setRole('investor')}
              >
                <div className={styles.roleIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                    <line x1="22" y1="12" x2="16" y2="12"></line>
                    <polyline points="19 9 22 12 19 15"></polyline>
                  </svg>
                </div>
                <div className={styles.roleTitle}>I'm an Investor</div>
                <div className={styles.roleDesc}>Browse and invest in verified startups</div>
              </button>

              <button
                className={`${styles.roleCard} ${role === 'startup' ? styles.roleCardSelected : ''}`}
                onClick={() => setRole('startup')}
              >
                <div className={styles.roleIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                  </svg>
                </div>
                <div className={styles.roleTitle}>I'm a Startup</div>
                <div className={styles.roleDesc}>List your startup and raise funds</div>
              </button>
            </div>

            <button
              className={styles.btnPrimary}
              disabled={!role}
              onClick={() => setView('SIGNUP')}
            >
              Continue
            </button>

            <div className={styles.divider}>or</div>

            <button
              className={styles.btnSignIn}
              onClick={() => setView('LOGIN')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Sign In to Existing Account
            </button>
          </div>
        )}

        {view === 'SIGNUP' && (
          <form className={styles.formCard} onSubmit={handleSignupSubmit}>
            <h1 className={styles.headingLeft}>Create your account</h1>
            <p className={styles.subtextLeft}>
              Already have an account? <button type="button" className={styles.link} onClick={() => setView('LOGIN')}>Sign in</button>
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Enter your full name"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })) }}
              />
              {errors.name && <div className={styles.errorText}>{errors.name}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
              />
              {errors.email && <div className={styles.errorText}>{errors.email}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <div className={styles.inputWrapper}>
                <div className={styles.prefix}>
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  className={`${styles.input} ${styles.inputWithPrefix} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="XXXXX XXXXX"
                  maxLength={10}
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })) }}
                />
              </div>
              {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                />
                <button type="button" tabIndex={-1} className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {errors.password && <div className={styles.errorText}>{errors.password}</div>}
              {password && (
                <>
                  <div className={styles.pwdStrengthBar}>
                    <div className={styles.pwdSegment} style={{ background: score >= 1 ? '#DC2626' : undefined }}></div>
                    <div className={styles.pwdSegment} style={{ background: score >= 2 ? '#F59E0B' : undefined }}></div>
                    <div className={styles.pwdSegment} style={{ background: score >= 3 ? '#FBBF24' : undefined }}></div>
                    <div className={styles.pwdSegment} style={{ background: score >= 4 ? '#10B981' : undefined }}></div>
                  </div>
                  <div className={styles.pwdChecklist}>
                    <div className={`${styles.pwdTarget} ${hasMinLength ? styles.met : ''}`}>{hasMinLength && '✓'} At least 8 characters</div>
                    <div className={`${styles.pwdTarget} ${hasUpper ? styles.met : ''}`}>{hasUpper && '✓'} One uppercase letter</div>
                    <div className={`${styles.pwdTarget} ${hasNumber ? styles.met : ''}`}>{hasNumber && '✓'} One number</div>
                    <div className={`${styles.pwdTarget} ${hasSpecial ? styles.met : ''}`}>{hasSpecial && '✓'} One special character</div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })) }}
              />
              <button type="button" tabIndex={-1} className={styles.eyeIcon} style={{ top: '34px' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
              {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
            </div>

            {role === 'startup' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Startup Name</label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.startupName ? styles.inputError : ''}`}
                    placeholder="Your company or startup name"
                    value={startupName}
                    onChange={e => { setStartupName(e.target.value); setErrors(prev => ({ ...prev, startupName: '' })) }}
                  />
                  {errors.startupName && <div className={styles.errorText}>{errors.startupName}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Business Type</label>
                  <select
                    className={`${styles.select} ${errors.businessType ? styles.inputError : ''}`}
                    value={businessType}
                    onChange={e => { setBusinessType(e.target.value); setErrors(prev => ({ ...prev, businessType: '' })) }}
                  >
                    <option value="" disabled>Select</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Yet to Register">Yet to Register</option>
                  </select>
                  {errors.businessType && <div className={styles.errorText}>{errors.businessType}</div>}
                </div>
              </>
            )}

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={termsAccepted}
                onChange={e => { setTermsAccepted(e.target.checked); setErrors(prev => ({ ...prev, terms: '' })) }}
              />
              <div>
                <div className={styles.checkboxLabel}>I agree to the Terms of Service and Privacy Policy</div>
                {errors.terms && <div className={styles.errorText}>{errors.terms}</div>}
              </div>
            </div>

            {errors.form && <div className={styles.errorText} style={{ marginBottom: '1rem', textAlign: 'center' }}>{errors.form}</div>}
            <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>


          </form>
        )}

        {view === 'LOGIN' && (
          <form className={styles.formCard} onSubmit={handleLoginSubmit}>
            <h1 className={styles.headingLeft}>Welcome back</h1>
            <p className={styles.subtextLeft}>
              Don't have an account? <button type="button" className={styles.link} onClick={() => setView('SIGNUP')}>Sign up</button>
            </p>

            {errors.login && <div className={styles.errorText} style={{ marginBottom: '1rem' }}>{errors.login}</div>}

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <button type="button" className={`${styles.link} ${styles.helperLinkRight}`}>Forgot Password?</button>
              <div className={styles.inputWrapper}>
                <input type={showPassword ? 'text' : 'password'} className={styles.input} placeholder="Enter your password" required value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" tabIndex={-1} className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.btnGold} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

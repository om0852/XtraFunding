"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

type ViewState = 'ROLE_SELECT' | 'SIGNUP' | 'LOGIN' | 'OTP';

export default function AuthPage() {
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

  // OTP inputs
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
  const handleSignupSubmit = (e: React.FormEvent) => {
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
      setView('OTP');
    } else {
      setErrors(newErrors);
    }
  }

  // Handle OTP countdown
  useEffect(() => {
    if (view === 'OTP' && timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [view, timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const renderLeftHalf = () => (
    <div className={styles.leftHalf}>
      <Link href="/" className={styles.logo}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
          <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
        </svg>
        XFund
      </Link>
      
      <div className={styles.leftContent}>
        <div className={styles.quote}>"The best investment is in a verified future."</div>
        <div className={styles.subquote}>Join 1,200+ investors already building wealth through transparent startup funding.</div>
        
        <div className={styles.trustBadges}>
          <div className={styles.trustBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Blockchain Verified
          </div>
          <div className={styles.trustBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            AI Rated
          </div>
          <div className={styles.trustBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Escrow Protected
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
            <h1 className={styles.heading}>Welcome to XFund</h1>
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
                onChange={e => {setName(e.target.value); setErrors(prev => ({...prev, name: ''}))}}
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
                onChange={e => {setEmail(e.target.value); setErrors(prev => ({...prev, email: ''}))}}
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
                  onChange={e => {setPhone(e.target.value); setErrors(prev => ({...prev, phone: ''}))}}
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
                  onChange={e => {setPassword(e.target.value); setErrors(prev => ({...prev, password: ''}))}}
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
                onChange={e => {setConfirmPassword(e.target.value); setErrors(prev => ({...prev, confirmPassword: ''}))}}
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
                    onChange={e => {setStartupName(e.target.value); setErrors(prev => ({...prev, startupName: ''}))}}
                  />
                  {errors.startupName && <div className={styles.errorText}>{errors.startupName}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Business Type</label>
                  <select 
                    className={`${styles.select} ${errors.businessType ? styles.inputError : ''}`}
                    value={businessType}
                    onChange={e => {setBusinessType(e.target.value); setErrors(prev => ({...prev, businessType: ''}))}}
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
                onChange={e => {setTermsAccepted(e.target.checked); setErrors(prev => ({...prev, terms: ''}))}}
              />
              <div>
                <div className={styles.checkboxLabel}>I agree to the Terms of Service and Privacy Policy</div>
                {errors.terms && <div className={styles.errorText}>{errors.terms}</div>}
              </div>
            </div>

            <button type="submit" className={styles.btnPrimary}>Create Account</button>
            
            <div className={styles.divider}>OR</div>
            
            <button type="button" className={styles.btnSocial}>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>
        )}

        {view === 'LOGIN' && (
          <form className={styles.formCard} onSubmit={(e) => { e.preventDefault(); /* implement login */ }}>
            <h1 className={styles.headingLeft}>Welcome back</h1>
            <p className={styles.subtextLeft}>
              Don't have an account? <button type="button" className={styles.link} onClick={() => setView('SIGNUP')}>Sign up</button>
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} placeholder="you@example.com" required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <button type="button" className={`${styles.link} ${styles.helperLinkRight}`}>Forgot Password?</button>
              <div className={styles.inputWrapper}>
                <input type={showPassword ? 'text' : 'password'} className={styles.input} placeholder="Enter your password" required />
                <button type="button" tabIndex={-1} className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.btnGold}>Sign In</button>
            
            <div className={styles.divider}>OR</div>
            
            <button type="button" className={styles.btnSocial}>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>
        )}

        {view === 'OTP' && (
          <div className={styles.formCard} style={{ alignItems: 'center' }}>
            <h1 className={styles.heading}>Verify your phone number</h1>
            <p className={styles.subtext}>We sent a 6-digit code to +91 {phone || 'XXXXX XXXXX'}</p>
            
            <div className={styles.otpContainer}>
              {otp.map((digit, i) => (
                <input 
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  className={styles.otpInput}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            <div className={styles.resendText}>
              Didn't receive it? {timer > 0 ? `Resend in 00:${timer.toString().padStart(2, '0')}` : <button className={styles.link} onClick={() => setTimer(30)}>Resend now</button>}
            </div>

            <button className={styles.btnGold}>Verify</button>
          </div>
        )}
      </div>
    </div>
  );
}

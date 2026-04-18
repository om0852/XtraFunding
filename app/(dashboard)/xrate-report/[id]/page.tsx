'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from '../page.module.css';
import Link from 'next/link';

interface ReportData {
  _id: string;
  startupName: string;
  industry: string;
  description: string;
  overallScore: number;
  riskScore: number;
  growthScore: number;
  teamScore: number;
  marketScore: number;
  executiveSummary: string;
  riskFactors: string[];
  growthIndicators: string[];
  investmentRecommendations: string;
  verifiedDocuments: string[];
  createdAt: string;
}

export default function XRateDynamicReportPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false
  });

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/xrate/${id}`);
        const data = await res.json();
        if (data.success) {
          setReport(data.report);
        } else {
          setError(data.error || 'Failed to fetch report');
        }
      } catch (err) {
        setError('Error connecting to API');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchReport();
  }, [id]);

  const toggleSection = (id: number) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    
    setIsDownloading(true);
    
    // Open all sections for capture
    const currentSectionsState = { ...openSections };
    setOpenSections({ 1: true, 2: true, 3: true, 4: true });
    
    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('report-content');
      if (!element) throw new Error('Report content not found');

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#F8F9FC'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`XRate_Report_${report.startupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Revert sections to original state
      setOpenSections(currentSectionsState);
      setIsDownloading(false);
    }
  };

  if (loading) {
    return <div className={styles.pageContainer}><div className={styles.mainContent}><p>Loading XRate Report...</p></div></div>;
  }

  if (error || !report) {
    return <div className={styles.pageContainer}><div className={styles.mainContent}><p className={styles.errorText}>Error: {error}</p></div></div>;
  }

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7.5L12 13L22 7.5L12 2Z" fill="#F5A623"/>
            <path d="M2 16.5L12 22L22 16.5V11L12 16.5L2 11V16.5Z" fill="#F5A623"/>
          </svg>
          XtraFunds
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/campaign" className={styles.navLink}>Explore</Link>
          <Link href="/how-it-works" className={styles.navLink}>How it Works</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
        </div>
      </nav>

      <main id="report-content" className={styles.mainContent}>
        {/* HEADER CARD */}
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.startupLogo}>{report.startupName.substring(0, 2).toUpperCase()}</div>
            <div className={styles.startupInfo}>
              <h1 className={styles.startupName}>{report.startupName}</h1>
              <div className={styles.badgesRow}>
                <span className={styles.badgePill}>{report.industry}</span>
                <span className={styles.badgePill}>AI Generated</span>
              </div>
              <div className={styles.reportDate}>Analysis generated on {new Date(report.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.gaugeOuter}>
              <div className={styles.gaugeInner}>{report.overallScore}</div>
            </div>
            <div className={styles.gaugeLabel}>XRate Score</div>
            <div className={report.overallScore > 70 ? styles.badgeGreenSolid : styles.badgeGoldSolid}>
              {report.overallScore > 70 ? 'High Potential' : 'Moderate Potential'}
            </div>
          </div>
        </div>

        {/* SCORE BREAKDOWN GRID */}
        <div className={styles.grid}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Risk Assessment</span>
              <span className={report.riskScore > 50 ? styles.scoreValueGreen : styles.scoreValueGold}>{report.riskScore}/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={report.riskScore > 50 ? styles.barFillGreen : styles.barFillGold} style={{ width: `${report.riskScore}%` }}></div>
            </div>
            <span className={report.riskScore > 50 ? styles.cardTagGreen : styles.cardTagAmber}>Evaluation</span>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Growth Potential</span>
              <span className={styles.scoreValueBlue}>{report.growthScore}/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillBlue} style={{ width: `${report.growthScore}%` }}></div>
            </div>
            <span className={styles.cardTagBlue}>Analysis</span>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Team Strength</span>
              <span className={styles.scoreValueGold}>{report.teamScore}/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillGold} style={{ width: `${report.teamScore}%` }}></div>
            </div>
            <span className={styles.cardTagAmber}>Review</span>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Market Size</span>
              <span className={styles.scoreValueBlue}>{report.marketScore}/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillBlue} style={{ width: `${report.marketScore}%` }}></div>
            </div>
            <span className={styles.cardTagBlue}>Market Reach</span>
          </div>
        </div>

        {/* FULL ANALYSIS SECTIONS */}
        <div className={styles.analysisSection}>
          <h2 className={styles.analysisTitle}>Detailed AI Analysis</h2>
          
          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(1)}>
              Executive Summary
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[1] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[1] && (
              <div className={styles.accordionContent}>
                <p>{report.executiveSummary}</p>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(2)}>
              Risk Factors
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[2] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[2] && (
              <div className={styles.accordionContent}>
                <ul className={styles.bulletList}>
                  {report.riskFactors.map((factor, i) => (
                    <li key={i}><div className={styles.dotAmber}></div>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(3)}>
              Growth Indicators
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[3] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[3] && (
              <div className={styles.accordionContent}>
                <ul className={styles.bulletList}>
                  {report.growthIndicators.map((indicator, i) => (
                    <li key={i}><div className={styles.dotGreen}></div>{indicator}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={() => toggleSection(4)}>
              Investment Recommendations
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openSections[4] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {openSections[4] && (
              <div className={styles.accordionContent}>
                <p>{report.investmentRecommendations}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className={styles.bottomBar}>
        <div className={styles.barLeft}>
          <button className={styles.btnOutlinedBlack}>Share Report</button>
        </div>
        <button 
          className={styles.btnDownload} 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
        >
          {isDownloading ? 'Generating PDF...' : 'Download PDF Report'}
        </button>
      </div>
    </div>
  );
}

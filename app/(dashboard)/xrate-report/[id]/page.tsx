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
  investmentThesis: string;
  riskFactors: string[];
  growthIndicators: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketAnalysis: {
    tam: string;
    competition: string[];
    trends: string[];
  };
  moatAnalysis: string;
  milestones: string[];
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
    
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('report-content');
      if (!element) throw new Error('Report content not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#F8F9FC'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`XRate_Premium_Report_${report.startupName.replace(/\s+/g, '_')}.pdf`);
      
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setOpenSections(currentSectionsState);
      setIsDownloading(false);
    }
  };

  if (loading) {
    return <div className={styles.pageContainer}><div className={styles.mainContent}><p>Analyzing XRate Insights...</p></div></div>;
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
                <span className={styles.badgePill} style={{background: '#312E81', color: '#fff'}}>Institutional Class</span>
              </div>
              <div className={styles.reportDate}>Verified analysis on {new Date(report.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.gaugeOuter}>
              <div className={styles.gaugeInner}>{report.overallScore}</div>
            </div>
            <div className={styles.gaugeLabel}>Investment Rating</div>
            <div className={report.overallScore > 75 ? styles.badgeGreenSolid : styles.badgeGoldSolid}>
              {report.overallScore > 85 ? 'Exceptional' : report.overallScore > 70 ? 'Strong Potential' : 'Speculative'}
            </div>
          </div>
        </div>

        {/* INVESTMENT THESIS */}
        <div className={styles.thesisCard}>
          <div className={styles.thesisLabel}>Investment Thesis</div>
          <div className={styles.thesisText}>{report.investmentThesis}</div>
        </div>

        {/* SCORE BREAKDOWN GRID */}
        <div className={styles.grid}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Risk Profile</span>
              <span className={styles.scoreValueBlue}>{report.riskScore}/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillBlue} style={{ width: `${report.riskScore}%` }}></div>
            </div>
            <p className={styles.cardDesc}>Evaluation of execution, market, and financial risk vectors.</p>
          </div>

          <div className={styles.scoreCard}>
            <div className={styles.scoreCardHeader}>
              <span className={styles.scoreCardTitle}>Growth Velocity</span>
              <span className={styles.scoreValueBlue}>{report.growthScore}/100</span>
            </div>
            <div className={styles.barContainer}>
              <div className={styles.barFillBlue} style={{ width: `${report.growthScore}%` }}></div>
            </div>
            <p className={styles.cardDesc}>Analysis of scalability and revenue acceleration potential.</p>
          </div>
        </div>

        {/* SWOT ANALYSIS */}
        <h2 className={styles.analysisTitle}>Strategic SWOT Analysis</h2>
        <div className={styles.swotGrid}>
          <div className={`${styles.swotCard} ${styles.swotS}`}>
            <div className={styles.swotTitle}>Strengths</div>
            <ul className={styles.swotList}>
              {report.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className={`${styles.swotCard} ${styles.swotW}`}>
            <div className={styles.swotTitle}>Weaknesses</div>
            <ul className={styles.swotList}>
              {report.swot.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className={`${styles.swotCard} ${styles.swotO}`}>
            <div className={styles.swotTitle}>Opportunities</div>
            <ul className={styles.swotList}>
              {report.swot.opportunities.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className={`${styles.swotCard} ${styles.swotT}`}>
            <div className={styles.swotTitle}>Threats</div>
            <ul className={styles.swotList}>
              {report.swot.threats.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        {/* MARKET & MOAT SECTION */}
        <div className={styles.marketGrid}>
          <div className={styles.marketSection}>
            <div className={styles.sectionHeader}>Market Dynamics</div>
            <div className={styles.tamBox}>
              <span className={styles.tamValue}>{report.marketAnalysis.tam}</span>
              <p className={styles.tamLabels}>Estimated Total Addressable Market</p>
            </div>
            <div style={{marginTop: '20px'}}>
              <p style={{fontSize: '13px', fontWeight: '600', color: '#1B3A6B', marginBottom: '8px'}}>Key Trends:</p>
              <ul className={styles.swotList} style={{fontSize: '13px'}}>
                {report.marketAnalysis.trends.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>
          
          <div className={styles.marketSection}>
            <div className={styles.sectionHeader}>Competitive Advantage (Moat)</div>
            <p style={{fontSize: '14px', lineHeight: '1.6', color: '#4B5563', marginBottom: '20px'}}>
              {report.moatAnalysis}
            </p>
            <p style={{fontSize: '13px', fontWeight: '600', color: '#1B3A6B', marginBottom: '8px'}}>Direct Competition:</p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
              {report.marketAnalysis.competition.map((c, i) => (
                <span key={i} className={styles.badgePill} style={{background: '#F3F4F6', color: '#4B5563'}}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ROADMAP SECTION */}
        <div className={styles.analysisSection}>
          <div className={styles.sectionHeader}>Strategic Roadmap (Next 12 Months)</div>
          <div className={styles.roadmapList}>
            {report.milestones.map((m, i) => (
              <div key={i} className={styles.roadmapItem}>
                <div className={styles.roadmapMarker}>Q{i+1}</div>
                <div className={styles.roadmapText}>{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className={styles.analysisSection} style={{marginTop: '32px'}}>
          <div className={styles.sectionHeader}>Investment Verdict</div>
          <p style={{fontSize: '15px', lineHeight: '1.7', color: '#374151'}}>
            {report.investmentRecommendations}
          </p>
        </div>
      </main>

      <div className={styles.bottomBar}>
        <div className={styles.barLeft}>
          <button className={styles.btnOutlinedBlack}>Internal Review</button>
          <button className={styles.btnOutlinedBlack}>Share Securely</button>
        </div>
        <button 
          className={styles.btnDownload} 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
        >
          {isDownloading ? 'Structuring PDF...' : 'Download Institutional Report'}
        </button>
      </div>
    </div>
  );
}

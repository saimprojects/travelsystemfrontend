import { useEffect, useState, useRef } from 'react';
import { analyticsAPI, agencyAPI } from '../services/api';
import { 
  DollarSign, TrendingUp, Users, BookOpen, CreditCard, 
  Printer, Download, Calendar, FileText, ChevronDown, 
  ChevronUp, BarChart3, PieChart, LineChart 
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
  LineChart as RechartsLineChart, Line
} from 'recharts';
import html2canvas from 'html2canvas';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('lifetime');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    financial: true,
    payments: true,
    bookings: true,
    agents: true,
    graphs: false
  });

  // Refs for charts
  const salesChartRef = useRef(null);
  const paymentChartRef = useRef(null);
  const bookingChartRef = useRef(null);
  const agentChartRef = useRef(null);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, startDate, endDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = { range };

      if (range === 'custom') {
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
      }

      const [analyticsRes, agencyRes] = await Promise.all([
        analyticsAPI.getAnalytics(params),
        agencyAPI.getAgency()
      ]);

      setAnalytics(analyticsRes.data);
      setAgency(agencyRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatPKR = (amount) => {
    if (!amount && amount !== 0) return '₨ 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₨ ${num.toLocaleString('en-PK')}`;
  };

  const formatDateRange = () => {
    if (range === 'lifetime') return 'Lifetime';
    if (range === 'this_week') return 'This Week';
    if (range === 'this_month') return 'This Month';
    if (range === 'last_month') return 'Last Month';
    if (range === 'custom') {
      if (startDate && endDate) {
        return `${new Date(startDate).toLocaleDateString('en-PK')} - ${new Date(endDate).toLocaleDateString('en-PK')}`;
      }
      return 'Custom Date Range';
    }
    return '';
  };

  // Prepare graph data
  const getGraphData = () => {
    if (!analytics) return null;

    // Payment breakdown data
    const paymentData = [
      { name: 'Paid', value: analytics?.payment_breakdown?.paid || 0, color: '#10b981' },
      { name: 'Half Paid', value: analytics?.payment_breakdown?.half_paid || 0, color: '#f59e0b' },
      { name: 'Pending', value: analytics?.payment_breakdown?.pending || 0, color: '#ef4444' }
    ];

    // Booking status data
    const bookingData = [
      { name: 'Confirmed', value: analytics?.booking_status_breakdown?.confirmed || 0, color: '#10b981' },
      { name: 'Pending', value: analytics?.booking_status_breakdown?.pending || 0, color: '#f59e0b' },
      { name: 'Rejected', value: analytics?.booking_status_breakdown?.rejected || 0, color: '#ef4444' }
    ];

    // Sales data for bar chart
    const salesData = [
      { name: 'Sales', amount: parseFloat(analytics?.amounts?.total_sales || 0) },
      { name: 'Received', amount: parseFloat(analytics?.amounts?.total_received || 0) },
      { name: 'Profit', amount: parseFloat(analytics?.amounts?.total_profit || 0) }
    ];

    // Agent performance data
    const agentData = (analytics?.agent_bookings_tracker || []).map(agent => ({
      name: agent.created_by__username || 'Agent',
      bookings: agent.count || 0,
      customers: analytics?.agent_customers_tracker?.find(a => a.created_by__username === agent.created_by__username)?.unique_clients || 0
    }));

    return {
      paymentData,
      bookingData,
      salesData,
      agentData
    };
  };

  // Function to capture charts as images
  const captureChartAsImage = async (chartRef, chartName) => {
    if (!chartRef.current) return null;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error(`Error capturing ${chartName}:`, error);
      return null;
    }
  };

  // Function to generate charts for printing
  const generateChartsForPrint = async () => {
    const chartImages = {};
    
    // Capture each chart
    if (salesChartRef.current) {
      chartImages.sales = await captureChartAsImage(salesChartRef, 'sales');
    }
    if (paymentChartRef.current) {
      chartImages.payment = await captureChartAsImage(paymentChartRef, 'payment');
    }
    if (bookingChartRef.current) {
      chartImages.booking = await captureChartAsImage(bookingChartRef, 'booking');
    }
    if (agentChartRef.current) {
      chartImages.agent = await captureChartAsImage(agentChartRef, 'agent');
    }
    
    return chartImages;
  };

  const generateAnalyticsReport = () => {
    const reportData = {
      agencyName: agency?.name || 'Your Agency',
      reportDate: new Date().toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      reportTime: new Date().toLocaleTimeString('en-PK', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      dateRange: formatDateRange(),
      analytics: analytics
    };

    const printWindow = window.open('', '_blank');
    
    const reportHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Analytics Report - ${reportData.agencyName}</title>
        <style>
          /* PRINT OPTIMIZATION FOR A4 */
          @media print {
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
              font-size: 9px !important;
              line-height: 1.2 !important;
              font-family: Arial, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            .report-container {
              max-width: 100% !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            
            /* COMPACT HEADER */
            .report-header {
              text-align: center;
              margin-bottom: 6mm !important;
              padding-bottom: 3mm !important;
              border-bottom: 1px solid #000 !important;
            }
            
            .report-header h1 {
              margin: 1mm 0 !important;
              font-size: 16px !important;
              letter-spacing: 0.5px !important;
            }
            
            .report-header h2 {
              margin: 0.5mm 0 !important;
              font-size: 10px !important;
              font-weight: normal !important;
            }
            
            /* COMPACT AGENCY INFO */
            .agency-info {
              text-align: center;
              margin-bottom: 4mm !important;
              padding-bottom: 2mm !important;
              border-bottom: 0.5px solid #ddd !important;
            }
            
            .agency-info h3 {
              margin: 1mm 0 !important;
              font-size: 12px !important;
            }
            
            /* COMPACT META INFO */
            .report-meta {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 3mm !important;
              margin-bottom: 4mm !important;
              padding: 2mm !important;
              background: #f5f5f5 !important;
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
            }
            
            .meta-item {
              text-align: center !important;
            }
            
            .meta-label {
              font-size: 7px !important;
              color: #666 !important;
              text-transform: uppercase !important;
              margin-bottom: 1mm !important;
            }
            
            .meta-value {
              font-weight: 600 !important;
              font-size: 9px !important;
              color: #333 !important;
            }
            
            /* COMPACT SECTIONS */
            .section {
              margin-bottom: 4mm !important;
              page-break-inside: avoid !important;
            }
            
            .section-header {
              background: #4f46e5 !important;
              color: white !important;
              padding: 2mm 3mm !important;
              border-radius: 2px !important;
              margin-bottom: 2mm !important;
            }
            
            .section-header h3 {
              margin: 0 !important;
              font-size: 10px !important;
              font-weight: 600 !important;
            }
            
            /* COMPACT STATS GRID */
            .stats-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 2mm !important;
              margin-bottom: 3mm !important;
            }
            
            .stat-card {
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
              padding: 2mm !important;
              text-align: center !important;
            }
            
            .stat-value {
              font-size: 12px !important;
              font-weight: 700 !important;
              margin: 1mm 0 !important;
            }
            
            .stat-label {
              font-size: 7px !important;
              color: #666 !important;
              text-transform: uppercase !important;
            }
            
            /* COMPACT BREAKDOWN GRID */
            .breakdown-grid {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 2mm !important;
              margin-bottom: 3mm !important;
            }
            
            .breakdown-card {
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
              padding: 2mm !important;
              text-align: center !important;
            }
            
            .breakdown-value {
              font-size: 14px !important;
              font-weight: 700 !important;
              margin: 1mm 0 !important;
            }
            
            /* COMPACT AGENT LIST */
            .agent-list {
              display: grid !important;
              gap: 1.5mm !important;
            }
            
            .agent-item {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              padding: 1.5mm 2mm !important;
              background: #f8f8f8 !important;
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
            }
            
            .agent-name {
              font-weight: 600 !important;
              font-size: 8px !important;
              color: #333 !important;
            }
            
            .agent-stats {
              display: flex !important;
              gap: 2mm !important;
            }
            
            .agent-stat {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              padding: 1mm 1.5mm !important;
              background: white !important;
              border: 0.5px solid #ddd !important;
              border-radius: 1px !important;
            }
            
            .agent-value {
              font-weight: 700 !important;
              font-size: 9px !important;
              color: #4f46e5 !important;
            }
            
            .agent-label {
              font-size: 6px !important;
              color: #666 !important;
              text-transform: uppercase !important;
            }
            
            /* COMPACT FOOTER */
            .footer {
              margin-top: 4mm !important;
              text-align: center !important;
              color: #666 !important;
              font-size: 6px !important;
              border-top: 0.5px solid #ddd !important;
              padding-top: 2mm !important;
            }
            
            .note {
              margin-top: 3mm !important;
              padding: 2mm !important;
              background: #fef3c7 !important;
              border: 0.5px solid #fbbf24 !important;
              border-radius: 2px !important;
              color: #92400e !important;
              font-size: 7px !important;
            }
            
            /* COLOR CLASSES FOR PRINT */
            .breakdown-paid { color: #059669 !important; }
            .breakdown-half { color: #d97706 !important; }
            .breakdown-pending { color: #dc2626 !important; }
            .breakdown-confirmed { color: #059669 !important; }
            .breakdown-pending-booking { color: #d97706 !important; }
            .breakdown-rejected { color: #dc2626 !important; }
            
            /* HIDE SCREEN-ONLY ELEMENTS */
            .print-button {
              display: none !important;
            }
          }
          
          /* SCREEN STYLES (for preview) */
          @media screen {
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              background: #f8fafc;
            }
            
            .report-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .report-header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #4f46e5;
              padding-bottom: 20px;
            }
            
            .report-header h1 {
              margin: 0;
              color: #4f46e5;
              font-size: 32px;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 800;
            }
            
            .report-header h2 {
              margin: 10px 0 5px 0;
              color: #666;
              font-size: 18px;
              font-weight: normal;
            }
            
            .agency-info {
              text-align: center;
              margin-bottom: 30px;
              padding: 15px;
              background: #f8fafc;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .agency-info h3 {
              margin: 0 0 10px 0;
              color: #4f46e5;
              font-size: 20px;
            }
            
            .report-meta {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background: #f1f5f9;
              border-radius: 8px;
              font-size: 14px;
            }
            
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            
            .meta-label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .meta-value {
              font-weight: 600;
              color: #334155;
            }
            
            .section {
              margin-bottom: 40px;
            }
            
            .section-header {
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              color: white;
              padding: 15px 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            
            .section-header h3 {
              margin: 0;
              font-size: 18px;
              font-weight: 600;
            }
            
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 20px;
            }
            
            @media (min-width: 768px) {
              .stats-grid {
                grid-template-columns: repeat(4, 1fr);
              }
            }
            
            .stat-card {
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              transition: all 0.3s ease;
            }
            
            .stat-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .stat-value {
              font-size: 28px;
              font-weight: 700;
              color: #4f46e5;
              margin: 10px 0;
            }
            
            .stat-label {
              font-size: 14px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .breakdown-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .breakdown-card {
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            
            .breakdown-value {
              font-size: 36px;
              font-weight: 700;
              margin: 10px 0;
            }
            
            .breakdown-paid { color: #10b981; }
            .breakdown-half { color: #f59e0b; }
            .breakdown-pending { color: #ef4444; }
            .breakdown-confirmed { color: #10b981; }
            .breakdown-pending-booking { color: #f59e0b; }
            .breakdown-rejected { color: #ef4444; }
            
            .agent-list {
              display: grid;
              gap: 15px;
            }
            
            .agent-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
            }
            
            .agent-name {
              font-weight: 600;
              color: #334155;
            }
            
            .agent-stats {
              display: flex;
              gap: 20px;
            }
            
            .agent-stat {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 8px 15px;
              background: white;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            
            .agent-value {
              font-weight: 700;
              color: #4f46e5;
            }
            
            .agent-label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 12px 24px;
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              font-size: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
              z-index: 1000;
            }
            
            .print-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
            }
            
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #64748b;
              font-size: 12px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-style: italic;
            }
            
            .note {
              margin-top: 30px;
              padding: 15px;
              background: #fef3c7;
              border: 1px solid #fbbf24;
              border-radius: 8px;
              color: #92400e;
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print Report
        </button>
        
        <div class="report-container">
          <div class="report-header">
            <h1>ANALYTICS REPORT</h1>
            <h2>Performance Overview</h2>
          </div>
          
          <div class="agency-info">
            <h3>${reportData.agencyName}</h3>
            <p>Analytics Report for ${reportData.dateRange}</p>
          </div>
          
          <div class="report-meta">
            <div class="meta-item">
              <span class="meta-label">Report Date</span>
              <span class="meta-value">${reportData.reportDate}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Report Time</span>
              <span class="meta-value">${reportData.reportTime}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Date Range</span>
              <span class="meta-value">${reportData.dateRange}</span>
            </div>
          </div>
          
          <!-- Financial Overview -->
          <div class="section">
            <div class="section-header">
              <h3>FINANCIAL OVERVIEW</h3>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Sales</div>
                <div class="stat-value">${formatPKR(reportData.analytics?.amounts?.total_sales || 0).replace('₨ ', 'PKR ')}</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-label">Total Received</div>
                <div class="stat-value">${formatPKR(reportData.analytics?.amounts?.total_received || 0).replace('₨ ', 'PKR ')}</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-label">Total Remaining</div>
                <div class="stat-value">${formatPKR(reportData.analytics?.amounts?.total_remaining || 0).replace('₨ ', 'PKR ')}</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-label">Total Profit</div>
                <div class="stat-value">${formatPKR(reportData.analytics?.amounts?.total_profit || 0).replace('₨ ', 'PKR ')}</div>
              </div>
            </div>
          </div>
          
          <!-- Payment Breakdown -->
          <div class="section">
            <div class="section-header">
              <h3>PAYMENT BREAKDOWN</h3>
            </div>
            
            <div class="breakdown-grid">
              <div class="breakdown-card">
                <div class="stat-label">Paid Bookings</div>
                <div class="breakdown-value breakdown-paid">
                  ${reportData.analytics?.payment_breakdown?.paid || 0}
                </div>
              </div>
              
              <div class="breakdown-card">
                <div class="stat-label">Half Paid</div>
                <div class="breakdown-value breakdown-half">
                  ${reportData.analytics?.payment_breakdown?.half_paid || 0}
                </div>
              </div>
              
              <div class="breakdown-card">
                <div class="stat-label">Pending Payments</div>
                <div class="breakdown-value breakdown-pending">
                  ${reportData.analytics?.payment_breakdown?.pending || 0}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Booking Status -->
          <div class="section">
            <div class="section-header">
              <h3>BOOKING STATUS</h3>
            </div>
            
            <div class="breakdown-grid">
              <div class="breakdown-card">
                <div class="stat-label">Confirmed</div>
                <div class="breakdown-value breakdown-confirmed">
                  ${reportData.analytics?.booking_status_breakdown?.confirmed || 0}
                </div>
              </div>
              
              <div class="breakdown-card">
                <div class="stat-label">Pending</div>
                <div class="breakdown-value breakdown-pending-booking">
                  ${reportData.analytics?.booking_status_breakdown?.pending || 0}
                </div>
              </div>
              
              <div class="breakdown-card">
                <div class="stat-label">Rejected</div>
                <div class="breakdown-value breakdown-rejected">
                  ${reportData.analytics?.booking_status_breakdown?.rejected || 0}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Overall Statistics -->
          <div class="section">
            <div class="section-header">
              <h3>OVERALL STATISTICS</h3>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Bookings</div>
                <div class="stat-value">${reportData.analytics?.total_bookings || 0}</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-label">Total Customers</div>
                <div class="stat-value">${reportData.analytics?.total_customers || 0}</div>
              </div>
            </div>
          </div>
          
          <!-- Agent Performance -->
          <div class="section">
            <div class="section-header">
              <h3>AGENT PERFORMANCE</h3>
            </div>
            
            <div class="agent-list">
              ${(reportData.analytics?.agent_bookings_tracker || []).map((agent, index) => {
                const customersData = reportData.analytics?.agent_customers_tracker?.[index];
                return `
                  <div class="agent-item">
                    <div class="agent-name">${agent.created_by__username || 'Unknown Agent'}</div>
                    <div class="agent-stats">
                      <div class="agent-stat">
                        <div class="agent-value">${agent.count || 0}</div>
                        <div class="agent-label">Bookings</div>
                      </div>
                      <div class="agent-stat">
                        <div class="agent-value">${customersData?.unique_clients || 0}</div>
                        <div class="agent-label">Customers</div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('') || '<p class="note" style="text-align: center;">No agent data available</p>'}
            </div>
          </div>
          
          <div class="note">
            <strong>Note:</strong> This report is generated automatically based on the selected date range. 
            All amounts are in Pakistani Rupees (PKR).
          </div>
          
          <div class="footer">
            <p>Generated by ${reportData.agencyName} Analytics System</p>
            <p>Report ID: ANL-${Date.now().toString().slice(-8)}</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            // Optional: Auto-print
            // window.print();
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    toast.success('Analytics report opened in new window. Click the print button to print.');
  };

  const generateGraphsReport = async () => {
    toast.loading('Generating graphs for print...');
    
    try {
      // Capture charts as images
      const chartImages = await generateChartsForPrint();
      
      const reportData = {
        agencyName: agency?.name || 'Your Agency',
        reportDate: new Date().toLocaleDateString('en-PK', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        reportTime: new Date().toLocaleTimeString('en-PK', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        dateRange: formatDateRange(),
        chartImages: chartImages,
        graphData: getGraphData()
      };

      const printWindow = window.open('', '_blank');
      
      const reportHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Analytics Graphs Report - ${reportData.agencyName}</title>
          <style>
            /* PRINT OPTIMIZATION FOR A4 - Graphs Version */
            @media print {
              @page {
                size: A4 landscape;
                margin: 10mm;
              }
              
              body {
                margin: 0 !important;
                padding: 0 !important;
                font-size: 9px !important;
                line-height: 1.2 !important;
                font-family: Arial, sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .no-print {
                display: none !important;
              }
              
              .graphs-container {
                max-width: 100% !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
              }
              
              /* COMPACT HEADER FOR GRAPHS */
              .graphs-header {
                text-align: center;
                margin-bottom: 6mm !important;
                padding-bottom: 3mm !important;
                border-bottom: 1px solid #000 !important;
              }
              
              .graphs-header h1 {
                margin: 1mm 0 !important;
                font-size: 16px !important;
                letter-spacing: 0.5px !important;
              }
              
              .graphs-header h2 {
                margin: 0.5mm 0 !important;
                font-size: 10px !important;
                font-weight: normal !important;
              }
              
              /* COMPACT AGENCY INFO */
              .graphs-agency-info {
                text-align: center;
                margin-bottom: 4mm !important;
                padding-bottom: 2mm !important;
                border-bottom: 0.5px solid #ddd !important;
              }
              
              .graphs-agency-info h3 {
                margin: 1mm 0 !important;
                font-size: 12px !important;
              }
              
              /* GRAPH GRID LAYOUT */
              .graphs-grid {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                grid-template-rows: repeat(2, auto) !important;
                gap: 6mm !important;
                margin-bottom: 6mm !important;
                page-break-inside: avoid !important;
              }
              
              /* GRAPH CONTAINER */
              .graph-container {
                border: 1px solid #ddd !important;
                border-radius: 3px !important;
                padding: 3mm !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                min-height: 90mm !important;
                display: flex !important;
                flex-direction: column !important;
                background: white !important;
              }
              
              .graph-title {
                font-size: 12px !important;
                font-weight: 600 !important;
                text-align: center !important;
                margin-bottom: 3mm !important;
                color: #4f46e5 !important;
                padding-bottom: 1mm !important;
                border-bottom: 1px solid #eee !important;
              }
              
              .graph-content {
                flex: 1 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
              }
              
              .chart-image {
                max-width: 100% !important;
                max-height: 70mm !important;
                border: 0.5px solid #eee !important;
                border-radius: 2px !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
              }
              
              .no-image {
                text-align: center !important;
                color: #666 !important;
                font-size: 10px !important;
                padding: 10mm !important;
                border: 1px dashed #ddd !important;
                border-radius: 2px !important;
              }
              
              /* STATS TABLE FOR FALLBACK */
              .stats-table {
                width: 100% !important;
                border-collapse: collapse !important;
                font-size: 8px !important;
              }
              
              .stats-table th {
                background: #f5f5f5 !important;
                padding: 2mm !important;
                border: 0.5px solid #ddd !important;
                text-align: left !important;
                font-weight: 600 !important;
              }
              
              .stats-table td {
                padding: 2mm !important;
                border: 0.5px solid #ddd !important;
              }
              
              .stats-table tr:nth-child(even) {
                background: #fafafa !important;
              }
              
              /* COMPACT FOOTER */
              .graphs-footer {
                margin-top: 5mm !important;
                text-align: center !important;
                color: #666 !important;
                font-size: 8px !important;
                border-top: 1px solid #ddd !important;
                padding-top: 3mm !important;
              }
            
              .print-button {
                display: none !important;
              }
            }
            
            /* SCREEN STYLES (for preview) */
            @media screen {
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                background: #f8fafc;
              }
              
              .graphs-container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              
              .graphs-header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #4f46e5;
                padding-bottom: 20px;
              }
              
              .graphs-header h1 {
                margin: 0;
                color: #4f46e5;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 800;
              }
              
              .graphs-header h2 {
                margin: 10px 0 5px 0;
                color: #666;
                font-size: 18px;
                font-weight: normal;
              }
              
              .graphs-agency-info {
                text-align: center;
                margin-bottom: 30px;
                padding: 15px;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
              }
              
              .graphs-agency-info h3 {
                margin: 0 0 10px 0;
                color: #4f46e5;
                font-size: 20px;
              }
              
              .graphs-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
                margin-bottom: 40px;
              }
              
              .graph-container {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                min-height: 400px;
                display: flex;
                flex-direction: column;
              }
              
              .graph-title {
                font-size: 18px;
                font-weight: 600;
                text-align: center;
                margin-bottom: 15px;
                color: #4f46e5;
                padding-bottom: 10px;
                border-bottom: 1px solid #e2e8f0;
              }
              
              .graph-content {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              
              .chart-image {
                max-width: 100%;
                max-height: 300px;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              
              .no-image {
                text-align: center;
                color: #666;
                font-size: 14px;
                padding: 40px;
                border: 2px dashed #e2e8f0;
                border-radius: 8px;
              }
              
              .stats-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
              }
              
              .stats-table th {
                background: #f8fafc;
                padding: 12px;
                border: 1px solid #e2e8f0;
                text-align: left;
                font-weight: 600;
              }
              
              .stats-table td {
                padding: 12px;
                border: 1px solid #e2e8f0;
              }
              
              .stats-table tr:nth-child(even) {
                background: #f8fafc;
              }
              
              .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 24px;
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
                z-index: 1000;
              }
              
              .print-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
              }
              
              .graphs-footer {
                margin-top: 40px;
                text-align: center;
                color: #64748b;
                font-size: 12px;
                border-top: 1px solid #e2e8f0;
                padding-top: 20px;
                font-style: italic;
              }
              
              @media (max-width: 768px) {
                .graphs-grid {
                  grid-template-columns: 1fr;
                }
                
                .graph-container {
                  min-height: 350px;
                }
              }
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Graphs
          </button>
          
          <div class="graphs-container">
            <div class="graphs-header">
              <h1>ANALYTICS GRAPHS REPORT</h1>
              <h2>Visual Performance Analysis</h2>
            </div>
            
            <div class="graphs-agency-info">
              <h3>${reportData.agencyName}</h3>
              <p>Graphs Report for ${reportData.dateRange} • Generated on ${reportData.reportDate}</p>
            </div>
            
            <div class="graphs-grid">
              <!-- Sales Performance Graph -->
              <div class="graph-container">
                <div class="graph-title">Sales Performance</div>
                <div class="graph-content">
                  ${reportData.chartImages?.sales 
                    ? `<img src="${reportData.chartImages.sales}" alt="Sales Performance Chart" class="chart-image" />`
                    : `<div>
                        <div class="no-image">Chart not available. Here's the data:</div>
                        <table class="stats-table">
                          <thead>
                            <tr>
                              <th>Metric</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${(reportData.graphData?.salesData || []).map(item => `
                              <tr>
                                <td>${item.name}</td>
                                <td>${formatPKR(item.amount).replace('₨ ', 'PKR ')}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>`
                  }
                </div>
              </div>
              
              <!-- Payment Breakdown Graph -->
              <div class="graph-container">
                <div class="graph-title">Payment Breakdown</div>
                <div class="graph-content">
                  ${reportData.chartImages?.payment 
                    ? `<img src="${reportData.chartImages.payment}" alt="Payment Breakdown Chart" class="chart-image" />`
                    : `<div>
                        <div class="no-image">Chart not available. Here's the data:</div>
                        <table class="stats-table">
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${(reportData.graphData?.paymentData || []).map(item => `
                              <tr>
                                <td>${item.name}</td>
                                <td>${item.value}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>`
                  }
                </div>
              </div>
              
              <!-- Booking Status Graph -->
              <div class="graph-container">
                <div class="graph-title">Booking Status Distribution</div>
                <div class="graph-content">
                  ${reportData.chartImages?.booking 
                    ? `<img src="${reportData.chartImages.booking}" alt="Booking Status Chart" class="chart-image" />`
                    : `<div>
                        <div class="no-image">Chart not available. Here's the data:</div>
                        <table class="stats-table">
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${(reportData.graphData?.bookingData || []).map(item => `
                              <tr>
                                <td>${item.name}</td>
                                <td>${item.value}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>`
                  }
                </div>
              </div>
              
              <!-- Agent Performance Graph -->
              <div class="graph-container">
                <div class="graph-title">Agent Performance</div>
                <div class="graph-content">
                  ${reportData.chartImages?.agent 
                    ? `<img src="${reportData.chartImages.agent}" alt="Agent Performance Chart" class="chart-image" />`
                    : `<div>
                        <div class="no-image">Chart not available. Here's the data:</div>
                        <table class="stats-table">
                          <thead>
                            <tr>
                              <th>Agent</th>
                              <th>Bookings</th>
                              <th>Customers</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${(reportData.graphData?.agentData || []).map(agent => `
                              <tr>
                                <td>${agent.name}</td>
                                <td>${agent.bookings}</td>
                                <td>${agent.customers}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>`
                  }
                </div>
              </div>
            </div>
            
            <div class="graphs-footer">
              <p>Generated by ${reportData.agencyName} Analytics System • Report ID: GRP-${Date.now().toString().slice(-8)}</p>
              <p>Report generated on ${reportData.reportDate} at ${reportData.reportTime}</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              // Auto-print after 1 second
              setTimeout(() => {
                window.print();
              }, 1000);
            };
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      
      toast.dismiss();
      toast.success('Graphs report generated. Printing automatically...');
    } catch (error) {
      console.error('Error generating graphs report:', error);
      toast.dismiss();
      toast.error('Failed to generate graphs report');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const amountStats = [
    {
      name: 'Total Sales',
      value: formatPKR(analytics?.amounts?.total_sales || 0),
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Total Received',
      value: formatPKR(analytics?.amounts?.total_received || 0),
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Total Remaining',
      value: formatPKR(analytics?.amounts?.total_remaining || 0),
      icon: CreditCard,
      color: 'from-red-500 to-red-600',
    },
    {
      name: 'Total Profit',
      value: formatPKR(analytics?.amounts?.total_profit || 0),
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  const graphData = getGraphData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Financial and operational insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={generateAnalyticsReport}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Report
          </button>
          
          <button
            onClick={generateGraphsReport}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Print Graphs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Date Range Filters</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="lifetime">Lifetime</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {range === 'custom' && (
            <>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Report for: <span className="font-medium text-gray-900 ml-2">{formatDateRange()}</span>
        </div>
      </div>

      {/* Financial Overview Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('financial')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Sales, revenue, and profit metrics</p>
            </div>
          </div>
          {expandedSections.financial ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.financial && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {amountStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Payment Breakdown Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('payments')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-3">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">Payment Breakdown</h2>
              <p className="text-sm text-gray-500 mt-1">Payment status distribution</p>
            </div>
          </div>
          {expandedSections.payments ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.payments && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid Bookings</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {analytics?.payment_breakdown?.paid || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Half Paid Bookings</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">
                      {analytics?.payment_breakdown?.half_paid || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-red-50 border border-red-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {analytics?.payment_breakdown?.pending || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <CreditCard className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Status Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('bookings')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">Booking Status</h2>
              <p className="text-sm text-gray-500 mt-1">Booking status distribution</p>
            </div>
          </div>
          {expandedSections.bookings ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.bookings && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-xl p-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {analytics?.booking_status_breakdown?.confirmed || 0}
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">
                    {analytics?.booking_status_breakdown?.pending || 0}
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-red-50 border border-red-200 rounded-xl p-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {analytics?.booking_status_breakdown?.rejected || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {analytics?.total_bookings || 0}
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-yellow-50 border border-yellow-200 rounded-xl p-5">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {analytics?.total_customers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agent Performance Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('agents')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mr-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">Agent Performance</h2>
              <p className="text-sm text-gray-500 mt-1">Agent-wise performance metrics</p>
            </div>
          </div>
          {expandedSections.agents ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.agents && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Bookings Tracker</h3>
                <div className="space-y-3">
                  {analytics?.agent_bookings_tracker?.length > 0 ? (
                    analytics.agent_bookings_tracker.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <span className="font-medium text-gray-900">
                          {agent.created_by__username || 'Unknown Agent'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {agent.count} bookings
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No agent data available</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Customers Tracker</h3>
                <div className="space-y-3">
                  {analytics?.agent_customers_tracker?.length > 0 ? (
                    analytics.agent_customers_tracker.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <span className="font-medium text-gray-900">
                          {agent.created_by__username || 'Unknown Agent'}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {agent.unique_clients} customers
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No agent data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Graphs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('graphs')}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">Visual Analytics</h2>
              <p className="text-sm text-gray-500 mt-1">Interactive charts and graphs</p>
            </div>
          </div>
          {expandedSections.graphs ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.graphs && graphData && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Sales Performance Graph */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Sales Performance
                </h3>
                <div className="h-64" ref={salesChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData.salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value) => [formatPKR(value), 'Amount']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="amount" 
                        name="Amount (PKR)" 
                        fill="#4f46e5" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Breakdown Pie Chart */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-500" />
                  Payment Breakdown
                </h3>
                <div className="h-64" ref={paymentChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={graphData.paymentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {graphData.paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Count']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Booking Status Pie Chart */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-500" />
                  Booking Status Distribution
                </h3>
                <div className="h-64" ref={bookingChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={graphData.bookingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {graphData.bookingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Count']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Agent Performance Bar Chart */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-amber-500" />
                  Agent Performance
                </h3>
                <div className="h-64" ref={agentChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData.agentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="bookings" 
                        name="Bookings" 
                        fill="#4f46e5" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="customers" 
                        name="Customers" 
                        fill="#10b981" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
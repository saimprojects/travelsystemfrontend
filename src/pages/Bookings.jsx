import { useEffect, useState, useRef } from "react";
import {
  bookingsAPI,
  clientsAPI,
  servicesAPI,
  agencyAPI,
} from "../services/api";
import {
  Plus,
  Edit,
  DollarSign,
  Search,
  AlertCircle,
  Calendar,
  Clock,
  Briefcase,
  X,
  Save,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Printer,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingIdSearch, setBookingIdSearch] = useState("");
  const [bookingIdQuery, setBookingIdQuery] = useState("");
  const [missingOnly, setMissingOnly] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [printingBooking, setPrintingBooking] = useState(null);

  const searchInputRef = useRef(null);
  const bookingIdInputRef = useRef(null);

  const [datesSummary, setDatesSummary] = useState({
    missing_any: 0,
    missing_arrival: 0,
    missing_departure: 0,
  });

  const [formData, setFormData] = useState({
    client: "",
    service: "",
    discount: "0",
    booking_status: "pending",
    paid_amount: "0",
    payment_method: "",
    arrival_date: "",
    departure_date: "",
    notes: "",
  });

  const [paymentData, setPaymentData] = useState({
    paid_amount: "",
    payment_method: "",
    notes: "",
  });

  // Initial data fetch (without any search)
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch when search queries change
  useEffect(() => {
    if (searchQuery || bookingIdQuery || missingOnly) {
      fetchData();
    }
  }, [searchQuery, bookingIdQuery, missingOnly]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch main data in parallel
      const [bookingsRes, clientsRes, servicesRes, summaryRes] =
        await Promise.all([
          bookingsAPI.getBookings({}),
          clientsAPI.getClients(),
          servicesAPI.getServices(),
          bookingsAPI.getDatesSummary(),
        ]);

      // Set main data immediately
      setBookings(bookingsRes.data.results || bookingsRes.data || []);
      setClients(clientsRes.data.results || clientsRes.data || []);
      setServices(servicesRes.data.results || servicesRes.data || []);
      setDatesSummary(
        summaryRes?.data || {
          missing_any: 0,
          missing_arrival: 0,
          missing_departure: 0,
        },
      );

      // Fetch agency data separately (with fallback)
      try {
        const agencyRes = await agencyAPI.getAgency();
        setAgency(agencyRes.data);
      } catch (agencyError) {
        console.warn("⚠️ Could not fetch agency data:", agencyError.message);
        const defaultAgency = {
          name: "Travel Agency",
          phone_number: "+92 300 1234567",
          email: "info@travelagency.com",
          address: "Karachi, Pakistan",
          status: "active",
        };
        setAgency(defaultAgency);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      let errorMessage = "Failed to load bookings data. ";
      if (error.message.includes("Network error")) {
        errorMessage += "Please check your internet connection.";
      } else if (error.message.includes("Session expired")) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else if (error.message.includes("permission")) {
        errorMessage = "You do not have permission to view bookings.";
      } else {
        errorMessage += error.message;
      }
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setSearchLoading(true);
      const bookingsParams = {
        search: searchQuery,
        booking_id: bookingIdQuery,
        ...(missingOnly ? { missing_dates: 1 } : {}),
      };

      const bookingsRes = await bookingsAPI.getBookings(bookingsParams);
      setBookings(bookingsRes.data.results || bookingsRes.data || []);
    } catch (error) {
      console.error("❌ Error searching bookings:", error);
      toast.error("Failed to search bookings", { duration: 3000 });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchQuery(searchTerm.trim());
      setSearchLoading(true);
    }
  };

  const handleBookingIdKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setBookingIdQuery(bookingIdSearch.trim());
      setSearchLoading(true);
    }
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTerm.trim());
    setSearchLoading(true);
  };

  const handleBookingIdSearchClick = () => {
    setBookingIdQuery(bookingIdSearch.trim());
    setSearchLoading(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearBookingIdSearch = () => {
    setBookingIdSearch("");
    setBookingIdQuery("");
    if (bookingIdInputRef.current) {
      bookingIdInputRef.current.focus();
    }
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSearchQuery("");
    setBookingIdSearch("");
    setBookingIdQuery("");
    setMissingOnly(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    fetchInitialData();
  };

  const formatPKR = (amount) => {
    if (!amount && amount !== 0) return "₨ 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `₨ ${num.toLocaleString("en-PK")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatInvoiceDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const generateInvoiceData = (booking) => {
    const client = clients.find((c) => c.id === booking.client);
    const service = services.find((s) => s.id === booking.service);

    const originalPrice =
      service?.service_total_price ||
      booking.service_details?.service_total_price ||
      booking.total_amount ||
      0;
    const discount = booking.discount || 0;
    const finalPrice = originalPrice - discount;
    const paid = booking.paid_amount || 0;
    const remaining = finalPrice - paid;

    return {
      bookingId: booking.id,
      invoiceNo: `INV-${String(booking.id).padStart(5, "0")}`,
      invoiceDate: formatInvoiceDate(booking.created_at),

      clientName: client?.name || booking.client_details?.name || "N/A",
      clientPhone:
        client?.phone_number || booking.client_details?.phone_number || "",
      clientAltPhone: client?.alternative_phone_number || "",
      clientEmail: client?.email || "",
      clientAddress: client?.address || "",

      agencyName: agency?.name || "Your Agency Name",
      agencyPhone: agency?.phone_number || "",
      agencyEmail: agency?.email || "",
      agencyAddress: agency?.address || "",

      serviceName:
        service?.service_name || booking.service_details?.service_name || "N/A",
      serviceQty: 1,
      servicePrice: originalPrice,

      paymentStatus:
        booking.payment_status === "PAID"
          ? "PAID"
          : booking.payment_status === "HALF_PAID"
            ? "HALF PAID"
            : "PENDING",

      departureDate: formatInvoiceDate(booking.departure_date),
      arrivalDate: formatInvoiceDate(booking.arrival_date),

      subTotal: originalPrice,
      discount: discount,
      total: finalPrice,
      paidAmount: paid,
      remainingAmount: remaining,

      additionalServices: [],
    };
  };

  const printInvoice = (booking) => {
    setPrintingBooking(booking);

    const invoiceData = generateInvoiceData(booking);

    const printWindow = window.open("", "_blank");

    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice #${invoiceData.invoiceNo}</title>
        <style>
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
              font-size: 10px !important;
              line-height: 1.2 !important;
              font-family: Arial, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            .invoice-container {
              max-width: 100% !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            
            .invoice-header {
              text-align: center;
              margin-bottom: 8mm !important;
              padding-bottom: 4mm !important;
              border-bottom: 1px solid #000 !important;
            }
            
            .invoice-header h1 {
              margin: 2mm 0 !important;
              font-size: 20px !important;
              letter-spacing: 1px !important;
            }
            
            .invoice-header h2 {
              margin: 1mm 0 !important;
              font-size: 12px !important;
              font-weight: normal !important;
            }
            
            .agency-info {
              text-align: center;
              margin-bottom: 6mm !important;
              padding-bottom: 3mm !important;
              border-bottom: 1px solid #ddd !important;
            }
            
            .agency-info h3 {
              margin: 2mm 0 !important;
              font-size: 14px !important;
            }
            
            .agency-info p {
              margin: 1mm 0 !important;
              font-size: 10px !important;
            }
            
            .details-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 6mm !important;
              margin-bottom: 6mm !important;
            }
            
            .detail-section h3 {
              margin: 0 0 2mm !important;
              font-size: 12px !important;
              padding-bottom: 1mm !important;
              border-bottom: 1px solid #eee !important;
            }
            
            .detail-content {
              font-size: 10px !important;
              line-height: 1.3 !important;
            }
            
            .detail-item {
              margin-bottom: 1mm !important;
            }
            
            .invoice-table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 4mm 0 !important;
              font-size: 10px !important;
            }
            
            .invoice-table th {
              background: #f5f5f5 !important;
              padding: 3mm 2mm !important;
              border: 0.5px solid #ddd !important;
              font-weight: 600 !important;
              text-align: left !important;
            }
            
            .invoice-table td {
              padding: 2.5mm 2mm !important;
              border: 0.5px solid #ddd !important;
              text-align: left !important;
            }
            
            .amounts-section {
              margin-top: 4mm !important;
              background: #f9f9f9 !important;
              padding: 3mm !important;
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
            }
            
            .amount-row {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              margin-bottom: 1.5mm !important;
              padding-bottom: 1.5mm !important;
              border-bottom: 0.5px dashed #ddd !important;
            }
            
            .amount-row:last-child {
              border-bottom: none !important;
            }
            
            .amount-label {
              font-size: 10px !important;
              font-weight: 500 !important;
            }
            
            .amount-value {
              font-size: 10px !important;
              font-weight: 600 !important;
            }
            
            .total-row {
              border-top: 1px solid #000 !important;
              padding-top: 2mm !important;
              margin-top: 2mm !important;
            }
            
            .total-label {
              font-size: 12px !important;
              font-weight: 700 !important;
            }
            
            .total-value {
              font-size: 14px !important;
              font-weight: 700 !important;
            }
            
            .payment-details {
              margin-top: 4mm !important;
              background: #f0f7ff !important;
              padding: 3mm !important;
              border: 0.5px solid #ddd !important;
              border-radius: 2px !important;
            }
            
            .payment-details h3 {
              margin: 0 0 3mm !important;
              font-size: 12px !important;
              text-align: center !important;
              padding-bottom: 1mm !important;
              border-bottom: 0.5px solid #ddd !important;
            }
            
            .payment-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 3mm !important;
            }
            
            .payment-item {
              display: flex !important;
              justify-content: space-between !important;
              padding: 1.5mm 0 !important;
              border-bottom: 0.5px solid #e5e5e5 !important;
            }
            
            .payment-item:last-child {
              border-bottom: none !important;
            }
            
            .payment-amount {
              font-weight: 700 !important;
              font-size: 10px !important;
            }
            
            .paid-amount {
              color: #059669 !important;
            }
            
            .due-amount {
              color: #dc2626 !important;
            }
            
            .status-badge {
              display: inline-block !important;
              padding: 1mm 2mm !important;
              border-radius: 10px !important;
              font-size: 8px !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.3px !important;
            }
            
            .status-paid {
              background: #d1fae5 !important;
              color: #065f46 !important;
            }
            
            .status-half {
              background: #fef3c7 !important;
              color: #92400e !important;
            }
            
            .status-pending {
              background: #fee2e2 !important;
              color: #991b1b !important;
            }
            
            .note-box {
              margin-top: 3mm !important;
              padding: 2mm !important;
              background: #fff7ed !important;
              border: 0.5px solid #fed7aa !important;
              border-radius: 2px !important;
              text-align: center !important;
              font-size: 9px !important;
            }
            
            .footer {
              margin-top: 6mm !important;
              text-align: center !important;
              color: #666 !important;
              font-size: 8px !important;
              border-top: 0.5px solid #ddd !important;
              padding-top: 2mm !important;
            }
            
            .action-buttons,
            .print-button,
            .share-button,
            .whatsapp-button {
              display: none !important;
            }
          }
          
          @media screen {
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              background: #f5f5f5;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #eee;
              padding: 30px;
              background: white;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .invoice-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 20px;
            }
            
            .invoice-header h1 {
              margin: 0;
              color: #4f46e5;
              font-size: 28px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .invoice-header h2 {
              margin: 5px 0 0 0;
              color: #666;
              font-size: 16px;
              font-weight: normal;
            }
            
            .agency-info {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            
            .agency-info h3 {
              margin: 0 0 10px 0;
              color: #4f46e5;
              font-size: 18px;
            }
            
            .agency-info p {
              margin: 4px 0;
              color: #666;
              font-size: 14px;
            }
            
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            
            .detail-section h3 {
              margin: 0 0 10px 0;
              color: #4f46e5;
              font-size: 16px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            
            .detail-content {
              font-size: 14px;
              line-height: 1.6;
            }
            
            .detail-item {
              margin-bottom: 5px;
            }
            
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            
            .invoice-table th {
              background: #f8fafc;
              padding: 12px;
              text-align: left;
              border: 1px solid #e2e8f0;
              font-weight: 600;
              color: #4f46e5;
            }
            
            .invoice-table td {
              padding: 12px;
              border: 1px solid #e2e8f0;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .status-paid {
              background: #d1fae5;
              color: #065f46;
            }
            
            .status-half {
              background: #fef3c7;
              color: #92400e;
            }
            
            .status-pending {
              background: #fee2e2;
              color: #991b1b;
            }
            
            .amounts-section {
              margin-top: 30px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .amount-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px dashed #e2e8f0;
            }
            
            .amount-label {
              color: #666;
              font-size: 15px;
              font-weight: 500;
            }
            
            .amount-value {
              font-weight: 600;
              font-size: 15px;
            }
            
            .total-row {
              border-top: 2px solid #e2e8f0;
              padding-top: 15px;
              margin-top: 15px;
              border-bottom: none;
            }
            
            .total-label {
              color: #4f46e5;
              font-size: 18px;
              font-weight: 700;
            }
            
            .total-value {
              color: #4f46e5;
              font-size: 24px;
              font-weight: 700;
            }
            
            .payment-details {
              margin-top: 30px;
              padding: 20px;
              background: #f0f7ff;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .payment-details h3 {
              margin: 0 0 20px 0;
              color: #4f46e5;
              font-size: 18px;
              text-align: center;
            }
            
            .payment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            
            .payment-item {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .payment-amount {
              font-weight: 700;
              font-size: 16px;
            }
            
            .paid-amount {
              color: #059669;
            }
            
            .due-amount {
              color: #dc2626;
            }
            
            .action-buttons {
              position: fixed;
              top: 20px;
              right: 20px;
              display: flex;
              gap: 10px;
              z-index: 1000;
            }
            
            .action-button {
              padding: 10px 20px;
              background: #4f46e5;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              transition: background 0.3s;
              font-size: 14px;
            }
            
            .action-button:hover {
              background: #4338ca;
            }
            
            .share-button {
              background: #3b82f6;
            }
            
            .share-button:hover {
              background: #2563eb;
            }
            
            .whatsapp-button {
              background: #25D366;
            }
            
            .whatsapp-button:hover {
              background: #128C7E;
            }
            
            .note-box {
              margin-top: 20px;
              padding: 15px;
              background: #fef3c7;
              border: 1px solid #fbbf24;
              border-radius: 8px;
              text-align: center;
              font-size: 14px;
            }
            
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="action-buttons no-print">
          <button class="action-button" onclick="window.print()">
            🖨️ Print Invoice
          </button>
          <button class="action-button share-button" onclick="downloadAsPDF()">
            📄 Download PDF
          </button>
          <button class="action-button whatsapp-button" onclick="shareOnWhatsApp()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M20.52 3.49C18.18 1.14 15.09 0 12 0 5.37 0 0 5.37 0 12c0 2.04.5 4.08 1.51 5.92L0 24l6.33-1.55c1.77.97 3.77 1.55 5.92 1.55 6.63 0 12-5.37 12-12 0-3.09-1.14-6.18-3.49-8.51zM12 21.6c-1.94 0-3.83-.55-5.46-1.58l-.39-.23-3.96 1.03 1.06-3.84-.25-.39A9.57 9.57 0 0 1 2.4 12c0-5.3 4.3-9.6 9.6-9.6 2.56 0 5.12.98 7.07 2.93s2.93 4.51 2.93 7.07c0 5.3-4.3 9.6-9.6 9.6zm5.26-7.18c-.15-.08-1.23-.61-1.42-.67-.19-.07-.33-.1-.47.1-.14.19-.55.67-.68.81-.13.14-.26.16-.49.05-.23-.11-.97-.36-1.84-1.15-.68-.61-1.14-1.36-1.27-1.59-.13-.23-.01-.36.1-.47.1-.1.23-.26.34-.39.12-.13.16-.23.24-.39.08-.16.04-.3-.02-.42-.06-.12-.47-1.14-.64-1.56-.17-.42-.35-.36-.47-.37-.12-.01-.26-.01-.39-.01s-.36.05-.55.26c-.19.21-.73.71-.73 1.73s.75 2.01.85 2.15c.1.14 1.47 2.25 3.58 3.15.49.21.87.34 1.17.43.49.16.93.14 1.28.08.39-.06 1.23-.5 1.4-.99.17-.48.17-.9.12-.99-.05-.09-.2-.14-.35-.22z"/>
            </svg>
            WhatsApp
          </button>
        </div>
        
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>INVOICE</h1>
            <h2>Booking Receipt</h2>
          </div>
          
          <div class="agency-info">
            <h3>${invoiceData.agencyName}</h3>
            ${invoiceData.agencyPhone ? `<p>📞 ${invoiceData.agencyPhone}</p>` : ""}
            ${invoiceData.agencyEmail ? `<p>✉️ ${invoiceData.agencyEmail}</p>` : ""}
            ${invoiceData.agencyAddress ? `<p>📍 ${invoiceData.agencyAddress}</p>` : ""}
          </div>
          
          <div class="details-grid">
            <div class="detail-section">
              <h3>BILL TO</h3>
              <div class="detail-content">
                <div class="detail-item"><strong>${invoiceData.clientName}</strong></div>
                ${invoiceData.clientPhone ? `<div class="detail-item">📞 ${invoiceData.clientPhone}</div>` : ""}
                ${invoiceData.clientAltPhone ? `<div class="detail-item">📞 ${invoiceData.clientAltPhone} (Alt)</div>` : ""}
                ${invoiceData.clientEmail ? `<div class="detail-item">✉️ ${invoiceData.clientEmail}</div>` : ""}
                ${invoiceData.clientAddress ? `<div class="detail-item">📍 ${invoiceData.clientAddress}</div>` : ""}
              </div>
            </div>
            
            <div class="detail-section">
              <h3>INVOICE DETAILS</h3>
              <div class="detail-content">
                <div class="detail-item"><strong>Booking ID:</strong> ${invoiceData.bookingId}</div>
                <div class="detail-item"><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</div>
                <div class="detail-item"><strong>Date:</strong> ${invoiceData.invoiceDate}</div>
                <div class="detail-item">
                  <strong>Payment Status:</strong> 
                  <span class="status-badge status-${invoiceData.paymentStatus.toLowerCase().replace(" ", "")}">
                    ${invoiceData.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>SERVICE</th>
                <th>QTY</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoiceData.serviceName}</td>
                <td>${invoiceData.serviceQty}</td>
                <td>${formatPKR(invoiceData.servicePrice).replace("₨ ", "PKR ")}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="details-grid">
            <div class="detail-section">
              <h3>BOOKING DATES</h3>
              <div class="detail-content">
                ${invoiceData.departureDate ? `<div class="detail-item"><strong>Departure:</strong> ${invoiceData.departureDate}</div>` : ""}
                ${invoiceData.arrivalDate ? `<div class="detail-item"><strong>Arrival:</strong> ${invoiceData.arrivalDate}</div>` : ""}
              </div>
            </div>
          </div>
          
          <div class="amounts-section">
            <div class="amount-row">
              <span class="amount-label">Service Price:</span>
              <span class="amount-value">${formatPKR(invoiceData.servicePrice).replace("₨ ", "PKR ")}</span>
            </div>
            
            ${
              invoiceData.discount > 0
                ? `
              <div class="amount-row">
                <span class="amount-label">Discount:</span>
                <span class="amount-value">- ${formatPKR(invoiceData.discount).replace("₨ ", "PKR ")}</span>
              </div>
            `
                : ""
            }
            
            <div class="amount-row total-row">
              <span class="total-label">TOTAL AMOUNT:</span>
              <span class="total-value">${formatPKR(invoiceData.total).replace("₨ ", "PKR ")}</span>
            </div>
          </div>
          
          <div class="payment-details">
            <h3>PAYMENT SUMMARY</h3>
            <div class="payment-grid">
              <div>
                <div class="payment-item">
                  <span>Total Amount:</span>
                  <span class="payment-amount">${formatPKR(invoiceData.total).replace("₨ ", "PKR ")}</span>
                </div>
                <div class="payment-item">
                  <span>Amount Paid:</span>
                  <span class="payment-amount paid-amount">${formatPKR(invoiceData.paidAmount).replace("₨ ", "PKR ")}</span>
                </div>
                <div class="payment-item">
                  <span>Remaining Due:</span>
                  <span class="payment-amount due-amount">${formatPKR(invoiceData.remainingAmount).replace("₨ ", "PKR ")}</span>
                </div>
              </div>
              <div>
                <div class="payment-item">
                  <span>Payment Status:</span>
                  <span class="status-badge status-${invoiceData.paymentStatus.toLowerCase().replace(" ", "")}">
                    ${invoiceData.paymentStatus}
                  </span>
                </div>
                <div class="payment-item">
                  <span>Invoice Date:</span>
                  <span>${invoiceData.invoiceDate}</span>
                </div>
                ${
                  invoiceData.remainingAmount > 0
                    ? `
                <div class="payment-item">
                  <span>Payment Due:</span>
                  <span>Before Departure</span>
                </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
          
          ${
            invoiceData.remainingAmount > 0
              ? `
          <div class="note-box">
            <strong>Note:</strong> Please pay the remaining amount of <strong>${formatPKR(invoiceData.remainingAmount).replace("₨ ", "PKR ")}</strong> before departure.
          </div>
          `
              : `
          <div class="note-box" style="background: #d1fae5; border-color: #10b981;">
            <strong>Note:</strong> Payment completed. Thank you for your business!
          </div>
          `
          }
          
          <div class="footer">
            <p>Thank you for choosing ${invoiceData.agencyName}! For any queries, please contact us.</p>
            <p>Invoice generated on ${new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
        
        <script>
          function downloadAsPDF() {
            window.print();
          }
          
          function shareOnWhatsApp() {
            const message = \`*Invoice #${invoiceData.invoiceNo}*\\n\\n*Client:* ${invoiceData.clientName}\\n*Service Price:* ${formatPKR(invoiceData.servicePrice).replace("₨ ", "PKR ")}\\n*Discount:* ${formatPKR(invoiceData.discount).replace("₨ ", "PKR ")}\\n*Total Amount:* ${formatPKR(invoiceData.total).replace("₨ ", "PKR ")}\\n*Amount Paid:* ${formatPKR(invoiceData.paidAmount).replace("₨ ", "PKR ")}\\n*Remaining Due:* ${formatPKR(invoiceData.remainingAmount).replace("₨ ", "PKR ")}\\n*Status:* ${invoiceData.paymentStatus}\\n\\nThank you for choosing ${invoiceData.agencyName}!\`;
            const whatsappUrl = \`https://wa.me/?text=\${encodeURIComponent(message)}\`;
            window.open(whatsappUrl, '_blank');
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();

    toast.success(
      "Invoice opened in new window. Use buttons to print or share.",
    );
  };

  const buildBookingPayload = () => {
    const payload = { ...formData };

    payload.discount = payload.discount === "" ? "0.00" : payload.discount;
    payload.paid_amount =
      payload.paid_amount === "" ? "0.00" : payload.paid_amount;
    payload.arrival_date = payload.arrival_date || null;
    payload.departure_date = payload.departure_date || null;
    payload.payment_method = payload.payment_method?.trim() || null;

    payload.notes =
      typeof payload.notes === "string"
        ? payload.notes.trim()
        : payload.notes || null;

    return payload;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.client) {
      errors.client = "Please select a client";
    }

    if (!formData.service) {
      errors.service = "Please select a service";
    }

    const maxDiscount = getMaxDiscount();
    if (parseFloat(formData.discount) > parseFloat(maxDiscount)) {
      errors.discount = `Discount cannot exceed ${formatPKR(maxDiscount)}`;
    }

    if (formData.arrival_date && formData.departure_date) {
      const departure = new Date(formData.departure_date);
      const arrival = new Date(formData.arrival_date);

      const departureDate = new Date(
        departure.getFullYear(),
        departure.getMonth(),
        departure.getDate(),
      );
      const arrivalDate = new Date(
        arrival.getFullYear(),
        arrival.getMonth(),
        arrival.getDate(),
      );

      if (arrivalDate < departureDate) {
        errors.arrival_date = "Return date cannot be before travel date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildBookingPayload();

      if (editingBooking) {
        await bookingsAPI.updateBooking(editingBooking.id, payload);
        toast.success("Booking updated successfully");
      } else {
        await bookingsAPI.createBooking(payload);
        toast.success("Booking created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (error) {
      console.error("Error saving booking:", error);
      const errorMsg = error.response?.data?.detail || "Failed to save booking";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();

    setPaymentSubmitting(true);
    try {
      const payload = {
        ...paymentData,
        paid_amount: paymentData.paid_amount || "0.00",
        payment_method: paymentData.payment_method?.trim() || null,
        notes:
          typeof paymentData.notes === "string"
            ? paymentData.notes.trim()
            : paymentData.notes || null,
      };

      await bookingsAPI.updatePayment(paymentBooking.id, payload);
      toast.success("Payment updated successfully");

      setShowPaymentModal(false);
      setPaymentBooking(null);
      setPaymentData({ paid_amount: "", payment_method: "", notes: "" });
      fetchInitialData();
    } catch (error) {
      console.error("Error updating payment:", error);
      const errorMsg =
        error.response?.data?.detail || "Failed to update payment";
      toast.error(errorMsg);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setFormData({
      client: booking.client,
      service: booking.service,
      discount: booking.discount,
      booking_status: booking.booking_status,
      paid_amount: booking.paid_amount,
      payment_method: booking.payment_method || "",
      arrival_date: booking.arrival_date || "",
      departure_date: booking.departure_date || "",
      notes: booking.notes || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openPaymentModal = (booking) => {
    setPaymentBooking(booking);
    setPaymentData({
      paid_amount: booking.paid_amount,
      payment_method: booking.payment_method || "",
      notes: "",
    });
    setShowPaymentModal(true);
  };

  const resetForm = () => {
    setFormData({
      client: "",
      service: "",
      discount: "0",
      booking_status: "pending",
      paid_amount: "0",
      payment_method: "",
      arrival_date: "",
      departure_date: "",
      notes: "",
    });
    setFormErrors({});
    setEditingBooking(null);
    setSubmitting(false);
  };

  const getMaxDiscount = () => {
    if (!formData.service) return 0;
    const selectedService = services.find(
      (s) => s.id === parseInt(formData.service),
    );
    if (!selectedService) return 0;
    return (parseFloat(selectedService.service_profit) * 0.5).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 animate-in fade-in-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-in slide-in-from-left-4 duration-500">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
            Manage client bookings and payments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={() => {
              setMissingOnly((prev) => !prev);
              if (!missingOnly) {
                setSearchLoading(true);
              }
            }}
            className={`flex items-center px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              missingOnly
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {missingOnly ? "Showing Missing Dates" : "Filter Missing Dates"}
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Booking
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 animate-in fade-in-50 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {bookings.length}
              </p>
            </div>
            <Briefcase className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 animate-in fade-in-50 duration-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Confirmed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {
                  bookings.filter((b) => b.booking_status === "confirmed")
                    .length
                }
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 animate-in fade-in-50 duration-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Pending</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {bookings.filter((b) => b.booking_status === "pending").length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-amber-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 animate-in fade-in-50 duration-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Missing Dates</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {datesSummary.missing_any}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search Section - Two Search Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in-50 duration-500">
        {/* General Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by Client Name, Phone, Service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSearchClick}
                disabled={searchLoading}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-1" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Press Enter or click Search button to search
          </p>
        </div>

        {/* Booking ID Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={bookingIdInputRef}
              type="text"
              placeholder="Search by Booking ID (e.g., 123)"
              value={bookingIdSearch}
              onChange={(e) => setBookingIdSearch(e.target.value)}
              onKeyPress={handleBookingIdKeyPress}
              className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {bookingIdSearch && (
                <button
                  onClick={() => setBookingIdSearch("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleBookingIdSearchClick}
                disabled={searchLoading}
                className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Hash className="w-4 h-4 mr-1" />
                    Find Booking
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Press Enter or click Find button to search
          </p>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || bookingIdQuery || missingOnly) && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Active Filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <Search className="w-3 h-3 mr-1" />
                    Search: "{searchQuery}"
                    <button
                      onClick={handleClearSearch}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {bookingIdQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    <Hash className="w-3 h-3 mr-1" />
                    Booking ID: {bookingIdQuery}
                    <button
                      onClick={handleClearBookingIdSearch}
                      className="ml-2 text-purple-500 hover:text-purple-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {missingOnly && (
                  <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    <Filter className="w-3 h-3 mr-1" />
                    Missing Dates Only
                    <button
                      onClick={() => setMissingOnly(false)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleClearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </button>
          </div>
          <p className="mt-2 text-sm text-blue-600">
            Showing {bookings.length} booking(s)
          </p>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-700">
        {searchLoading ? (
          <div className="p-12 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Searching bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr className="animate-in fade-in-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50/50 transition-colors duration-150 animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{booking.id} •{" "}
                              {booking.service_details?.service_name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Created: {formatDate(booking.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-3">
                          {booking.client_details?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.client_details?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.client_details?.phone_number || ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPKR(booking.total_amount)}
                        </div>
                        <div className="flex items-center text-xs">
                          <span className="text-green-600 font-medium">
                            Paid: {formatPKR(booking.paid_amount)}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-red-600 font-medium">
                            Due: {formatPKR(booking.remaining_amount)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.booking_status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.booking_status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.booking_status === "confirmed" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {booking.booking_status === "pending" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {booking.booking_status === "rejected" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {booking.booking_status_display}
                        </span>

                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.payment_status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : booking.payment_status === "HALF_PAID"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.payment_status_display}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                          {booking.arrival_date
                            ? formatDate(booking.arrival_date)
                            : "Not set"}
                        </div>
                        <div className="flex items-center text-xs">
                          <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                          {booking.departure_date
                            ? formatDate(booking.departure_date)
                            : "Not set"}
                        </div>
                        {!booking.arrival_date || !booking.departure_date ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Missing
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(booking)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openPaymentModal(booking)}
                          className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Update Payment"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => printInvoice(booking)}
                          className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/bookings/${booking.id}`}
                          className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || bookingIdQuery || missingOnly
                ? "No bookings found"
                : "No bookings yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `No bookings found for "${searchQuery}". Try a different search term.`
                : bookingIdQuery
                  ? `No booking found with ID "${bookingIdQuery}". Please check the ID.`
                  : missingOnly
                    ? "No bookings with missing dates found"
                    : "Create your first booking to get started"}
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              {searchQuery || bookingIdQuery || missingOnly
                ? "Create New Booking"
                : "Create First Booking"}
            </button>
            {(searchQuery || bookingIdQuery || missingOnly) && (
              <button
                onClick={handleClearAllFilters}
                className="ml-3 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingBooking ? (
                      <Edit className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Plus className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingBooking ? "Edit Booking" : "Create New Booking"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingBooking
                        ? "Update booking details"
                        : "Create a new booking for a client"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <div className="relative">
                    <input
                      list="clients-list"
                      value={
                        formData.client
                          ? clients.find(
                              (c) => c.id === parseInt(formData.client),
                            )?.name || ""
                          : ""
                      }
                      onChange={(e) => {
                        const selectedClient = clients.find((c) =>
                          c.name
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()),
                        );
                        setFormData({
                          ...formData,
                          client: selectedClient ? selectedClient.id : "",
                        });
                        if (formErrors.client)
                          setFormErrors({ ...formErrors, client: "" });
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="Type client name or phone to search..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.client ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    <datalist id="clients-list">
                      {clients.map((client) => (
                        <option
                          key={client.id}
                          value={`${client.name} • ${client.phone_number}`}
                        >
                          {client.name} • {client.phone_number}
                        </option>
                      ))}
                    </datalist>
                    <div className="absolute right-3 top-3 text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  {formErrors.client && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.client}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service *
                  </label>
                  <div className="relative">
                    <input
                      list="services-list"
                      value={
                        formData.service
                          ? services.find(
                              (s) => s.id === parseInt(formData.service),
                            )?.service_name || ""
                          : ""
                      }
                      onChange={(e) => {
                        const selectedService = services.find((s) =>
                          s.service_name
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()),
                        );
                        setFormData({
                          ...formData,
                          service: selectedService ? selectedService.id : "",
                        });
                        if (formErrors.service)
                          setFormErrors({ ...formErrors, service: "" });
                      }}
                      onFocus={(e) => e.target.select()}
                      placeholder="Type service name to search..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.service
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    <datalist id="services-list">
                      {services
                        .filter((s) => s.status === "active")
                        .map((service) => (
                          <option key={service.id} value={service.service_name}>
                            {service.service_name} •{" "}
                            {formatPKR(service.service_total_price)}
                          </option>
                        ))}
                    </datalist>
                    <div className="absolute right-3 top-3 text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                  {formErrors.service && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.service}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (PKR)
                      <span className="text-xs text-gray-500 ml-2">
                        Max: {formatPKR(getMaxDiscount())}
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        ₨
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.discount}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            discount: e.target.value,
                          });
                          if (formErrors.discount)
                            setFormErrors({ ...formErrors, discount: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                          formErrors.discount
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {formErrors.discount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.discount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Status *
                    </label>
                    <select
                      value={formData.booking_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          booking_status: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Payment (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        ₨
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.paid_amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paid_amount: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="e.g., Cash, Card, Bank Transfer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Date (Departure) *
                    </label>
                    <input
                      type="date"
                      value={formData.departure_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departure_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Date (Arrival) *
                    </label>
                    <input
                      type="date"
                      value={formData.arrival_date}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          arrival_date: e.target.value,
                        });
                        if (formErrors.arrival_date)
                          setFormErrors({ ...formErrors, arrival_date: "" });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        formErrors.arrival_date
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.arrival_date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.arrival_date}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Any special instructions or notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    disabled={submitting}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingBooking ? "Update Booking" : "Create Booking"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in duration-200"></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Update Payment
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking #{paymentBooking.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentBooking(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handlePaymentUpdate} className="p-6 space-y-6">
                <div className="bg-gray-50/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPKR(paymentBooking.total_amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Already Paid:</span>
                    <span className="text-lg font-medium text-green-600">
                      {formatPKR(paymentBooking.paid_amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-medium text-gray-700">
                      Remaining:
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {formatPKR(paymentBooking.remaining_amount)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Add (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      ₨
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentData.paid_amount}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          paid_amount: e.target.value,
                        })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select>
                    <option value="">Select Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Notes
                  </label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, notes: e.target.value })
                    }
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Payment reference or notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentBooking(null);
                    }}
                    disabled={paymentSubmitting}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentSubmitting}
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;

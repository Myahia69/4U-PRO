import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, ShieldCheck, Key, Settings, Plus, Trash2, 
  Sparkles, RefreshCw, Upload, Eye, EyeOff, LayoutGrid, CheckCircle,
  ClipboardList, Printer, Coins, Truck, Search, Edit
} from 'lucide-react';
import { Product } from '../types';
import { Language, originalTranslations } from '../translations';

// Import image templates for production asset bundling
import compQuantumbookImg from '../assets/images/cyberpunk_laptop_3d_1781152107551.png';
import compDeskomegaImg from '../assets/images/cyberpunk_desktop_3d_1781152123243.png';
import phoneEnigmaImg from '../assets/images/cyberpunk_phone_3d_1781150520556.png';
import accWatchImg from '../assets/images/cyberpunk_watch_3d_1781150555203.png';
import accHeadphoneImg from '../assets/images/cyberpunk_headphones_3d_1781150538611.png';

// Beautiful templates for product images to help the user if they don't upload one
const IMAGE_TEMPLATES = [
  { name: 'Quantum Laptop', url: compQuantumbookImg },
  { name: 'Server Tower', url: compDeskomegaImg },
  { name: 'Enigma Phone', url: phoneEnigmaImg },
  { name: 'Premium Watch', url: accWatchImg },
  { name: 'Resonance buds', url: accHeadphoneImg }
];

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  productsList: Product[];
  setProductsList: React.Dispatch<React.SetStateAction<Product[]>>;
  isDarkMode: boolean;
  onResetCatalog: () => void;
}

export default function AdminPanelModal({
  isOpen,
  onClose,
  lang,
  productsList,
  setProductsList,
  isDarkMode,
  onResetCatalog
}: AdminPanelModalProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('4u_pro_admin_logged_in') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Active Tab: 'add' or 'manage' or 'password' or 'orders' or 'siteEditor'
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'password' | 'orders' | 'siteEditor'>('add');

  // Order Tracking states
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // Load orders initially and when active tab changes
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('4u_pro_orders_v1');
      if (stored) {
        try {
          setOrdersList(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      // Exiting the Admin room: Reset authentication states immediately
      setIsAuthenticated(false);
      localStorage.removeItem('4u_pro_admin_logged_in');
      setPasswordInput('');
      setPasswordError('');
      window.dispatchEvent(new Event('admin-login-changed'));
    }
  }, [isOpen, activeTab]);

  const refreshOrdersList = () => {
    const stored = localStorage.getItem('4u_pro_orders_v1');
    if (stored) {
      try {
        setOrdersList(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      setOrdersList([]);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'paid' | 'delivered') => {
    const updated = ordersList.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrdersList(updated);
    localStorage.setItem('4u_pro_orders_v1', JSON.stringify(updated));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handlePrint = () => {
    if (!selectedOrder) return;
    
    // Check if we can cleanly print via high-reliability hidden iframe protocol (perfectly bypasses browser sandbox popup blockers inside iframes!)
    let iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow || iframe.contentDocument;
    if (doc) {
      const iframeDoc = (iframe.contentWindow ? iframe.contentWindow.document : doc) as Document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>Invoice - ${selectedOrder.id}</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace, Arial, sans-serif;
                padding: 30px;
                background-color: #fff;
                color: #000;
                direction: ${lang === 'ar' ? 'rtl' : 'ltr'};
              }
              .invoice-container {
                max-width: 650px;
                margin: 0 auto;
                border: 2px solid #000;
                padding: 20px;
                background-color: #fff;
              }
              .header {
                text-align: center;
                border-bottom: 2px dashed #000;
                padding-bottom: 15px;
                margin-bottom: 15px;
              }
              .header h1 {
                margin: 0;
                font-size: 22px;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .info-grid {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                line-height: 1.6;
                margin-bottom: 15px;
                border-bottom: 1px dashed #000;
                padding-bottom: 10px;
              }
              .address-info {
                text-align: ${lang === 'ar' ? 'right' : 'left'};
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
              }
              th {
                border-bottom: 2px solid #000;
                font-size: 11px;
                text-align: ${lang === 'ar' ? 'right' : 'left'};
                padding: 6px;
              }
              td {
                border-bottom: 1px dashed #eee;
                font-size: 11px;
                padding: 8px 6px;
                text-align: ${lang === 'ar' ? 'right' : 'left'};
              }
              .total-row {
                border-top: 2px solid #000;
                font-weight: bold;
                font-size: 13px;
                text-align: ${lang === 'ar' ? 'left' : 'right'};
                padding-top: 10px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 9px;
                border-top: 1px dashed #000;
                padding-top: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              @media print {
                body { padding: 0; }
                .invoice-container { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="header">
                <h1>4U PRO CORES LAB</h1>
                <p style="margin: 3px 0; font-size:10px;">${lang === 'ar' ? 'فاتورة حجز شراء معتمدة رقمياً' : 'OFFICIAL SALES RESERVATION INVOICE'}</p>
              </div>
              <div class="info-grid">
                <div class="address-info">
                  <strong>${lang === 'ar' ? 'العميل:' : 'CLIENT:'}</strong> ${selectedOrder.customerName}<br>
                  <strong>${lang === 'ar' ? 'هاتف:' : 'PHONE:'}</strong> ${selectedOrder.customerPhone}<br>
                  <strong>${lang === 'ar' ? 'البريد:' : 'EMAIL:'}</strong> ${selectedOrder.customerEmail}<br>
                  <strong>${lang === 'ar' ? 'العنوان:' : 'ADDRESS:'}</strong> ${selectedOrder.customerAddress}
                </div>
                <div style="text-align:${lang === 'ar' ? 'left' : 'right'};">
                  <strong>${lang === 'ar' ? 'رقم الفاتورة:' : 'INVOICE NO:'}</strong> ${selectedOrder.invoiceNumber || 'INV-1000'}<br>
                  <strong>${lang === 'ar' ? 'رمز المعاملة:' : 'TX ID:'}</strong> ${selectedOrder.id}<br>
                  <strong>${lang === 'ar' ? 'التوقيت:' : 'DATE:'}</strong> ${selectedOrder.date}<br>
                  <strong>${lang === 'ar' ? 'الحالة:' : 'STATUS:'}</strong> ${
                    selectedOrder.status === 'pending' ? (lang === 'ar' ? 'بانتظار تأكيد الدفع والتحقق' : 'PENDING VERIFICATION') :
                    selectedOrder.status === 'paid' ? (lang === 'ar' ? 'تم الدفع والتحضير' : 'PAID & PREPARING') :
                    (lang === 'ar' ? 'تم استلام العميل بنجاح' : 'DELIVERED & SIGNED')
                  }
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>${lang === 'ar' ? 'المنتج والعتاد' : 'HARDWARE ITEM'}</th>
                    <th>${lang === 'ar' ? 'المواصفة' : 'SPEC'}</th>
                    <th>${lang === 'ar' ? 'اللون' : 'COLOR'}</th>
                    <th style="text-align:center;">${lang === 'ar' ? 'الكمية' : 'QTY'}</th>
                    <th style="text-align:${lang === 'ar' ? 'left' : 'right'};">${lang === 'ar' ? 'السعر' : 'SUBTOTAL'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${selectedOrder.items.map((item: any) => `
                    <tr>
                      <td style="font-weight:bold;">${item.product?.name || 'Item'}</td>
                      <td>${item.customSpec || 'STD'}</td>
                      <td>${item.selectedColor}</td>
                      <td style="text-align:center;">${item.quantity || 1}</td>
                      <td style="text-align:${lang === 'ar' ? 'left' : 'right'};">${((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()} ${selectedOrder.currency || 'EGP'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="total-row">
                ${lang === 'ar' ? 'الرصيد الإجمالي المستحق:' : 'GRAND TOTAL POOL BALANCE:'} 
                <span style="font-size:16px;">${Number(selectedOrder.totalPrice).toLocaleString()} ${selectedOrder.currency || 'EGP'}</span>
              </div>
              <div class="footer">
                <p style="margin:2px 0;">THANK YOU FOR TRUSTING 4U CORES SYSTEM</p>
                <p style="margin:2px 0; font-size: 8px; color: #555;">SIGNATURE SECURE NODE::AEROSYNC v9.27::PRO-CERTIFIED</p>
              </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
      
      // Print command stream
      setTimeout(() => {
        if (iframe.contentWindow) {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } catch (err) {
            console.error('Sandboxed iframe printing failed, trying standard open...', err);
          }
        }
      }, 500);
    }
  };

  // Change Password states
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');

  // Form states for creating a new product
  const [prodName, setProdName] = useState<string>('');
  const [prodCategory, setProdCategory] = useState<'computer' | 'phone' | 'accessory'>('phone');
  const [prodTagline, setProdTagline] = useState<string>('');
  const [prodDescription, setProdDescription] = useState<string>('');
  const [prodPrice, setProdPrice] = useState<number>(1000);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<string>('');
  
  // Custom specifications (dynamic label-value inputs)
  const [prodSpecs, setProdSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Processor', value: '4U Octa-Core AI' },
    { label: 'Display', value: '120Hz Ultra Bright' },
    { label: 'Storage', value: '512GB Graphene SSD' }
  ]);

  // Bullet point features
  const [featuresInput, setFeaturesInput] = useState<string>('');
  const [featuresList, setFeaturesList] = useState<string[]>([
    'Secure offline biometric telemetry loop',
    'Chassis optimized heat flow vents'
  ]);

  // Product Image: custom URL or uploaded Base64 or template
  const [imageType, setImageType] = useState<'upload' | 'template' | 'url'>('template');
  const [imageSelectedTemplate, setImageSelectedTemplate] = useState<string>(IMAGE_TEMPLATES[2].url);
  const [imageCustomUrl, setImageCustomUrl] = useState<string>('');
  const [imageUploadedBase64, setImageUploadedBase64] = useState<string>('');
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form error & success states
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  // --- Site Page Content Editor States ---
  const [editorLang, setEditorLang] = useState<'ar' | 'en'>('ar');
  const [editorSection, setEditorSection] = useState<'hero' | 'usp' | 'footer' | 'testimonials' | 'userReviews'>('hero');
  const [userReviewsList, setUserReviewsList] = useState<any[]>([]);

  // Translation states (Arabic)
  const [arShieldBadge, setArShieldBadge] = useState('');
  const [arTitleGlow, setArTitleGlow] = useState('');
  const [arTitleLast, setArTitleLast] = useState('');
  const [arSubParagraph, setArSubParagraph] = useState('');
  const [arWelcomeName, setArWelcomeName] = useState('');
  const [arWelcomeRole, setArWelcomeRole] = useState('');
  const [arWelcomeQuote, setArWelcomeQuote] = useState('');

  const [arUspBadge, setArUspBadge] = useState('');
  const [arUspGlow, setArArUspGlow] = useState('');
  const [arUspLast, setArArUspLast] = useState('');
  const [arUspDesc, setArArUspDesc] = useState('');
  const [arUspP1T, setArUspP1T] = useState('');
  const [arUspP1D, setArUspP1D] = useState('');
  const [arUspP1H, setArUspP1H] = useState('');
  const [arUspP2T, setArUspP2T] = useState('');
  const [arUspP2D, setArUspP2D] = useState('');
  const [arUspP2H, setArUspP2H] = useState('');
  const [arUspP3T, setArUspP3T] = useState('');
  const [arUspP3D, setArUspP3D] = useState('');
  const [arUspP3H, setArUspP3H] = useState('');

  const [arFooterDesc, setArFooterDesc] = useState('');
  const [arNewsTitle, setArNewsTitle] = useState('');
  const [arNewsDesc, setArNewsDesc] = useState('');

  // Translation states (English)
  const [enShieldBadge, setEnShieldBadge] = useState('');
  const [enTitleGlow, setEnTitleGlow] = useState('');
  const [enTitleLast, setEnTitleLast] = useState('');
  const [enSubParagraph, setEnSubParagraph] = useState('');
  const [enWelcomeName, setEnWelcomeName] = useState('');
  const [enWelcomeRole, setEnWelcomeRole] = useState('');
  const [enWelcomeQuote, setEnWelcomeQuote] = useState('');

  const [enUspBadge, setEnUspBadge] = useState('');
  const [enUspGlow, setEnEnUspGlow] = useState('');
  const [enUspLast, setEnEnUspLast] = useState('');
  const [enUspDesc, setEnEnUspDesc] = useState('');
  const [enUspP1T, setEnUspP1T] = useState('');
  const [enUspP1D, setEnUspP1D] = useState('');
  const [enUspP1H, setEnUspP1H] = useState('');
  const [enUspP2T, setEnUspP2T] = useState('');
  const [enUspP2D, setEnUspP2D] = useState('');
  const [enUspP2H, setEnUspP2H] = useState('');
  const [enUspP3T, setEnUspP3T] = useState('');
  const [enUspP3D, setEnUspP3D] = useState('');
  const [enUspP3H, setEnUspP3H] = useState('');

  const [enFooterDesc, setEnFooterDesc] = useState('');
  const [enNewsTitle, setEnNewsTitle] = useState('');
  const [enNewsDesc, setEnNewsDesc] = useState('');

  // Global Page Images Overrides
  const [heroImageCustomUrl, setHeroImageCustomUrl] = useState('');

  // Testimonial list manager states
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testComment, setTestComment] = useState('');
  const [testAvatar, setTestAvatar] = useState('');
  const [testPlatform, setTestPlatform] = useState('');
  const [testRating, setTestRating] = useState<number>(5);

  const initializeSiteEditor = () => {
    // 1. Load translations (which are already mutated on load by originalTranslations/localStorage)
    const tAr = (originalTranslations.ar || {}) as any;
    const tEn = (originalTranslations.en || {}) as any;
    
    // Find active overrides if any to fill inputs
    const savedOverrides = localStorage.getItem('4u_pro_custom_translations_v2');
    let overrides: any = {};
    if (savedOverrides) {
      try {
        overrides = JSON.parse(savedOverrides);
      } catch (e) {}
    }

    const mergeVal = (langKey: 'ar' | 'en', sectionKey: string, propKey: string, originalVal: string) => {
      if (overrides[langKey]?.[sectionKey]?.[propKey] !== undefined) {
        return overrides[langKey][sectionKey][propKey];
      }
      return originalVal;
    };

    const mergePointVal = (langKey: 'ar' | 'en', pointIdx: number, propKey: 'title' | 'desc' | 'highlight', originalVal: string) => {
      const savedPoint = overrides[langKey]?.usp?.points?.[pointIdx];
      if (savedPoint && savedPoint[propKey] !== undefined) {
        return savedPoint[propKey];
      }
      return originalVal;
    };

    // Hero Section
    setArShieldBadge(mergeVal('ar', 'hero', 'shieldBadge', tAr.hero?.shieldBadge || ''));
    setArTitleGlow(mergeVal('ar', 'hero', 'mainTitleGlow', tAr.hero?.mainTitleGlow || ''));
    setArTitleLast(mergeVal('ar', 'hero', 'mainTitleLast', tAr.hero?.mainTitleLast || ''));
    setArSubParagraph(mergeVal('ar', 'hero', 'subParagraph', tAr.hero?.subParagraph || ''));
    setArWelcomeName(mergeVal('ar', 'hero', 'welcomeName', tAr.hero?.welcomeName || ''));
    setArWelcomeRole(mergeVal('ar', 'hero', 'welcomeRole', tAr.hero?.welcomeRole || ''));
    setArWelcomeQuote(mergeVal('ar', 'hero', 'welcomeQuote', tAr.hero?.welcomeQuote || ''));

    setEnShieldBadge(mergeVal('en', 'hero', 'shieldBadge', tEn.hero?.shieldBadge || ''));
    setEnTitleGlow(mergeVal('en', 'hero', 'mainTitleGlow', tEn.hero?.mainTitleGlow || ''));
    setEnTitleLast(mergeVal('en', 'hero', 'mainTitleLast', tEn.hero?.mainTitleLast || ''));
    setEnSubParagraph(mergeVal('en', 'hero', 'subParagraph', tEn.hero?.subParagraph || ''));
    setEnWelcomeName(mergeVal('en', 'hero', 'welcomeName', tEn.hero?.welcomeName || ''));
    setEnWelcomeRole(mergeVal('en', 'hero', 'welcomeRole', tEn.hero?.welcomeRole || ''));
    setEnWelcomeQuote(mergeVal('en', 'hero', 'welcomeQuote', tEn.hero?.welcomeQuote || ''));

    // USP Section
    setArUspBadge(mergeVal('ar', 'usp', 'integrityBadge', tAr.usp?.integrityBadge || ''));
    setArArUspGlow(mergeVal('ar', 'usp', 'mainTitleGlow', tAr.usp?.mainTitleGlow || ''));
    setArArUspLast(mergeVal('ar', 'usp', 'mainTitleLast', tAr.usp?.mainTitleLast || ''));
    setArArUspDesc(mergeVal('ar', 'usp', 'subDesc', tAr.usp?.subDesc || ''));
    setArUspP1T(mergePointVal('ar', 0, 'title', tAr.usp?.points?.[0]?.title || ''));
    setArUspP1D(mergePointVal('ar', 0, 'desc', tAr.usp?.points?.[0]?.desc || ''));
    setArUspP1H(mergePointVal('ar', 0, 'highlight', tAr.usp?.points?.[0]?.highlight || ''));
    setArUspP2T(mergePointVal('ar', 1, 'title', tAr.usp?.points?.[1]?.title || ''));
    setArUspP2D(mergePointVal('ar', 1, 'desc', tAr.usp?.points?.[1]?.desc || ''));
    setArUspP2H(mergePointVal('ar', 1, 'highlight', tAr.usp?.points?.[1]?.highlight || ''));
    setArUspP3T(mergePointVal('ar', 2, 'title', tAr.usp?.points?.[2]?.title || ''));
    setArUspP3D(mergePointVal('ar', 2, 'desc', tAr.usp?.points?.[2]?.desc || ''));
    setArUspP3H(mergePointVal('ar', 2, 'highlight', tAr.usp?.points?.[2]?.highlight || ''));

    setEnUspBadge(mergeVal('en', 'usp', 'integrityBadge', tEn.usp?.integrityBadge || ''));
    setEnEnUspGlow(mergeVal('en', 'usp', 'mainTitleGlow', tEn.usp?.mainTitleGlow || ''));
    setEnEnUspLast(mergeVal('en', 'usp', 'mainTitleLast', tEn.usp?.mainTitleLast || ''));
    setEnEnUspDesc(mergeVal('en', 'usp', 'subDesc', tEn.usp?.subDesc || ''));
    setEnUspP1T(mergePointVal('en', 0, 'title', tEn.usp?.points?.[0]?.title || ''));
    setEnUspP1D(mergePointVal('en', 0, 'desc', tEn.usp?.points?.[0]?.desc || ''));
    setEnUspP1H(mergePointVal('en', 0, 'highlight', tEn.usp?.points?.[0]?.highlight || ''));
    setEnUspP2T(mergePointVal('en', 1, 'title', tEn.usp?.points?.[1]?.title || ''));
    setEnUspP2D(mergePointVal('en', 1, 'desc', tEn.usp?.points?.[1]?.desc || ''));
    setEnUspP2H(mergePointVal('en', 1, 'highlight', tEn.usp?.points?.[1]?.highlight || ''));
    setEnUspP3T(mergePointVal('en', 2, 'title', tEn.usp?.points?.[2]?.title || ''));
    setEnUspP3D(mergePointVal('en', 2, 'desc', tEn.usp?.points?.[2]?.desc || ''));
    setEnUspP3H(mergePointVal('en', 2, 'highlight', tEn.usp?.points?.[2]?.highlight || ''));

    // Footer
    setArFooterDesc(mergeVal('ar', 'footer', 'brandDesc', tAr.footer?.brandDesc || ''));
    setArNewsTitle(mergeVal('ar', 'footer', 'newsletterTitle', tAr.footer?.newsletterTitle || ''));
    setArNewsDesc(mergeVal('ar', 'footer', 'newsletterDesc', tAr.footer?.newsletterDesc || ''));

    setEnFooterDesc(mergeVal('en', 'footer', 'brandDesc', tEn.footer?.brandDesc || ''));
    setEnNewsTitle(mergeVal('en', 'footer', 'newsletterTitle', tEn.footer?.newsletterTitle || ''));
    setEnNewsDesc(mergeVal('en', 'footer', 'newsletterDesc', tEn.footer?.newsletterDesc || ''));

    // Hero Image custom URL
    setHeroImageCustomUrl(localStorage.getItem('4u_pro_hero_image_v2') || '');

    // Testimonials
    const savedTestimonials = localStorage.getItem('4u_pro_testimonials_v2');
    if (savedTestimonials) {
      try {
        setTestimonialsList(JSON.parse(savedTestimonials));
      } catch (e) {
        setTestimonialsList([]);
      }
    } else {
      setTestimonialsList([
        {
          id: 'test-1',
          name: 'Dr. Evelyn Carter',
          role: 'Cybernetic System Architect',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
          comment: 'The X-Enigma phone feels like it was engineered in the 22nd century. The haptic responses and structural design are incredibly satisfying, and the ecosystem accessories pair with zero latency.',
          rating: 5,
          platform: 'X / Twitter'
        },
        {
          id: 'test-2',
          name: 'Zenith Labs',
          role: 'Hardware Review Lead',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          comment: 'AeroPulse Buds Max delivers unmatched separation depth. The light reactions and raw materials of 4U PRO items are premium-tier. Truly standard-setting for cyber-tech styling.',
          rating: 5,
          platform: 'TechRadar Premium'
        },
        {
          id: 'test-3',
          name: 'Marcus Vance',
          role: 'Crypto-Trader & Enthusiast',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          comment: 'Chronos-7 Watch projecting clock widgets sounds like sci-fi, but it is real and completely functional. Customer support was instant—unparalleled after-purchase support.',
          rating: 5,
          platform: 'Digital Nomad Digest'
        }
      ]);
    }

    // Load user reviews
    const savedUserReviews = localStorage.getItem('4u_pro_user_reviews_v3');
    if (savedUserReviews) {
      try {
        setUserReviewsList(JSON.parse(savedUserReviews));
      } catch (e) {
        setUserReviewsList([]);
      }
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'siteEditor') {
      initializeSiteEditor();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    const syncUserReviews = () => {
      const saved = localStorage.getItem('4u_pro_user_reviews_v3');
      if (saved) {
        try {
          setUserReviewsList(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('reviews-updated', syncUserReviews);
    window.addEventListener('storage', syncUserReviews);
    return () => {
      window.removeEventListener('reviews-updated', syncUserReviews);
      window.removeEventListener('storage', syncUserReviews);
    };
  }, []);

  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();

    const overridesAr: any = {
      hero: {
        shieldBadge: arShieldBadge,
        mainTitleGlow: arTitleGlow,
        mainTitleLast: arTitleLast,
        subParagraph: arSubParagraph,
        welcomeName: arWelcomeName,
        welcomeRole: arWelcomeRole,
        welcomeQuote: arWelcomeQuote
      },
      usp: {
        integrityBadge: arUspBadge,
        mainTitleGlow: arUspGlow,
        mainTitleLast: arUspLast,
        subDesc: arUspDesc,
        points: [
          { title: arUspP1T, desc: arUspP1D, highlight: arUspP1H },
          { title: arUspP2T, desc: arUspP2D, highlight: arUspP2H },
          { title: arUspP3T, desc: arUspP3D, highlight: arUspP3H }
        ]
      },
      footer: {
        brandDesc: arFooterDesc,
        newsletterTitle: arNewsTitle,
        newsletterDesc: arNewsDesc
      }
    };

    const overridesEn: any = {
      hero: {
        shieldBadge: enShieldBadge,
        mainTitleGlow: enTitleGlow,
        mainTitleLast: enTitleLast,
        subParagraph: enSubParagraph,
        welcomeName: enWelcomeName,
        welcomeRole: enWelcomeRole,
        welcomeQuote: enWelcomeQuote
      },
      usp: {
        integrityBadge: enUspBadge,
        mainTitleGlow: enUspGlow,
        mainTitleLast: enUspLast,
        subDesc: enUspDesc,
        points: [
          { title: enUspP1T, desc: enUspP1D, highlight: enUspP1H },
          { title: enUspP2T, desc: enUspP2D, highlight: enUspP2H },
          { title: enUspP3T, desc: enUspP3D, highlight: enUspP3H }
        ]
      },
      footer: {
        brandDesc: enFooterDesc,
        newsletterTitle: enNewsTitle,
        newsletterDesc: enNewsDesc
      }
    };

    const globalOverrides = {
      ar: overridesAr,
      en: overridesEn
    };

    localStorage.setItem('4u_pro_custom_translations_v2', JSON.stringify(globalOverrides));

    if (heroImageCustomUrl.trim()) {
      localStorage.setItem('4u_pro_hero_image_v2', heroImageCustomUrl.trim());
    } else {
      localStorage.removeItem('4u_pro_hero_image_v2');
    }

    localStorage.setItem('4u_pro_testimonials_v2', JSON.stringify(testimonialsList));

    setFormSuccess(lang === 'ar' ? 'تم حفظ وتوثيق محتوى الصفحة والشرائح بنجاح! سيتم تنشيط وإجراء إعادة تحميل فورية لتفعيل التغييرات...' : 'Site content successfully saved! Reloading to apply all dynamic integrations...');
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleAddTestimonial = () => {
    if (!testName || !testComment) {
      alert(lang === 'ar' ? 'يرجى إدخال الاسم والتعليق لرأي العميل' : 'Please input both name and comment');
      return;
    }
    const newTest = {
      id: editTestId || 'test-' + Date.now(),
      name: testName,
      role: testRole || 'Client',
      avatar: testAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      comment: testComment,
      rating: testRating,
      platform: testPlatform || 'Validated Buyer',
      overrideName: testName,
      overrideRole: testRole || 'Client',
      overrideComment: testComment
    };

    let updated: any[] = [];
    if (editTestId) {
      updated = testimonialsList.map(t => t.id === editTestId ? newTest : t);
      setFormSuccess(lang === 'ar' ? 'تم تعديل مراجعة وتعديل رأي العميل المختار بنجاح' : 'Testimonial successfully updated');
    } else {
      updated = [...testimonialsList, newTest];
      setFormSuccess(lang === 'ar' ? 'تم إضافة رأي عميل سيبراني جديد للقائمة' : 'New customer testimonial added');
    }

    setTestimonialsList(updated);
    setEditTestId(null);
    setTestName('');
    setTestRole('');
    setTestComment('');
    setTestAvatar('');
    setTestPlatform('');
    setTestRating(5);
  };

  const handleEditTestimonialClick = (test: any) => {
    setEditTestId(test.id);
    setTestName(test.overrideName || test.name);
    setTestRole(test.overrideRole || test.role);
    setTestComment(test.overrideComment || test.comment);
    setTestAvatar(test.avatar);
    setTestPlatform(test.platform);
    setTestRating(test.rating);
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonialsList.filter(t => t.id !== id);
    setTestimonialsList(updated);
    setFormSuccess(lang === 'ar' ? 'تم حذف مراجعة العميل المحددة بنجاح' : 'Testimonial deleted successfully');
    if (editTestId === id) {
      setEditTestId(null);
      setTestName('');
      setTestRole('');
      setTestComment('');
      setTestAvatar('');
      setTestPlatform('');
      setTestRating(5);
    }
  };

  const handleDeleteUserReview = (id: string) => {
    const updated = userReviewsList.filter(r => r.id !== id);
    setUserReviewsList(updated);
    localStorage.setItem('4u_pro_user_reviews_v3', JSON.stringify(updated));
    setFormSuccess(lang === 'ar' ? 'تم حذف مراجعة العميل بنجاح من النظام' : 'Customer review deleted successfully');
    window.dispatchEvent(new Event('reviews-updated'));
    setTimeout(() => {
      setFormSuccess('');
    }, 4000);
  };

  if (!isOpen) return null;

  // Localized Copy
  const copy = {
    en: {
      adminTitle: "ADMIN CONTROL TERMINAL",
      authLocked: "Access Key Required",
      authSub: "This node is secure. Enter your 4U PRO credentials to proceed.",
      passwordLabel: "Admin Access Key:",
      loginBtn: "SECURE ACCESS HANDSHAKE",
      authError: "SEC-ERR: INVAL ACCESS SIGNATURE",
      placeholderPass: "Enter password...",
      defaultPassHint: "Default key: 123456 (Changable inside)",
      tabs: {
        add: "INSERT NEW CORE",
        manage: "MANAGE PRODUCTS",
        password: "CHANGE ACCESS KEY"
      },
      addForm: {
        prodName: "Product Name",
        prodTagline: "Ecosystem Tagline (Short description text)",
        prodDescription: "Full Tactical Description",
        prodCategory: "Product Category",
        categoryComputer: "Computation Rig (Laptop/Desktop)",
        categoryPhone: "Sensory Lab (Phone)",
        categoryAccessory: "Elite Gear (Accessory/Watch/Buds)",
        prodPrice: "Product Price (Egyptian National Pound - ج.م)",
        originalPrice: "Original Crossout Price (EGP/Optional)",
        imageSelection: "Product Image Source",
        imageUpload: "Direct Local File Upload (Drag & Drop)",
        imageTemplate: "Premium Graphene Asset Template",
        imageUrl: "Custom Web Vector URL",
        dragActive: "DROP CYBERNETIC IMAGE CORE HERE",
        dragInactive: "Drag and drop product image file, or click to browse standard folders",
        fileSelectedOk: "Local image successfully loaded",
        specsTitle: "Core Hardware Specifications Grid",
        specsLabelCol: "Label (e.g. Memory)",
        specsValueCol: "Value (e.g. 64GB LPDDR)",
        addSpecRow: "ADD COMPONENT NODE",
        featuresTitle: "Bullet Point Feature Highlights",
        addFeatureBtn: "ADD HIGHLIGHT",
        submitBtn: "ASSEMBLE & REGISTER PRODUCT",
        requiredFields: "All primary specifications must be completed"
      },
      manageTab: {
        title: "Active Core Fleet Directory",
        subtitle: "Review or prune hardware models deployed in the current local session stream.",
        tableProduct: "Ecosystem Core",
        tableCategory: "Loadout Grid",
        tablePrice: "Price Node",
        actions: "Operations Node",
        deleteConfirm: "Are you sure you want to prune this device from the catalog?",
        noProducts: "Ecosystem catalog empty.",
        resetCatalog: "RESET CORE TO DEFAULT FACTORY CATALOG",
        egpLabel: "EGP / ج.م",
        usdLabel: "USD"
      },
      keyChange: {
        title: "Configure Terminal Access Credentials",
        subtitle: "Change your authentication key immediately to prevent unauthorized workspace access.",
        oldPassword: "Enter Current Access Key:",
        newPassword: "Enter New 6-Digit/Text Key:",
        confirmPassword: "Confirm New Key:",
        submitBtn: "UPDATE COUPLING KEYS",
        mismatch: "SEC-ERR: Coupling signature does not match input confirmation",
        allRequired: "All fields are required",
        incorrectOld: "SEC-ERR: Current authentication key is invalid",
        success: "COUPLED! Your admin terminal entry key has been successfully updated."
      }
    },
    ar: {
      adminTitle: "لوحة تحكم المشرف (أدمن)",
      authLocked: "مطلوب رمز التحقق والولوج اللامركزي",
      authSub: "هذه الواجهة مؤمنة بالكامل للعمل الإداري. يرجى إدخال كلمة السر لفتح الصلاحيات.",
      passwordLabel: "رمز الولوج للأستاذ المشرف:",
      loginBtn: "تأكيد المصافحة الموحدة والولوج",
      authError: "خطأ أمني: رمز المرور غير صالح للولوج",
      placeholderPass: "أدخل كلمة السر هنا...",
      defaultPassHint: "كلمة السر الافتراضية للتشغيل هي: 123456 (يمكن تغييرها بالداخل)",
      tabs: {
        add: "إدراج منتج جديد",
        manage: "إدارة المنتجات وحذفها",
        password: "تغيير كلمة السر"
      },
      addForm: {
        prodName: "اسم المنتج الجديد",
        prodTagline: "العنوان الجانبي الموجه (وصف دلالي مختصر)",
        prodDescription: "الوصف التقني الشامل والتفصيلي",
        prodCategory: "تصنيف وفئة المنتج",
        categoryComputer: "منصات حاسوبية خارقة ومحمولة (كمبيوتر)",
        categoryPhone: "المختبرات الحسية الرائدة (هواتف ذكية)",
        categoryAccessory: "إكسسوارات وسماعات النخبة (ملحقات)",
        prodPrice: "سعر المنتج الفعلي (بالجنيه المصري - ج.م)",
        originalPrice: "السعر الأصلي القديم للشطب (اختياري - ج.م)",
        imageSelection: "مصدر وصورة المنتج الفنية",
        imageUpload: "سحب وإفلات صورة محلية (توصية Usability)",
        imageTemplate: "اختيار مجسم من المعرض المعتمد",
        imageUrl: "عنوان مسار صورة فنية مخصصة (URL)",
        dragActive: "أفلت صورة المنتج الخارقة هنا الآن",
        dragInactive: "اسحب وأفلت صورة المنتج هنا بصيغة JPEG أو PNG، أو اضغط هنا للتصفح",
        fileSelectedOk: "تم تحميل وقراءة صورتك المخصصة بنجاح",
        specsTitle: "جدول المواصفات الفنية للعتاد والتشخيصات",
        specsLabelCol: "البعد الفني (مثل: الذاكرة)",
        specsValueCol: "القيمة (مثل: 64 جيجابايت)",
        addSpecRow: "إضافة صف مواصفة فنية جديد",
        featuresTitle: "ميزات ومحاور القوة الإضافية للعتاد (نقاط نقطية)",
        addFeatureBtn: "إضافة ميزة فنية حية",
        submitBtn: "تأكيد هندسة وتسجيل وصناعة المنتج",
        requiredFields: "يرجى تعبئة كافة الحقول الرئيسية والمواصفات"
      },
      manageTab: {
        title: "سجل المنتجات والعتاد النشط بالمعرض",
        subtitle: "استعرض وحلّل الأجهزة والمنصات المنشورة وعطل أو احذف أي منتج في ثوانٍ.",
        tableProduct: "اسم وموديل العتاد",
        tableCategory: "التصنيف",
        tablePrice: "القيمة التسعيرية",
        actions: "إجراءات التحكم",
        deleteConfirm: "هل أنت متأكد تماماً من إزالة وصيانة هذا العتاد وصرفه من المعرض الحالي؟",
        noProducts: "لا يوجد منتجات متاحة بالمعرض حالياً.",
        resetCatalog: "إعادة تعيين المعرض الافتراضي للمعمل",
        egpLabel: "جنيه مصري",
        usdLabel: "دولار أمريكي"
      },
      keyChange: {
        title: "ترقية وتعديل مفاتيح دخول المشرفين الموحدة",
        subtitle: "حافظ على سرية بياناتك وقم بتغيير مفتاح الدخول بمرونة تامة لتقييد محاولات التطفل.",
        oldPassword: "أدخل كلمة السر الحالية:",
        newPassword: "أدخل كلمة السر الجديدة كلياً:",
        confirmPassword: "أكد إدخال كلمة السر الجديدة:",
        submitBtn: "تسجيل وحفظ مفاتيح دخولك الجديدة",
        mismatch: "خطأ أمني: عدم تطابق رمزي الدخول الجديدين",
        allRequired: "يرجى تعبئة كافة حقول تعديل كلمة السر",
        incorrectOld: "خطأ أمني: كلمة السر الحالية غير صحيحة",
        success: "تم الربط الرقمي! تم تحديث رمز دخول المشرف وحفظه بنجاح بالمتصفح المعتمد."
      }
    }
  }[lang];

  // Access check
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('4u_pro_admin_pass') || '123456';
    if (passwordInput.trim() === stored) {
      setIsAuthenticated(true);
      localStorage.setItem('4u_pro_admin_logged_in', 'true');
      window.dispatchEvent(new Event('admin-login-changed'));
      setPasswordError('');
    } else {
      setPasswordError(copy.authError);
    }
  };

  // Change password internally
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setPasswordSuccess('');
      setFormError(copy.keyChange.allRequired);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordSuccess('');
      setFormError(copy.keyChange.mismatch);
      return;
    }
    
    // Save to localstorage
    localStorage.setItem('4u_pro_admin_pass', newPassword);
    setPasswordSuccess(copy.keyChange.success);
    setFormError('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Specs helper functions
  const handleAddSpecRow = () => {
    setProdSpecs(prev => [...prev, { label: '', value: '' }]);
  };

  const handleUpdateSpecRow = (idx: number, field: 'label' | 'value', text: string) => {
    setProdSpecs(prev => {
      const copy = [...prev];
      copy[idx][field] = text;
      return copy;
    });
  };

  const handleRemoveSpecRow = (idx: number) => {
    setProdSpecs(prev => prev.filter((_, i) => i !== idx));
  };

  // Highlights helper
  const handleAddFeature = () => {
    if (featuresInput.trim()) {
      setFeaturesList(prev => [...prev, featuresInput.trim()]);
      setFeaturesInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(prev => prev.filter((_, i) => i !== idx));
  };

  // File drag & upload handlers mapping Usability Patterns
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUploadedBase64(event.target.result as string);
        setImageType('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit product creation
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prodName || !prodTagline || !prodDescription || !prodPrice) {
      setFormError(copy.addForm.requiredFields);
      setFormSuccess('');
      return;
    }

    // Spec checking
    const validSpecs = prodSpecs.filter(s => s.label.trim() !== '' && s.value.trim() !== '');
    if (validSpecs.length === 0) {
      setFormError(copy.addForm.requiredFields);
      setFormSuccess('');
      return;
    }

    // Determine final image path
    let finalImage = imageSelectedTemplate;
    if (imageType === 'url' && imageCustomUrl.trim()) {
      finalImage = imageCustomUrl.trim();
    } else if (imageType === 'upload' && imageUploadedBase64) {
      finalImage = imageUploadedBase64;
    }

    const uniqueId = `custom-${prodCategory}-${Date.now()}`;

    // Create colors default representation
    const generatedColors = [
      { name: 'Obsidian Black', hex: '#0B0C10', previewColor: 'bg-neutral-900 border-neutral-700' },
      { name: 'Electric Cyan', hex: '#00F0FF', previewColor: 'bg-cyan-400 border-cyan-300' },
      { name: 'Laser Purple', hex: '#BD00FF', previewColor: 'bg-purple-600 border-purple-400' }
    ];

    const newProduct: Product = {
      id: uniqueId,
      name: prodName,
      category: prodCategory,
      tagline: prodTagline,
      description: prodDescription,
      price: prodPrice,
      originalPrice: prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined,
      image: finalImage,
      specs: validSpecs,
      colors: generatedColors,
      rating: parseFloat((4.7 + Math.random() * 0.3).toFixed(1)),
      reviewsCount: Math.floor(10 + Math.random() * 80),
      features: featuresList.length > 0 ? featuresList : ['High capacitance cybernetic efficiency loop approved'],
      currency: 'EGP' // Explicitly set EGP as requested
    };

    setProductsList(prev => [newProduct, ...prev]);
    
    // Clear and success feedback
    setFormSuccess(lang === 'ar' ? `تم تصنيع وإدراج جهاز "${prodName}" بنجاح ضمن قائمة المعرض المتاحة بالجنيه المصري!` : `Successfully forged and registered dynamic product "${prodName}" in Egyptian Pounds!`);
    setFormError('');
    
    // Reset inputs
    setProdName('');
    setProdTagline('');
    setProdDescription('');
    setProdPrice(1000);
    setProdOriginalPrice('');
    setFeaturesList(['Secure offline biometric telemetry loop']);
    setImageUploadedBase64('');
    setImageCustomUrl('');
    setImageType('template');
  };

  // Remove product from array
  const handleDeleteProduct = (prodId: string) => {
    if (confirm(copy.manageTab.deleteConfirm)) {
      setProductsList(prev => prev.filter(p => p.id !== prodId));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background backing blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
      />

      {/* Main Terminal Frame */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border backdrop-blur-md p-6 sm:p-8 ${
          isDarkMode 
            ? 'bg-obsidian-card border-neon-cyan/20 text-white shadow-[0_0_50px_rgba(0,240,255,0.1)]' 
            : 'bg-white border-neutral-200 text-neutral-800'
        } z-10`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
            isDarkMode 
              ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-600' 
              : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-black hover:border-neutral-300'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic header display */}
        <div className="mb-6 pb-4 border-b border-neutral-800/40 text-left rtl:text-right">
          <span className="text-[10px] font-mono tracking-widest text-neon-cyan uppercase font-bold flex items-center gap-x-2">
            <Settings className="w-3.5 h-3.5 animate-spin-slow text-neon-cyan" />
            <span>4U CORES LAB</span>
          </span>
          <h2 className="font-orbitron font-extrabold text-xl py-0.5 uppercase tracking-wide">
            {copy.adminTitle}
          </h2>
        </div>

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full mx-auto bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <Lock className="w-7 h-7 text-neon-cyan" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-orbitron font-extrabold text-sm uppercase tracking-wider">{copy.authLocked}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">{copy.authSub}</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="text-left rtl:text-right space-y-1.5">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                  {copy.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={copy.placeholderPass}
                    required
                    className={`w-full px-4 py-3 rounded-xl border font-mono text-sm tracking-widest outline-none transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neon-cyan/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.1)]' 
                        : 'bg-neutral-50 border-neutral-300 text-black focus:border-neon-cyan'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 rtl:left-3 rtl:right-auto flex items-center justify-center text-neutral-500 hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 text-xs font-mono bg-red-950/20 border border-red-500/30 text-rose-400 rounded-lg animate-pulse text-left rtl:text-right">
                  {passwordError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan via-[#00CCFF] to-neon-purple text-black font-orbitron font-black text-xs tracking-widest hover:scale-[1.01] transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] cursor-pointer"
              >
                {copy.loginBtn}
              </button>
            </form>

            <p className="text-[10px] font-mono text-neutral-500">
              {copy.defaultPassHint}
            </p>
          </div>
        ) : (
          /* Unlocked Admin Hub */
          <div className="space-y-8">
            
            {/* Horizontal Command Tabs */}
            <div className="flex border-b border-neutral-800/60 overflow-x-auto gap-x-2 pb-[1px]">
              {([
                { id: 'add', label: copy.tabs.add, icon: Plus },
                { id: 'manage', label: copy.tabs.manage, icon: LayoutGrid },
                { id: 'orders', label: lang === 'ar' ? 'تتبع طلبات الشراء' : 'ORDERS TRACKING', icon: ClipboardList },
                { id: 'siteEditor', label: lang === 'ar' ? 'تعديل محتوى الصفحة والشرائح' : 'SITE PAGE CONTENT EDITOR', icon: Edit },
                { id: 'password', label: copy.tabs.password, icon: Key }
              ] as const).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFormError('');
                      setFormSuccess('');
                      setPasswordSuccess('');
                      if (tab.id === 'orders') {
                        refreshOrdersList();
                      }
                    }}
                    className={`px-4 py-3 font-orbitron font-bold text-[10px] sm:text-xs tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-x-2 cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/5'
                        : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              {/* Premium Red-Accented Sign Out Button */}
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  localStorage.removeItem('4u_pro_admin_logged_in');
                  window.dispatchEvent(new Event('admin-login-changed'));
                  onClose();
                }}
                className="px-4 py-3 font-orbitron font-bold text-[10px] sm:text-xs tracking-wider border-b-2 border-transparent text-red-400 hover:text-red-300 hover:bg-red-950/15 transition-all flex items-center gap-x-2 cursor-pointer ml-auto rtl:mr-auto rtl:ml-0"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'SIGN OUT'}</span>
              </button>
            </div>

            {/* Error & Success Feeds */}
            {formError && (
              <div className="p-4 text-xs font-mono bg-red-950/20 border border-red-500/30 text-rose-400 rounded-xl text-left rtl:text-right">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-4 text-xs font-mono bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-x-3 text-left rtl:text-right">
                <CheckCircle className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>{formSuccess}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="p-4 text-xs font-mono bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-x-3 text-left rtl:text-right">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {/* TAB CONTENT: Add Product Form */}
            {activeTab === 'add' && (
              <form onSubmit={handleCreateProduct} className="space-y-6 text-left rtl:text-right">
                
                {/* Visual Identity Grid Selection (Presets, Upload or Custom URL) */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                    {copy.addForm.imageSelection}
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'template', label: copy.addForm.imageTemplate },
                      { id: 'upload', label: copy.addForm.imageUpload },
                      { id: 'url', label: copy.addForm.imageUrl }
                    ] as const).map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setImageType(type.id)}
                        className={`py-2 px-3 rounded-lg border font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          imageType === type.id
                            ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan'
                            : isDarkMode
                              ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                              : 'border-neutral-200 bg-neutral-150 text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Rendering the active Image Source input block */}
                  {imageType === 'template' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {IMAGE_TEMPLATES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setImageSelectedTemplate(img.url)}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-y-2 transition-all ${
                              imageSelectedTemplate === img.url
                                ? 'border-neon-cyan bg-neon-cyan/5'
                                : 'border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <img src={img.url} alt={img.name} className="w-12 h-12 object-contain select-none" referrerPolicy="no-referrer" />
                            <span className="text-[8px] font-mono text-gray-400 truncate w-full text-center">{img.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {imageType === 'upload' && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDropFile}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        isDraggingFile
                          ? 'border-neon-cyan bg-neon-cyan/10'
                          : imageUploadedBase64
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : isDarkMode
                              ? 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                              : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Upload className={`w-8 h-8 mx-auto mb-3 animate-pulse ${imageUploadedBase64 ? 'text-emerald-400' : 'text-neon-cyan'}`} />
                      <p className="font-mono text-xs font-bold text-neutral-300 mb-1">
                        {imageUploadedBase64 ? copy.addForm.fileSelectedOk : (isDraggingFile ? copy.addForm.dragActive : copy.addForm.dragInactive)}
                      </p>
                      <p className="text-[9px] text-neutral-500">Supports JPG, PNG, WEBP files up to 5MB</p>
                      
                      {imageUploadedBase64 && (
                        <div className="mt-4 inline-block p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                          <img src={imageUploadedBase64} alt="Upload preview" className="h-16 w-16 object-cover rounded-md" referrerPolicy="no-referrer" />
                        </div>
                      )}
                    </div>
                  )}

                  {imageType === 'url' && (
                    <div className="space-y-1.5">
                      <input
                        type="url"
                        value={imageCustomUrl}
                        onChange={(e) => setImageCustomUrl(e.target.value)}
                        placeholder="https://example.com/premium-cyber-hardware.png"
                        className={`w-full px-4 py-2.5 rounded-xl border font-mono text-xs outline-none transition-all ${
                          isDarkMode ? 'bg-neutral-900 border-neutral-850 text-white' : 'bg-white border-neutral-300 text-black'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Primary specs inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                      {copy.addForm.prodCategory}
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => {
                        const cat = e.target.value as 'computer' | 'phone' | 'accessory';
                        setProdCategory(cat);
                        // Pre-fill specification templates corresponding to category for pristine diagnostic layout
                        if (cat === 'computer') {
                          setProdSpecs([
                            { label: 'Processor', value: '4U Deca-Core Terabeat CPU' },
                            { label: 'Memory', value: '64GB LPDDR6' },
                            { label: 'Graphics', value: 'Quantum Liquid-Cooled GPU' },
                            { label: 'Storage', value: '2TB PCI-e SSD' },
                            { label: 'Screen', value: '16.2" Liquid Retina' }
                          ]);
                        } else if (cat === 'phone') {
                          setProdSpecs([
                            { label: 'Processor', value: '4U Quantum AI Neural Engine' },
                            { label: 'Display', value: '6.8" Holographic OLED' },
                            { label: 'Camera', value: '180MP Optic Lens' },
                            { label: 'Battery', value: '6000mAh Dual-Cell' },
                            { label: 'Signal', value: 'AeroSync Multiplex' }
                          ]);
                        } else {
                          setProdSpecs([
                            { label: 'Frequency', value: '4Hz - 48,000Hz Ultra Range' },
                            { label: 'Isolation', value: '45dB Smart Active Isolation' },
                            { label: 'Battery', value: '48 Hours Cyber-Mesh' },
                            { label: 'Water', value: 'IP68 Underwater Telemetry' }
                          ]);
                        }
                      }}
                      className={`w-full px-4 py-2.5 border font-mono rounded-xl text-xs outline-none cursor-pointer ${
                        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-350 text-black'
                      }`}
                    >
                      <option value="phone">{copy.addForm.categoryPhone}</option>
                      <option value="computer">{copy.addForm.categoryComputer}</option>
                      <option value="accessory">{copy.addForm.categoryAccessory}</option>
                    </select>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                      {copy.addForm.prodName}
                    </label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. 4U PRO Cyberbook-Prime"
                      className={`w-full px-4 py-2.5 border rounded-xl text-xs outline-none ${
                        isDarkMode ? 'bg-neutral-900 border-[#1F2028] text-white focus:border-neon-cyan' : 'bg-white border-neutral-300 text-black'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prices in Egyptian Pounds */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-405 text-neutral-400">
                      {copy.addForm.prodPrice}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(parseInt(e.target.value, 10))}
                      placeholder="e.g. 25000"
                      className={`w-full px-4 py-2.5 border rounded-xl font-mono text-xs outline-none ${
                        isDarkMode ? 'bg-neutral-900 border-[#1F2028] text-teal-400 font-bold' : 'bg-white border-neutral-300 text-teal-600 font-bold'
                      }`}
                    />
                  </div>

                  {/* Original / Crossout Price in Egyptian Pounds */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                      {copy.addForm.originalPrice}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(e.target.value)}
                      placeholder="e.g. 29000"
                      className={`w-full px-4 py-2.5 border rounded-xl font-mono text-xs outline-none ${
                        isDarkMode ? 'bg-neutral-900 border-[#1F2028] text-neutral-400' : 'bg-white border-neutral-300 text-neutral-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Ecosystem Tagline */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                    {copy.addForm.prodTagline}
                  </label>
                  <input
                    type="text"
                    required
                    value={prodTagline}
                    onChange={(e) => setProdTagline(e.target.value)}
                    placeholder="e.g. Extreme Sub-Liquid Nitrogen overclock capability laptop"
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs outline-none ${
                      isDarkMode ? 'bg-neutral-900 border-[#1F2028] text-white focus:border-neon-cyan' : 'bg-white border-neutral-300 text-black'
                    }`}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                    {copy.addForm.prodDescription}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Provide a comprehensive technical summary of this chassis element..."
                    className={`w-full px-4 py-2.5 border rounded-xl text-xs outline-none leading-relaxed ${
                      isDarkMode ? 'bg-neutral-900 border-[#1F2028] text-white focus:border-neon-cyan' : 'bg-white border-neutral-300 text-black'
                    }`}
                  />
                </div>

                {/* Specs list configuration */}
                <div className="space-y-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950/20">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                      {copy.addForm.specsTitle}
                    </span>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="px-2 py-1 rounded bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan font-mono text-[9px] font-bold tracking-wide border border-neon-cyan/30 flex items-center gap-x-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{copy.addForm.addSpecRow}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {prodSpecs.map((spec, idx) => (
                      <div key={idx} className="flex gap-x-2 items-center">
                        <input
                          type="text"
                          required
                          value={spec.label}
                          placeholder={copy.addForm.specsLabelCol}
                          onChange={(e) => handleUpdateSpecRow(idx, 'label', e.target.value)}
                          className={`w-1/3 px-3 py-1.5 border rounded-lg font-mono text-[11px] outline-none ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                        <input
                          type="text"
                          required
                          value={spec.value}
                          placeholder={copy.addForm.specsValueCol}
                          onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                          className={`w-2/3 px-3 py-1.5 border rounded-lg font-mono text-[11px] outline-none ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="p-1.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Highlights Bullets */}
                <div className="space-y-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950/20">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                    {copy.addForm.featuresTitle}
                  </label>

                  <div className="flex gap-x-2">
                    <input
                      type="text"
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      placeholder="e.g. Fluid nitrogen sub-acoustic cooling system"
                      className={`flex-1 px-4 py-1.5 border rounded-lg text-xs outline-none ${
                        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 rounded bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-purple font-mono text-xs font-bold border border-neon-purple/30 flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {featuresList.map((fit, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-x-1 px-2.5 py-1 rounded bg-neutral-900 text-[10px] text-gray-300 border border-neutral-800"
                      >
                        <span>{fit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-0.5 text-neutral-500 hover:text-white"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assemble / Create Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-orbitron font-black text-xs tracking-widest hover:scale-[1.01] transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer mt-4"
                >
                  {copy.addForm.submitBtn}
                </button>
              </form>
            )}

            {/* TAB CONTENT: Manage Active Catalog */}
            {activeTab === 'manage' && (
              <div className="space-y-6 text-left rtl:text-right">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-3">
                  <div>
                    <h3 className="font-orbitron font-extrabold text-sm uppercase tracking-wider">{copy.manageTab.title}</h3>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">{copy.manageTab.subtitle}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(lang === 'ar' ? 'هل تود حقاً تصفير المعمل وإعادة المعرض الافتراضي الأساسي؟' : 'Are you sure you want to restore default factory catalog? All custom builds will be scrubbed.')) {
                        onResetCatalog();
                        setFormSuccess(lang === 'ar' ? 'تمت إعادة ضبط وترميم المعرض إلى التكوين الافتراضي الأصلي 4U PRO!' : 'Catalog successfully reset to standard default baseline.');
                      }
                    }}
                    className="px-3 py-1.5 border border-red-500/35 bg-red-950/15 hover:bg-red-500 hover:text-black font-mono text-[9px] font-black tracking-wider text-red-400 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-x-1.5 shadow-[0_0_12px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-slow" />
                    <span>{copy.manageTab.resetCatalog}</span>
                  </button>
                </div>

                {productsList.length === 0 ? (
                  <div className="py-12 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
                    {copy.manageTab.noProducts}
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                    <table className="w-full text-left rtl:text-right font-sans text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-neutral-900/60 font-mono text-[10px] text-gray-400 uppercase tracking-wider">
                          <th className="p-4">{copy.manageTab.tableProduct}</th>
                          <th className="p-4">{copy.manageTab.tableCategory}</th>
                          <th className="p-4">{copy.manageTab.tablePrice}</th>
                          <th className="p-4 text-center">{copy.manageTab.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/40">
                        {productsList.map((p) => {
                          const isCustom = p.id.startsWith('custom-');
                          return (
                            <tr key={p.id} className="hover:bg-neutral-900/20 transition-colors">
                              <td className="p-4 flex items-center gap-x-3">
                                <img src={p.image} alt={p.name} className="w-9 h-9 object-contain rounded bg-neutral-950 p-1 select-none flex-shrink-0" referrerPolicy="no-referrer" />
                                <div className="min-w-0">
                                  <span className="font-bold text-white block truncate">{p.name}</span>
                                  <span className="text-[9px] font-mono text-neutral-500 block truncate">{p.tagline}</span>
                                </div>
                              </td>
                              <td className="p-4 font-mono text-[10px] text-gray-300">
                                <span className={`px-2 py-0.5 rounded border ${
                                  p.category === 'computer' ? 'border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan' :
                                  p.category === 'phone' ? 'border-neon-purple/20 bg-neon-purple/5 text-neon-purple' :
                                  'border-neon-pink/20 bg-neon-pink/5 text-neon-pink'
                                }`}>
                                  {p.category.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-4 font-mono font-bold">
                                {p.currency === 'EGP' ? (
                                  <span className="text-teal-400">{p.price.toLocaleString()} {copy.manageTab.egpLabel}</span>
                                ) : (
                                  <span className="text-neon-cyan">${p.price.toLocaleString()}</span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 rounded bg-red-950/20 hover:bg-red-500 hover:text-black text-rose-500 border border-red-500/20 transition-all cursor-pointer"
                                  title="Prune Device"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Purchase Order Tracking */}
            {activeTab === 'orders' && (() => {
              const orderLocalT = {
                en: {
                  title: "Invoices & Orders Ledger Archive",
                  subtitle: "Search, verify, inspect past purchases, manage delivery statuses, and print officially signed code-certified invoices.",
                  empty: "No purchase orders generated in current session stream.",
                  id: "ORDER ID",
                  date: "TIMESTAMP",
                  customer: "CUSTOMER",
                  total: "GRAND TOTAL",
                  status: "STATUS",
                  detailsTitle: "Invoice Verification Node",
                  selectToInspect: "Select a digital invoice block to review hardware specifications & execute operations.",
                  phone: "Phone Line:",
                  email: "Email Node:",
                  address: "Delivery Dropzone:",
                  items: "Ordered Hardware Units",
                  actions: "Authorized Operations",
                  markPaid: "Confirm Purchase & Payment Received",
                  markDelivered: "Confirm Customer Delivery Signed",
                  printInvoice: "Print Sales Invoice",
                  unpaidStatus: "Pending Confirmation",
                  paidStatus: "Paid / Preparing Rig",
                  deliveredStatus: "Deliver Complete / Signed",
                  searchPlaceholder: "Search archive by Invoice #, name, phone, or TX code...",
                  noResults: "No invoices matched your search query keys.",
                },
                ar: {
                  title: "أرشيف وسجل فواتير الشراء المعتمدة",
                  subtitle: "ابحث في الأرشيف، تتبع تفاصيل وعتاد الفواتير، حدّث حالة الشحن، واطبع فواتير مبيعات ورقية متكاملة.",
                  empty: "لا يوجد طلبات أو فواتير مسجلة حالياً بالمتصفح.",
                  id: "معرّف الطلب (ID)",
                  date: "توقيت الطلب الالكتروني",
                  customer: "اسم العميل المستلم",
                  total: "قيمة المعاملة كاملة",
                  status: "حالة تتبع المعمل",
                  detailsTitle: "بوابة فحص وتدقيق الفاتورة المحددة",
                  selectToInspect: "يرجى تحديد فاتورة من الأرشيف لاستعراض التفاصيل الدقيقة وحالة الشحن والعتاد.",
                  phone: "رقم هاتف الاتصال:",
                  email: "البريد الإلكتروني:",
                  address: "عنوان تسليم الشحنة:",
                  items: "الأجهزة والوحدات الحاسوبية المحجوزة",
                  actions: "الإجراءات والعمليات الإدارية المتاحة",
                  markPaid: "تأكيد واستلام ثمن المنتج وتأكيد الشراء",
                  markDelivered: "تأكيد واستلام العميل للمنتج بنجاح",
                  printInvoice: "طباعة فاتورة مبيعات ورقية",
                  unpaidStatus: "بانتظار التأكيد والدفع",
                  paidStatus: "تم تأكيد الدفع وجاري تخصيص العتاد",
                  deliveredStatus: "تم الاستلام النهائي من العميل",
                  searchPlaceholder: "ابحث في الأرشيف برقم الفاتورة (مثلا INV-1001)، الاسم، الهاتف، المعرّف...",
                  noResults: "لم يتم العثور على فواتير تطابق كلمات البحث المدخلة.",
                }
              }[lang];

              // Enhance orders with clean sequential invoice numbers if missing
              const ordersWithInvoices = ordersList.map((order, idx) => {
                const calculatedSeq = 1000 + ordersList.length - idx;
                const invNum = order.invoiceNumber || `INV-${calculatedSeq}`;
                return {
                  ...order,
                  invoiceNumber: invNum
                };
              });

              // Apply live status & text query filters
              const filteredOrders = ordersWithInvoices.filter((order) => {
                const query = orderSearchQuery.toLowerCase().trim();
                if (!query) return true;
                return (
                  order.id.toLowerCase().includes(query) ||
                  order.invoiceNumber.toLowerCase().includes(query) ||
                  order.customerName.toLowerCase().includes(query) ||
                  order.customerPhone.toLowerCase().includes(query) ||
                  (order.customerEmail && order.customerEmail.toLowerCase().includes(query)) ||
                  (order.customerAddress && order.customerAddress.toLowerCase().includes(query))
                );
              });

              return (
                <div className="space-y-6 text-left rtl:text-right">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-3.5 border-b border-neutral-800/40 pb-4">
                    <div>
                      <h3 className="font-orbitron font-extrabold text-sm uppercase text-neon-cyan tracking-wider">{orderLocalT.title}</h3>
                      <p className="text-xs text-neutral-400 font-sans mt-0.5">{orderLocalT.subtitle}</p>
                    </div>
                    {ordersList.length > 0 && (
                      <div className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-mono text-neutral-450">
                        {lang === 'ar' ? 'إجمالي الأرشيف:' : 'TOTAL ARCHIVED:'} <span className="text-neon-cyan font-bold">{ordersList.length}</span>
                      </div>
                    )}
                  </div>

                  {ordersList.length === 0 ? (
                    <div className="py-12 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-400">
                      {orderLocalT.empty}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Interactive Search Bar across the Archive */}
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-550 flex items-center">
                          <Search className="w-4 h-4 text-neon-cyan/80 animate-pulse" />
                        </span>
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          placeholder={orderLocalT.searchPlaceholder}
                          className={`w-full pl-10 pr-12 py-3 rounded-xl border text-xs outline-none transition-all ${
                            isDarkMode 
                              ? 'bg-[#090A0F] border-neutral-800 text-white focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.08)] font-mono' 
                              : 'bg-white border-neutral-200 text-black focus:border-neon-cyan'
                          }`}
                        />
                        {orderSearchQuery && (
                          <button
                            onClick={() => setOrderSearchQuery('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-neon-pink hover:underline uppercase tracking-wider cursor-pointer py-1 px-2 rounded hover:bg-neon-pink/5"
                          >
                            {lang === 'ar' ? 'إعادة تعيين' : 'Clear'}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Orders List column */}
                        <div className="lg:col-span-5 space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
                          {filteredOrders.length === 0 ? (
                            <div className="py-10 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-400">
                              {orderLocalT.noResults}
                            </div>
                          ) : (
                            filteredOrders.map((order) => (
                              <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer text-left rtl:text-right ${
                                  selectedOrder?.id === order.id
                                    ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_12px_rgba(0,240,255,0.08)]'
                                    : isDarkMode
                                      ? 'border-neutral-800 bg-neutral-900/10 hover:border-neutral-700'
                                      : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                                }`}
                              >
                                <div className="flex justify-between items-start gap-x-2">
                                  <div className="flex flex-col">
                                    <span className="font-orbitron font-extrabold text-xs text-neon-cyan tracking-wide">
                                      {order.invoiceNumber}
                                    </span>
                                    <span className="font-mono text-[9px] text-neutral-500 uppercase">
                                      {order.id}
                                    </span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono border ${
                                    order.status === 'pending' ? 'border-neon-pink/20 bg-neon-pink/5 text-neon-pink' :
                                    order.status === 'paid' ? 'border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan' :
                                    'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                                  }`}>
                                    {order.status === 'pending' ? orderLocalT.unpaidStatus :
                                     order.status === 'paid' ? orderLocalT.paidStatus :
                                     orderLocalT.deliveredStatus}
                                  </span>
                                </div>

                                <div className="mt-2.5 space-y-1 font-sans text-xs">
                                  <div className="flex justify-between text-neutral-400">
                                    <span>{lang === 'ar' ? 'العميل:' : 'Customer:'}</span>
                                    <span className="text-white font-medium">{order.customerName}</span>
                                  </div>
                                  <div className="flex justify-between text-neutral-400">
                                    <span>{lang === 'ar' ? 'القيمة الكلية:' : 'Total:'}:</span>
                                    <span className="text-neon-purple font-mono font-bold">
                                      {order.totalPrice.toLocaleString()} {order.items[0]?.product.currency || 'EGP'}
                                    </span>
                                  </div>
                                  <div className="text-[10px] font-mono text-neutral-500 text-right rtl:text-left pt-1">
                                    {order.date}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Order Details Column */}
                        <div className="lg:col-span-7">
                          {selectedOrder ? (() => {
                            // Find the matching enhanced order to get the correct backfilled invoiceNumber
                            const enhancedSelected = ordersWithInvoices.find(o => o.id === selectedOrder.id) || selectedOrder;
                            return (
                              <div className={`p-5 rounded-xl border ${
                                isDarkMode ? 'border-neutral-800 bg-neutral-900/30' : 'border-neutral-200 bg-neutral-50'
                              } space-y-5 text-left rtl:text-right`}>
                                
                                {/* Details Header */}
                                <div className="border-b border-neutral-800/40 pb-3 flex justify-between items-center">
                                  <div>
                                    <div className="flex items-center gap-x-2">
                                      <span className="font-orbitron font-extrabold text-sm text-neon-cyan tracking-wider">
                                        {enhancedSelected.invoiceNumber}
                                      </span>
                                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse animate-duration-1000" />
                                    </div>
                                    <p className="font-mono text-[9px] text-neutral-500 mt-1 uppercase">
                                      {lang === 'ar' ? 'رمز المعاملة المالي:' : 'TRANSACTION ID:'} {enhancedSelected.id}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-mono text-neutral-500">{enhancedSelected.date}</span>
                                </div>

                            {/* Customer details */}
                            <div className="space-y-2 font-sans text-xs text-neutral-300">
                              <div>
                                <strong className="text-neutral-400 inline-block w-28">{lang === 'ar' ? 'اسم العميل:' : 'Customer Name:'}</strong>
                                <span className="text-white font-bold">{selectedOrder.customerName}</span>
                              </div>
                              <div>
                                <strong className="text-neutral-400 inline-block w-28">{orderLocalT.phone}</strong>
                                <span className="text-white font-mono">{selectedOrder.customerPhone}</span>
                              </div>
                              <div>
                                <strong className="text-neutral-400 inline-block w-28">{orderLocalT.email}</strong>
                                <span className="text-white font-mono">{selectedOrder.customerEmail}</span>
                              </div>
                              <div>
                                <strong className="text-neutral-400 inline-block w-28">{orderLocalT.address}</strong>
                                <span className="text-white">{selectedOrder.customerAddress}</span>
                              </div>
                            </div>

                            {/* Purchased Items List */}
                            <div className="space-y-2.5">
                              <h5 className="font-orbitron font-extrabold text-[10px] uppercase text-neon-cyan tracking-wider">
                                {orderLocalT.items}
                              </h5>
                              <div className="space-y-2 max-h-[25vh] overflow-y-auto pr-1">
                                {selectedOrder.items.map((item: any, id: number) => (
                                  <div key={id} className="p-3 rounded-lg border border-neutral-800 bg-black/40 flex items-center justify-between text-xs font-sans">
                                    <div>
                                      <span className="text-white font-bold">{item.product.name}</span>
                                      <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-x-2">
                                        <span>Spec: {item.customSpec || 'STD'}</span>
                                        <span>•</span>
                                        <span>Color: {item.selectedColor}</span>
                                        <span>•</span>
                                        <span>Qty: {item.quantity}</span>
                                      </div>
                                    </div>
                                    <span className="font-mono text-neon-purple font-bold">
                                      {((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()} {selectedOrder.currency || 'EGP'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* State alteration actions */}
                            <div className="pt-2 border-t border-neutral-800/40 space-y-3">
                              <h5 className="font-orbitron font-extrabold text-[10px] uppercase text-neon-purple tracking-wider">
                                {orderLocalT.actions}
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {/* Confirm purchase / Payment */}
                                {selectedOrder.status === 'pending' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'paid')}
                                    className="py-2.5 px-4 rounded-xl bg-cyan-405 hover:bg-cyan-300 text-black font-semibold text-xs transition-all flex items-center justify-center gap-x-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] col-span-1 sm:col-span-2"
                                    style={{ backgroundColor: '#00F0FF' }}
                                  >
                                    <Coins className="w-4 h-4" />
                                    <span>{orderLocalT.markPaid}</span>
                                  </button>
                                )}

                                {/* Confirm Client Delivery Received */}
                                {selectedOrder.status === 'paid' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                                    className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all flex items-center justify-center gap-x-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)] col-span-1 sm:col-span-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{orderLocalT.markDelivered}</span>
                                  </button>
                                )}

                                {/* Print physical receipt invoice */}
                                <button
                                  onClick={handlePrint}
                                  className="py-2.5 px-4 rounded-xl border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-x-2 cursor-pointer col-span-1 sm:col-span-2"
                                >
                                  <Printer className="w-4 h-4 text-neon-cyan" />
                                  <span>{orderLocalT.printInvoice}</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })() : (
                        <div className="h-full py-12 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-500 font-sans flex flex-col justify-center items-center gap-y-2">
                          <ClipboardList className="w-8 h-8 text-neutral-600 animate-pulse" />
                          <span>{orderLocalT.selectToInspect}</span>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
            })()}

            {/* TAB CONTENT: Site Content and Testimonials Editor */}
            {activeTab === 'siteEditor' && (
              <div className="space-y-6 text-left rtl:text-right p-5 rounded-2xl border border-neutral-800 bg-neutral-950/20 max-w-4xl mx-auto">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-y-3 pb-4 border-b border-neutral-800/80">
                  <div className="space-y-1 text-center sm:text-left rtl:text-right">
                    <h3 className="font-orbitron font-extrabold text-sm uppercase tracking-wider text-neon-cyan">
                      {lang === 'ar' ? 'منصة تعديل وتأثيث صفحات المتجر' : 'DYNAMICAL PAGE CONTENT TERMINAL'}
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans">
                      {lang === 'ar' ? 'تحكم بشكل كامل في النصوص، ترويسات اللغة، الصور الرئيسية، وآراء وشرائح العملاء بالموقع.' : 'Complete dynamic customization of website copywriting, display media, and testimonials.'}
                    </p>
                  </div>

                  {/* High Tech Language Selector for the Copywriter */}
                  <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl p-0.5 select-none gap-x-1">
                    <button
                      type="button"
                      onClick={() => setEditorLang('ar')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        editorLang === 'ar' 
                          ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20' 
                          : 'text-neutral-400 border border-transparent hover:text-white'
                      }`}
                    >
                      العربية (AR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorLang('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        editorLang === 'en' 
                          ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20' 
                          : 'text-neutral-400 border border-transparent hover:text-white'
                      }`}
                    >
                      ENGLISH (EN)
                    </button>
                  </div>
                </div>

                {/* Sub Tab Navigation across page structure nodes */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                  {([
                    { id: 'hero', labelAr: 'الواجهة والترحيب', labelEn: 'Hero & Welcome' },
                    { id: 'usp', labelAr: 'مزايا وفارق المعمل', labelEn: 'Core Integrity USPs' },
                    { id: 'footer', labelAr: 'النشرة والفوتر', labelEn: 'Footer & Newsletter' },
                    { id: 'testimonials', labelAr: 'مراجعات وآراء النخبة', labelEn: 'Vanguard Testimonials' },
                    { id: 'userReviews', labelAr: 'إدارة تقييمات العملاء', labelEn: 'Moderate Client Reviews' }
                  ] as const).map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setEditorSection(sec.id)}
                      className={`py-2 px-3 rounded-xl border text-[10px] sm:text-xs font-bold font-orbitron tracking-wider transition-all cursor-pointer ${
                        editorSection === sec.id
                          ? 'bg-neon-purple/15 border-neon-purple text-neon-purple shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                          : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      {lang === 'ar' ? sec.labelAr : sec.labelEn}
                    </button>
                  ))}
                </div>

                {/* Sub Forms Container */}
                <form onSubmit={handleSaveSiteContent} className="space-y-6 pt-2">
                  
                  {/* HERO SECTION FORMS */}
                  {editorSection === 'hero' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Shield Badge */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                          {editorLang === 'ar' ? 'شارة الأمان العليا بالهيدر' : 'Shield Badge'}
                        </label>
                        <input
                          type="text"
                          value={editorLang === 'ar' ? arShieldBadge : enShieldBadge}
                          onChange={(e) => editorLang === 'ar' ? setArShieldBadge(e.target.value) : setEnShieldBadge(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                      </div>

                      {/* Title Glow */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                          {editorLang === 'ar' ? 'العنوان المضيء الرئيسي' : 'Main Title (Glow part)'}
                        </label>
                        <input
                          type="text"
                          value={editorLang === 'ar' ? arTitleGlow : enTitleGlow}
                          onChange={(e) => editorLang === 'ar' ? setArTitleGlow(e.target.value) : setEnTitleGlow(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                      </div>

                      {/* Title Last */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                          {editorLang === 'ar' ? 'بقية العنوان الرئيسي' : 'Main Title (Trailing part)'}
                        </label>
                        <input
                          type="text"
                          value={editorLang === 'ar' ? arTitleLast : enTitleLast}
                          onChange={(e) => editorLang === 'ar' ? setArTitleLast(e.target.value) : setEnTitleLast(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                      </div>

                      {/* Hero Image override */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="block text-[10px] text-neon-cyan uppercase tracking-widest font-mono font-bold">
                          {editorLang === 'ar' ? 'رابط خادم لصورة المعرض الرئيسي (URL)' : 'Hero Device Image Source (Custom URL)'}
                        </label>
                        <input
                          type="text"
                          value={heroImageCustomUrl}
                          onChange={(e) => setHeroImageCustomUrl(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/... or Base64 url"
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-mono text-xs transition-all ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                        <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                          {lang === 'ar' ? 'اتركه فارغاً لاعتماد النموذج ثلاثي الأبعاد الافتراضي الخاص بـ 4U PRO X-Enigma.' : 'Leave empty to display original 4U PRO X-Enigma flagship 3D device render.'}
                        </p>
                      </div>

                      {/* Hero Sub Paragraph */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                          {editorLang === 'ar' ? 'الوصف التقديمي للهيدر' : 'Hero Sub-Paragraph Copy'}
                        </label>
                        <textarea
                          rows={3}
                          value={editorLang === 'ar' ? arSubParagraph : enSubParagraph}
                          onChange={(e) => editorLang === 'ar' ? setArSubParagraph(e.target.value) : setEnSubParagraph(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all resize-none ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                      </div>

                      {/* Founder Hanafy Welcomer Card */}
                      <div className="col-span-1 md:col-span-2 border-t border-neutral-800/60 pt-4 mt-2 space-y-4">
                        <h4 className="text-xs uppercase font-orbitron font-extrabold text-neon-pink flex items-center gap-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{editorLang === 'ar' ? 'محرك ترحيب وتوقيع المهندس أحمد حنفي' : 'Founder Integration parameters'}</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[9px] text-neutral-400 uppercase tracking-wider">
                              {editorLang === 'ar' ? 'اسم مؤسس المعمل والمهندس' : 'Founder Designation Name'}
                            </label>
                            <input
                              type="text"
                              value={editorLang === 'ar' ? arWelcomeName : enWelcomeName}
                              onChange={(e) => editorLang === 'ar' ? setArWelcomeName(e.target.value) : setEnWelcomeName(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border outline-none font-sans text-xs transition-all ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-305 text-black'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[9px] text-neutral-400 uppercase tracking-wider">
                              {editorLang === 'ar' ? 'المسمى الوظيفي والدور التقني' : 'Founder Technical Role'}
                            </label>
                            <input
                              type="text"
                              value={editorLang === 'ar' ? arWelcomeRole : enWelcomeRole}
                              onChange={(e) => editorLang === 'ar' ? setArWelcomeRole(e.target.value) : setEnWelcomeRole(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border outline-none font-sans text-xs transition-all ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-305 text-black'
                              }`}
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 sm:col-span-2">
                            <label className="block text-[9px] text-neutral-400 uppercase tracking-wider">
                              {editorLang === 'ar' ? 'رسالة وقول الترحيب بالعملاء' : 'Founder Hologram Welcome Statement'}
                            </label>
                            <textarea
                              rows={3}
                              value={editorLang === 'ar' ? arWelcomeQuote : enWelcomeQuote}
                              onChange={(e) => editorLang === 'ar' ? setArWelcomeQuote(e.target.value) : setEnWelcomeQuote(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border outline-none font-sans text-xs transition-all resize-none ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-305 text-black'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRO USPs SECTION FORMS */}
                  {editorSection === 'usp' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Integrity Badge */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                            {editorLang === 'ar' ? 'شارة وضمان الموثوقية بمنتصف الصفحة' : 'Section Badge'}
                          </label>
                          <input
                            type="text"
                            value={editorLang === 'ar' ? arUspBadge : enUspBadge}
                            onChange={(e) => editorLang === 'ar' ? setArUspBadge(e.target.value) : setEnUspBadge(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all ${
                              isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                            }`}
                          />
                        </div>

                        {/* USP Main Title (glow) */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                            {editorLang === 'ar' ? 'عنوان مزايا المتجر المضيء' : 'Section Title Glow'}
                          </label>
                          <input
                            type="text"
                            value={editorLang === 'ar' ? arUspGlow : enUspGlow}
                            onChange={(e) => editorLang === 'ar' ? setArArUspGlow(e.target.value) : setEnEnUspGlow(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all ${
                              isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                            }`}
                          />
                        </div>

                        {/* USP Title Last */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                            {editorLang === 'ar' ? 'بقية عنوان مزايا المتجر اللاحق' : 'Section Title Trailing'}
                          </label>
                          <input
                            type="text"
                            value={editorLang === 'ar' ? arUspLast : enUspLast}
                            onChange={(e) => editorLang === 'ar' ? setArArUspLast(e.target.value) : setEnEnUspLast(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all ${
                              isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                            }`}
                          />
                        </div>

                        {/* USP Section intro desc */}
                        <div className="space-y-1.5 col-span-1 sm:col-span-2">
                          <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                            {editorLang === 'ar' ? 'مقدمة ووصف معايير الجودة' : 'Section Sub-Description Copy'}
                          </label>
                          <textarea
                            rows={2}
                            value={editorLang === 'ar' ? arUspDesc : enUspDesc}
                            onChange={(e) => editorLang === 'ar' ? setArArUspDesc(e.target.value) : setEnEnUspDesc(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all resize-none ${
                              isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Map the 3 point edits */}
                      <div className="border-t border-neutral-800/60 pt-4 space-y-6">
                        <h4 className="text-xs uppercase font-orbitron font-extrabold text-neon-cyan flex items-center gap-x-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{editorLang === 'ar' ? 'تعديل نقاط الفارق وعقد الضمان الثابتة الثلاثة بالموقع' : 'Configure individual Integrity Pillars'}</span>
                        </h4>

                        {[
                          { id: 1, title: arUspP1T, setTitle: setArUspP1T, desc: arUspP1D, setDesc: setArUspP1D, hl: arUspP1H, setHl: setArUspP1H, entitle: enUspP1T, setEnTitle: setEnUspP1T, endesc: enUspP1D, setEnDesc: setEnUspP1D, enhl: enUspP1H, setEnHl: setEnUspP1H },
                          { id: 2, title: arUspP2T, setTitle: setArUspP2T, desc: arUspP2D, setDesc: setArUspP2D, hl: arUspP2H, setHl: setArUspP2H, entitle: enUspP2T, setEnTitle: setEnUspP2T, endesc: enUspP2D, setEnDesc: setEnUspP2D, enhl: enUspP2H, setEnHl: setEnUspP2H },
                          { id: 3, title: arUspP3T, setTitle: setArUspP3T, desc: arUspP3D, setDesc: setArUspP3D, hl: arUspP3H, setHl: setArUspP3H, entitle: enUspP3T, setEnTitle: setEnUspP3T, endesc: enUspP3D, setEnDesc: setEnUspP3D, enhl: enUspP3H, setEnHl: setEnUspP3H }
                        ].map((node) => (
                          <div key={node.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/15 space-y-3">
                            <span className="font-mono text-[9px] text-neon-purple font-extrabold uppercase bg-neon-purple/5 px-2 py-0.5 rounded border border-neon-purple/20">
                              {editorLang === 'ar' ? `النقطة التلميترية الضامنة رقم ${node.id}` : `INTEGRITY CORE NODE #${node.id}`}
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[9px] text-neutral-400 font-mono">
                                  {editorLang === 'ar' ? `عنوان النقطة ${node.id}` : 'Node Title'}
                                </label>
                                <input
                                  type="text"
                                  value={editorLang === 'ar' ? node.title : node.entitle}
                                  onChange={(e) => editorLang === 'ar' ? node.setTitle(e.target.value) : node.setEnTitle(e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border outline-none font-sans text-xs transition-all ${
                                    isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                                  }`}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[9px] text-neutral-400 font-mono">
                                  {editorLang === 'ar' ? `شارة التميز الجانبية (الأخضر المضيء)` : 'Highlight Tag'}
                                </label>
                                <input
                                  type="text"
                                  value={editorLang === 'ar' ? node.hl : node.enhl}
                                  onChange={(e) => editorLang === 'ar' ? node.setHl(e.target.value) : node.setEnHl(e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border outline-none font-sans text-xs transition-all ${
                                    isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                                  }`}
                                />
                              </div>

                              <div className="space-y-1 col-span-1 sm:col-span-2">
                                <label className="block text-[9px] text-neutral-400 font-mono">
                                  {editorLang === 'ar' ? 'الوصف والتفاصيل المعتمدة للنقطة' : 'Node Detailed Copy'}
                                </label>
                                <textarea
                                  rows={2}
                                  value={editorLang === 'ar' ? node.desc : node.endesc}
                                  onChange={(e) => editorLang === 'ar' ? node.setDesc(e.target.value) : node.setEnDesc(e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border outline-none font-sans text-xs transition-all resize-none ${
                                    isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FOOTER & NEWSLETTER FORMS */}
                  {editorSection === 'footer' && (
                    <div className="grid grid-cols-1 gap-4">
                      {/* Footer desc brand slogan */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                          {editorLang === 'ar' ? 'شعار ونصوص وصف المتجر في الفوتر' : 'Footer Brand Slogan'}
                        </label>
                        <textarea
                          rows={3}
                          value={editorLang === 'ar' ? arFooterDesc : enFooterDesc}
                          onChange={(e) => editorLang === 'ar' ? setArFooterDesc(e.target.value) : setEnFooterDesc(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all resize-none ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                      </div>

                      {/* Newsletter Title */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                          {editorLang === 'ar' ? 'عنوان صندوق البريد النشرة السيبرانية' : 'Newsletter Title Header'}
                        </label>
                        <input
                          type="text"
                          value={editorLang === 'ar' ? arNewsTitle : enNewsTitle}
                          onChange={(e) => editorLang === 'ar' ? setArNewsTitle(e.target.value) : setEnNewsTitle(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                      </div>

                      {/* Newsletter description */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                          {editorLang === 'ar' ? 'وصف تفاصيل النشرة البريدية والعروض' : 'Newsletter Slogan Sub-Desc'}
                        </label>
                        <textarea
                          rows={2}
                          value={editorLang === 'ar' ? arNewsDesc : enNewsDesc}
                          onChange={(e) => editorLang === 'ar' ? setArNewsDesc(e.target.value) : setEnNewsDesc(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border outline-none font-sans text-xs transition-all resize-none ${
                            isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* VANGUARD TESTIMONIALS SLIDER INJECTOR & LIST */}
                  {editorSection === 'testimonials' && (
                    <div className="space-y-6">
                      
                      {/* Form to Add or Edit Testimonial testimonial card */}
                      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/10 space-y-4 text-left rtl:text-right">
                        <h4 className="text-xs uppercase font-orbitron font-extrabold text-neon-pink">
                          {editTestId 
                            ? (editorLang === 'ar' ? 'تعديل مراجعة العميل السيبراني' : 'MODIFY DESIGNATED PILOT LOG') 
                            : (editorLang === 'ar' ? 'إضافة رأي عميل سيبراني جديد للقائمة' : 'INJECT NEW VANGUARD LOG')}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="space-y-1">
                            <label className="block text-[9px] text-neutral-400 font-sans uppercase">
                              {editorLang === 'ar' ? 'اسم العميل' : 'Client Profile Name'}
                            </label>
                            <input
                              type="text"
                              value={testName}
                              onChange={(e) => setTestName(e.target.value)}
                              placeholder="e.g. Dr. Omar Hanafy"
                              className={`w-full px-3 py-2 rounded-lg border outline-none text-xs transition-all ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                              }`}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] text-neutral-400 font-sans uppercase">
                              {editorLang === 'ar' ? 'الدور التقني وخبرته' : 'Designated Role'}
                            </label>
                            <input
                              type="text"
                              value={testRole}
                              onChange={(e) => setTestRole(e.target.value)}
                              placeholder="e.g. Chief Cybernetic Architect"
                              className={`w-full px-3 py-2 rounded-lg border outline-none text-xs transition-all ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                              }`}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] text-neutral-400 font-sans uppercase">
                              {editorLang === 'ar' ? 'رابط خادم لصورة العميل الشخصية (Avatar URL)' : 'Client Avatar Image (URL)'}
                            </label>
                            <input
                              type="text"
                              value={testAvatar}
                              onChange={(e) => setTestAvatar(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className={`w-full px-3 py-2 rounded-lg border outline-none text-xs transition-all ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                              }`}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] text-neutral-400 font-sans uppercase">
                              {editorLang === 'ar' ? 'منصة النشر والتوثيق' : 'Hub Platform Info'}
                            </label>
                            <input
                              type="text"
                              value={testPlatform}
                              onChange={(e) => setTestPlatform(e.target.value)}
                              placeholder="e.g. TechRadar Premium"
                              className={`w-full px-3 py-2 rounded-lg border outline-none text-xs transition-all ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                              }`}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] text-neutral-400 font-sans uppercase">
                              {editorLang === 'ar' ? 'كثافة التقييم الإشاري (النجوم)' : 'Star Core Rating'}
                            </label>
                            <select
                              value={testRating}
                              onChange={(e) => setTestRating(Number(e.target.value))}
                              className={`w-full px-3 py-2 rounded-lg border outline-none text-xs transition-all ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-850 text-white' : 'bg-white border-neutral-300 text-black'
                              }`}
                            >
                              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                              <option value={3}>⭐⭐⭐ (3/5)</option>
                              <option value={2}>⭐⭐ (2/5)</option>
                              <option value={1}>⭐ (1/5)</option>
                            </select>
                          </div>

                          <div className="space-y-1 col-span-1 sm:col-span-2">
                            <label className="block text-[9px] text-neutral-400 font-sans uppercase">
                              {editorLang === 'ar' ? 'الرأي والتعليق السيبراني الكامل' : 'Vanguard Audit Statement'}
                            </label>
                            <textarea
                              rows={3}
                              value={testComment}
                              onChange={(e) => setTestComment(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border outline-none text-xs transition-all resize-none ${
                                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddTestimonial}
                            className="flex-1 py-2 px-4 rounded-xl bg-neon-cyan text-black font-extrabold font-orbitron text-xs tracking-wider hover:opacity-90 transition-all cursor-pointer"
                          >
                            {editTestId 
                              ? (editorLang === 'ar' ? 'تحديث مراجعة العميل' : 'CONFIRM CUSTOM UPDATE') 
                              : (editorLang === 'ar' ? 'إضافة المراجعة للقائمة المؤقتة' : 'REGISTER LOG ENTRY')}
                          </button>

                          {editTestId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditTestId(null);
                                setTestName('');
                                setTestRole('');
                                setTestComment('');
                                setTestAvatar('');
                                setTestPlatform('');
                                setTestRating(5);
                              }}
                              className="py-2 px-4 rounded-xl border border-neutral-700 text-white text-xs cursor-pointer font-bold uppercase hover:bg-neutral-900"
                            >
                              {editorLang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Display Active List */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase font-orbitron font-extrabold text-neutral-400">
                          {editorLang === 'ar' ? 'آراء ومراجعات النخبة النشطة بالمركبة' : 'ACTIVE VANGUARD TESTIMONIAL DIRECTORY'}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {testimonialsList.map((test) => {
                            const dName = test.overrideName || test.name;
                            const dRole = test.overrideRole || test.role;
                            const dComment = test.overrideComment || test.comment;

                            return (
                              <div key={test.id} className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/5 hover:border-neutral-700 transition-all flex flex-col justify-between gap-y-3">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-x-2.5">
                                    <img src={test.avatar} alt={dName} className="w-8 h-8 rounded-full border border-neutral-850 p-0.5 object-cover" referrerPolicy="no-referrer" />
                                    <div className="text-left rtl:text-right">
                                      <h5 className="font-bold text-xs text-white uppercase tracking-wide leading-none">{dName}</h5>
                                      <span className="text-[9px] text-neon-cyan font-mono italic mt-1 inline-block leading-none">{dRole}</span>
                                    </div>
                                  </div>
                                  
                                  <p className="text-[10px] text-neutral-300 leading-relaxed text-left rtl:text-right line-clamp-3">
                                    "{dComment}"
                                  </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-neutral-800/40 pt-2 font-mono text-[9px]">
                                  <span className="text-amber-500">{'★'.repeat(test.rating)}</span>
                                  <div className="flex gap-x-2.5">
                                    <button
                                      type="button"
                                      onClick={() => handleEditTestimonialClick(test)}
                                      className="text-neon-cyan hover:underline cursor-pointer"
                                    >
                                      {editorLang === 'ar' ? 'تعديل' : 'EDIT'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTestimonial(test.id)}
                                      className="text-rose-450 text-red-400 hover:underline cursor-pointer"
                                    >
                                      {editorLang === 'ar' ? 'حذف' : 'DELETE'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* USER CUSTOMER RATINGS MODERATION PANEL */}
                  {editorSection === 'userReviews' && (
                    <div className="space-y-4">
                      <div className="space-y-1 pb-2 border-b border-neutral-850 dark:border-neutral-850">
                        <h4 className="font-orbitron font-extrabold text-xs text-neon-pink uppercase tracking-widest">
                          {editorLang === 'ar' ? 'لوحة إدارة ومراقبة مراجعات عملاء 4U PRO' : 'MODERATE CLIENT RATING LOGS'}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-sans">
                          {editorLang === 'ar' 
                            ? 'هنا يمكنك استعراض كافة المراجعات الحقيقية التي سجلها العملاء للصفحة والمنتجات وحذف المخالف منها فورا.' 
                            : 'Review and moderate complete customer rating posts. Delete spam or invalid submissions instantly.'}
                        </p>
                      </div>

                      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        {userReviewsList.length === 0 ? (
                          <div className="p-8 text-center rounded-xl border border-dashed border-neutral-805 text-neutral-550 text-xs font-sans">
                            {editorLang === 'ar' ? 'لا يوجد تقييمات عملاء مسجلة حالياً.' : 'No active client reviews listed.'}
                          </div>
                        ) : (
                          userReviewsList.map((rev) => (
                            <div key={rev.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="space-y-1.5 text-left rtl:text-right flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-xs text-white my-0.5">{rev.name}</span>
                                  <span className={`text-[9px] font-mono uppercase bg-neutral-950 px-1.5 py-0.5 rounded font-bold border my-0.5 ${
                                    rev.targetType === 'page' ? 'text-neon-cyan border-neon-cyan/20' : 'text-neon-pink border-neon-pink/20'
                                  }`}>
                                    {rev.targetName}
                                  </span>
                                  <span className="text-[10px] font-mono text-amber-500 font-bold my-0.5">
                                    {'★'.repeat(rev.rating)} ({rev.rating}/5)
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-300 font-sans">
                                  "{rev.comment}"
                                </p>
                                <span className="text-[9px] text-neutral-500 font-mono block mt-1">
                                  {new Date(rev.timestamp).toLocaleString(editorLang === 'ar' ? 'ar-EG' : 'en-US')}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteUserReview(rev.id)}
                                className="py-1.5 px-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/50 text-red-400 text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer self-end sm:self-auto"
                              >
                                {editorLang === 'ar' ? 'حذف التقييم' : 'DELETE REVIEW'}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Unified Global Save Button */}
                  <div className="border-t border-neutral-800/60 pt-5 mt-4">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink text-black font-orbitron font-black text-xs tracking-widest hover:scale-[1.005] transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] cursor-pointer"
                    >
                      {lang === 'ar' ? 'حفظ وتثبيت تعديلات محتوی الصفحة كاملة' : 'SAVE & INTEGRATE FULL WEBSITE CUSTOMIZATIONS'}
                    </button>
                  </div>

                </form>

              </div>
            )}

            {/* TAB CONTENT: Reset / Update Credential Keys */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6 text-left rtl:text-right max-w-lg mx-auto p-4 rounded-2xl border border-neutral-800 bg-neutral-950/20">
                <div className="space-y-1 mb-4 text-center sm:text-left rtl:text-right">
                  <h3 className="font-orbitron font-extrabold text-sm uppercase tracking-wider">{copy.keyChange.title}</h3>
                  <p className="text-xs text-neutral-400 font-sans">{copy.keyChange.subtitle}</p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {/* Password Entry */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                      {copy.keyChange.newPassword}
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="******"
                      className={`w-full px-4 py-2.5 rounded-xl border font-mono tracking-widest outline-none transition-all ${
                        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                      }`}
                    />
                  </div>

                  {/* Confirm Password Entry */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                      {copy.keyChange.confirmPassword}
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="******"
                      className={`w-full px-4 py-2.5 rounded-xl border font-mono tracking-widest outline-none transition-all ${
                        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-300 text-black'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-orbitron font-black text-xs tracking-widest hover:scale-[1.01] transition-all hover:shadow-[0_0_15px_rgba(255,0,127,0.3)] cursor-pointer"
                >
                  {copy.keyChange.submitBtn}
                </button>
              </form>
            )}

          </div>
        )}

      </motion.div>
    </div>
  );
}

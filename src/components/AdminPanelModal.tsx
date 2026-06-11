import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, ShieldCheck, Key, Settings, Plus, Trash2, 
  Sparkles, RefreshCw, Upload, Eye, EyeOff, LayoutGrid, CheckCircle,
  ClipboardList, Printer, Coins, Truck, Search
} from 'lucide-react';
import { Product } from '../types';
import { Language } from '../translations';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Active Tab: 'add' or 'manage' or 'password' or 'orders'
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'password' | 'orders'>('add');

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

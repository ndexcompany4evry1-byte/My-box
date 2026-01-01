import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, Smartphone, CircleDot, Palette, Image as ImageIcon, Upload,
  ArrowLeft, Check, AlertCircle, X, Link, Phone, MapPin, Mail, Calendar,
  Instagram, Twitter, Facebook, Linkedin, Globe, User, Briefcase, Edit3,
  Save, Share2, Download, Eye, EyeOff, Hash, FileText, BarChart3, Lock,
  RotateCcw, Plus, Minus, Copy, CheckCircle, Moon, Sun, CreditCard,
  FileDown, FileUp, LayoutTemplate, DownloadCloud, Contact2, FileCheck
} from "lucide-react";

// Mock QR pattern generator (simulates real QR structure)
const MockQRPattern = ({ size = 120, color = '#2563eb', style = 'square' }) => {
  const borderRadius = style === 'square' ? '0' :
    style === 'rounded' ? '8px' :
    style === 'circular' ? '50%' : '50%';
  const patternSize = Math.floor(size * 0.8);
  const cellSize = Math.floor(patternSize / 21); // Standard QR size
  const padding = Math.floor((size - patternSize) / 2);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Position markers (three corners) */}
      <div className="absolute top-2 left-2" style={{ width: cellSize * 7, height: cellSize * 7 }}>
        <div className="w-full h-full border-4" style={{ borderColor: color, borderRadius: '10%' }} />
        <div className="absolute inset-2 border-4" style={{ borderColor: color, borderRadius: '15%' }} />
        <div className="absolute inset-4" style={{ backgroundColor: color, borderRadius: '20%' }} />
      </div>
      <div className="absolute top-2 right-2" style={{ width: cellSize * 7, height: cellSize * 7 }}>
        <div className="w-full h-full border-4" style={{ borderColor: color, borderRadius: '10%' }} />
        <div className="absolute inset-2 border-4" style={{ borderColor: color, borderRadius: '15%' }} />
        <div className="absolute inset-4" style={{ backgroundColor: color, borderRadius: '20%' }} />
      </div>
      <div className="absolute bottom-2 left-2" style={{ width: cellSize * 7, height: cellSize * 7 }}>
        <div className="w-full h-full border-4" style={{ borderColor: color, borderRadius: '10%' }} />
        <div className="absolute inset-2 border-4" style={{ borderColor: color, borderRadius: '15%' }} />
        <div className="absolute inset-4" style={{ backgroundColor: color, borderRadius: '20%' }} />
      </div>
      {/* Random data pattern */}
      <div
        className="absolute"
        style={{
          top: padding,
          left: padding,
          width: patternSize,
          height: patternSize,
          borderRadius: borderRadius
        }}
      >
        {Array.from({ length: 441 }).map((_, i) => {
          const row = Math.floor(i / 21);
          const col = i % 21;
          // Skip position markers areas
          const skip =
            (row < 7 && col < 7) ||
            (row < 7 && col > 14) ||
            (row > 14 && col < 7) ||
            (row === 6 && col === 6) ||
            (row === 6 && col === 14) ||
            (row === 14 && col === 6);
          if (skip) return null;
          const shouldFill = Math.random() > 0.6;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: row * cellSize,
                left: col * cellSize,
                width: cellSize - 1,
                height: cellSize - 1,
                backgroundColor: shouldFill ? color : 'transparent',
                borderRadius: style === 'dots' ? '50%' : '2px'
              }}
            />
          );
        })}
      </div>
      {/* Center logo/identifier */}
      <div className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center z-10">
        <QrCode className="w-4 h-4" style={{ color: color }} />
      </div>
    </div>
  );
};

export default function App() {
  // User profiles state (multi-card support)
  const [profiles, setProfiles] = useState([
    {
      id: 'profile-' + Math.random().toString(36).substr(2, 9),
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      location: '',
      bio: '',
      avatar: '',
      social: {
        instagram: '',
        twitter: '',
        linkedin: '',
        facebook: '',
        website: ''
      },
      services: [],
      workingHours: '',
      customFields: [],
      design: {
        qrStyle: 'square',
        qrColor: '#2563eb',
        bgType: 'gradient',
        bgColor: '#ffffff',
        bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        logoUrl: '',
        qrPosition: 'center'
      }
    }
  ]);
  const [currentProfileId, setCurrentProfileId] = useState(profiles[0].id);
  const [selectedProduct, setSelectedProduct] = useState('qr');
  const [isDigitalView, setIsDigitalView] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 400, height: 400 });
  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [scanCount, setScanCount] = useState(0);
  const [lastScan, setLastScan] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activePreset, setActivePreset] = useState('minimal');

  // Get current profile
  const currentProfile = profiles.find(p => p.id === currentProfileId) || profiles[0];
  const design = currentProfile.design;

  // Responsive preview
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      const baseSize = window.innerWidth < 768 ? 300 : 400;
      setPreviewSize({ width: baseSize, height: baseSize });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock scan data (demo only)
  useEffect(() => {
    const mockScan = () => {
      if (isDigitalView) {
        setScanCount(prev => prev + 1);
        setLastScan(new Date().toLocaleString());
      }
    };
    const interval = setInterval(mockScan, 30000);
    return () => clearInterval(interval);
  }, [isDigitalView]);

  // Apply design presets
  const applyPreset = (preset) => {
    setActivePreset(preset);
    const presets = {
      minimal: {
        qrStyle: 'square',
        qrColor: '#000000',
        bgType: 'color',
        bgColor: '#ffffff',
        bgGradient: '',
        logoUrl: ''
      },
      business: {
        qrStyle: 'rounded',
        qrColor: '#1f2937',
        bgType: 'gradient',
        bgColor: '#ffffff',
        bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
        logoUrl: currentProfile.avatar || ''
      },
      creative: {
        qrStyle: 'circular',
        qrColor: '#8b5cf6',
        bgType: 'gradient',
        bgColor: '#ffffff',
        bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-100',
        logoUrl: ''
      }
    };
    updateProfileDesign(presets[preset]);
  };

  // Update profile functions
  const updateProfile = (field, value) => {
    setProfiles(prev => prev.map(p =>
      p.id === currentProfileId
        ? { ...p, [field]: value }
        : p
    ));
  };

  const updateProfileDesign = (designUpdates) => {
    setProfiles(prev => prev.map(p =>
      p.id === currentProfileId
        ? { ...p, design: { ...p.design, ...designUpdates } }
        : p
    ));
  };

  const updateSocial = (platform, value) => {
    setProfiles(prev => prev.map(p =>
      p.id === currentProfileId
        ? { ...p, social: { ...p.social, [platform]: value } }
        : p
    ));
  };

  // ✅ الدالة المفقودة — تم إضافتها هنا
  const handleProductSelect = (type) => {
    setSelectedProduct(type);
  };

  // Add custom field
  const addCustomField = () => {
    setProfiles(prev => prev.map(p =>
      p.id === currentProfileId
        ? { ...p, customFields: [...p.customFields, { label: '', value: '' }] }
        : p
    ));
  };

  const updateCustomField = (index, field, value) => {
    setProfiles(prev => prev.map(p => {
      if (p.id !== currentProfileId) return p;
      const updatedFields = [...p.customFields];
      updatedFields[index][field] = value;
      return { ...p, customFields: updatedFields };
    }));
  };

  const removeCustomField = (index) => {
    setProfiles(prev => prev.map(p =>
      p.id === currentProfileId
        ? { ...p, customFields: p.customFields.filter((_, i) => i !== index) }
        : p
    ));
  };

  // Add new profile
  const addNewProfile = () => {
    const newProfile = {
      id: 'profile-' + Math.random().toString(36).substr(2, 9),
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      location: '',
      bio: '',
      avatar: '',
      social: {
        instagram: '',
        twitter: '',
        linkedin: '',
        facebook: '',
        website: ''
      },
      services: [],
      workingHours: '',
      customFields: [],
      design: {
        qrStyle: 'square',
        qrColor: '#2563eb',
        bgType: 'gradient',
        bgColor: '#ffffff',
        bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        logoUrl: '',
        qrPosition: 'center'
      }
    };
    setProfiles(prev => [...prev, newProfile]);
    setCurrentProfileId(newProfile.id);
    setCurrentStep(1);
  };

  // Generate unique URL
  const getUniqueUrl = () => {
    return `https://smartid.example/${currentProfileId}`;
  };

  // Render QR visual with mock pattern
  const renderQrVisual = () => {
    const qrClasses = {
      square: 'rounded-none',
      rounded: 'rounded-xl',
      circular: 'rounded-full',
      dots: 'rounded-full'
    };
    return (
      <motion.div
        className={`bg-white p-3 flex flex-col items-center justify-center shadow-lg ${qrClasses[design.qrStyle]}`}
        animate={{ backgroundColor: design.qrColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <MockQRPattern
            size={80}
            color={design.qrColor}
            style={design.qrStyle}
          />
          <span className="text-xs font-medium text-white mt-2">Scan Me</span>
        </div>
      </motion.div>
    );
  };

  // Render NFC chip
  const renderNfcChip = () => (
    <motion.div
      className="absolute bottom-4 right-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full p-2 shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Smartphone className="w-6 h-6 text-white" />
    </motion.div>
  );

  // Render card preview
  const renderCardPreview = () => {
    const positionClasses = {
      'top-left': 'absolute top-6 left-6',
      'top-right': 'absolute top-6 right-6',
      'bottom-left': 'absolute bottom-6 left-6',
      'bottom-right': 'absolute bottom-6 right-6',
      'center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };
    return (
      <motion.div
        className={`relative bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-100 ${design.bgGradient}`}
        style={{
          width: previewSize.width,
          height: previewSize.height,
          backgroundColor: design.bgType === 'color' ? design.bgColor : 'transparent'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo/Avatar */}
        {(design.logoUrl || currentProfile.avatar) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            {design.logoUrl ? (
              <img
                src={design.logoUrl}
                alt="Logo"
                className="h-8 object-contain"
                onError={(e) => e.target.src = 'https://placehold.co/100x40/2563eb/white?text=LOGO'}
              />
            ) : currentProfile.avatar ? (
              <img
                src={currentProfile.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                onError={(e) => e.target.src = 'https://placehold.co/80x80/2563eb/white?text=' + (currentProfile.name?.charAt(0) || 'U')}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {currentProfile.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        )}
        {/* QR Code */}
        <motion.div
          className={positionClasses[design.qrPosition]}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragMomentum={false}
        >
          {renderQrVisual()}
        </motion.div>
        {/* NFC Chip */}
        {(selectedProduct === 'nfc' || selectedProduct === 'both') && renderNfcChip()}
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-indigo-600/10 rounded-tl-full" />
      </motion.div>
    );
  };

  // Generate vCard
  const generateVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${currentProfile.name}
ORG:${currentProfile.company}
TITLE:${currentProfile.title}
TEL:${currentProfile.phone}
EMAIL:${currentProfile.email}
URL:${currentProfile.website}
ADR:${currentProfile.location}
NOTE:${currentProfile.bio}
END:VCARD`;
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProfile.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Digital Identity View with Dark Mode
  const DigitalIdentityView = () => {
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(getUniqueUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };
    const hasContent = (value) => value && value.trim();
    const bgColor = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 to-blue-100';
    const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
    const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
    const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen ${bgColor} py-8 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDigitalView(false)}
              className={`flex items-center space-x-2 ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} font-medium`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Editor</span>
            </motion.button>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className={`flex items-center space-x-2 px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition`}
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'} rounded-lg`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
          <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden`}>
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  {currentProfile.avatar ? (
                    <img
                      src={currentProfile.avatar}
                      alt={currentProfile.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                      onError={(e) => e.target.src = 'https://placehold.co/120x120/2563eb/white?text=' + (currentProfile.name?.charAt(0) || 'U')}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-lg">
                      {currentProfile.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{currentProfile.name || 'Your Name'}</h1>
                    <p className="text-indigo-100 text-lg">{currentProfile.title || 'Your Title'}</p>
                    {hasContent(currentProfile.company) && (
                      <p className="text-white/80">{currentProfile.company}</p>
                    )}
                  </div>
                </div>
                {password && (
                  <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Protected</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {hasContent(currentProfile.phone) && (
                  <div className={`flex items-start space-x-3 p-4 ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} rounded-xl`}>
                    <Phone className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className={`text-sm font-medium ${mutedColor}`}>Phone</p>
                      <p className="text-lg font-semibold">{currentProfile.phone}</p>
                    </div>
                  </div>
                )}
                {hasContent(currentProfile.email) && (
                  <div className={`flex items-start space-x-3 p-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-xl`}>
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className={`text-sm font-medium ${mutedColor}`}>Email</p>
                      <p className="text-lg font-semibold">{currentProfile.email}</p>
                    </div>
                  </div>
                )}
                {hasContent(currentProfile.location) && (
                  <div className={`flex items-start space-x-3 p-4 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-xl`}>
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className={`text-sm font-medium ${mutedColor}`}>Location</p>
                      <p className="text-lg font-semibold">{currentProfile.location}</p>
                    </div>
                  </div>
                )}
                {hasContent(currentProfile.website) && (
                  <div className={`flex items-start space-x-3 p-4 ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-xl`}>
                    <Globe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className={`text-sm font-medium ${mutedColor}`}>Website</p>
                      <p className="text-lg font-semibold">{currentProfile.website}</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Bio */}
              {hasContent(currentProfile.bio) && (
                <div className={`mb-8 p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl`}>
                  <h3 className={`text-lg font-bold ${textColor} mb-3`}>About Me</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{currentProfile.bio}</p>
                </div>
              )}
              {/* Services */}
              {currentProfile.services.length > 0 && (
                <div className={`mb-8 p-6 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'} rounded-xl`}>
                  <h3 className={`text-lg font-bold ${textColor} mb-3`}>Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.services.map((service, index) => (
                      <span key={index} className={`px-3 py-1 ${darkMode ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-800'} rounded-full text-sm font-medium`}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Working Hours */}
              {hasContent(currentProfile.workingHours) && (
                <div className={`mb-8 p-6 ${darkMode ? 'bg-cyan-900/20' : 'bg-cyan-50'} rounded-xl`}>
                  <h3 className={`text-lg font-bold ${textColor} mb-3`}>Working Hours</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentProfile.workingHours}</p>
                </div>
              )}
              {/* Custom Fields */}
              {currentProfile.customFields.length > 0 && (
                <div className={`mb-8 p-6 ${darkMode ? 'bg-pink-900/20' : 'bg-pink-50'} rounded-xl`}>
                  <h3 className={`text-lg font-bold ${textColor} mb-3`}>Additional Info</h3>
                  <div className="space-y-3">
                    {currentProfile.customFields.map((field, index) => (
                      hasContent(field.label) && hasContent(field.value) && (
                        <div key={index} className="flex items-start space-x-3">
                          <Hash className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className={`text-sm font-medium ${mutedColor}`}>{field.label}</p>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{field.value}</p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              {/* Social Links */}
              <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl`}>
                <h3 className={`text-lg font-bold ${textColor} mb-4`}>Connect With Me</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {Object.entries(currentProfile.social).map(([platform, handle]) => {
                    if (!hasContent(handle)) return null;
                    const icons = {
                      instagram: Instagram,
                      twitter: Twitter,
                      linkedin: Linkedin,
                      facebook: Facebook,
                      website: Globe
                    };
                    const Icon = icons[platform] || Globe;
                    return (
                      <a
                        key={platform}
                        href={platform === 'website' ? `https://${handle}` : `https://${platform}.com/${handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center space-y-2 p-3 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'} rounded-lg transition group`}
                      >
                        <Icon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition" />
                        <span className={`text-xs ${darkMode ? 'text-gray-300 group-hover:text-indigo-400' : 'text-gray-700 group-hover:text-indigo-600'} transition text-center`}>
                          {platform === 'website' ? 'Website' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Smart CTA */}
            <div className={`px-8 py-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} border-t flex flex-col sm:flex-row sm:items-center sm:justify-between`}>
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Verified Identity</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{scanCount} scans</span>
                </div>
                {lastScan && (
                  <div className="flex items-center space-x-2 text-purple-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Last: {lastScan}</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateVCard}
                  className={`px-4 py-2 ${darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition flex items-center space-x-2`}
                >
                  <Contact2 className="w-4 h-4" />
                  <span>Save Contact</span>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition flex items-center space-x-2`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Profile Form Step with Multi-Profile Support
  const ProfileForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Profile Switcher */}
      {profiles.length > 1 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Your Profiles ({profiles.length})</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addNewProfile}
              className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Profile</span>
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profiles.map((profile) => (
              <motion.button
                key={profile.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentProfileId(profile.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  profile.id === currentProfileId
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {profile.name || `Profile ${profiles.indexOf(profile) + 1}`}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={currentProfile.name}
            onChange={(e) => updateProfile('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
          <input
            type="text"
            value={currentProfile.title}
            onChange={(e) => updateProfile('title', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Digital Marketing Specialist"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
          <input
            type="text"
            value={currentProfile.company}
            onChange={(e) => updateProfile('company', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar/Photo URL</label>
          <input
            type="text"
            value={currentProfile.avatar}
            onChange={(e) => updateProfile('avatar', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={currentProfile.phone}
            onChange={(e) => updateProfile('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={currentProfile.email}
            onChange={(e) => updateProfile('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="text"
            value={currentProfile.website}
            onChange={(e) => updateProfile('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="yourwebsite.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={currentProfile.location}
            onChange={(e) => updateProfile('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="City, Country"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
        <textarea
          value={currentProfile.bio}
          onChange={(e) => updateProfile('bio', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Tell people about yourself, your expertise, and what you do..."
        />
      </div>
      {/* Services */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Services/Expertise</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {currentProfile.services.map((service, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full flex items-center space-x-2">
              <span>{service}</span>
              <button
                onClick={() => setProfiles(prev => prev.map(p =>
                  p.id === currentProfileId
                    ? { ...p, services: p.services.filter((_, i) => i !== index) }
                    : p
                ))}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                setProfiles(prev => prev.map(p =>
                  p.id === currentProfileId
                    ? { ...p, services: [...p.services, e.target.value.trim()] }
                    : p
                ));
                e.target.value = '';
              }
            }}
            placeholder="Add a service and press Enter"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      {/* Working Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
        <input
          type="text"
          value={currentProfile.workingHours}
          onChange={(e) => updateProfile('workingHours', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., Mon-Fri: 9AM-5PM"
        />
      </div>
      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
          <input
            type="text"
            value={currentProfile.social.instagram}
            onChange={(e) => updateSocial('instagram', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="@username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X</label>
          <input
            type="text"
            value={currentProfile.social.twitter}
            onChange={(e) => updateSocial('twitter', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="@username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
          <input
            type="text"
            value={currentProfile.social.linkedin}
            onChange={(e) => updateSocial('linkedin', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
          <input
            type="text"
            value={currentProfile.social.facebook}
            onChange={(e) => updateSocial('facebook', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="username"
          />
        </div>
      </div>
      {/* Custom Fields */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">Custom Fields</label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCustomField}
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Field</span>
          </motion.button>
        </div>
        <div className="space-y-3">
          {currentProfile.customFields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                placeholder="Field label"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                placeholder="Field value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeCustomField(index)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Security Settings with proper disclaimers
  const SecuritySettings = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Link Protection (Demo Mode)
        </h3>
        <p className="text-blue-700 mb-4">
          ⚠️ <strong>Note:</strong> Password protection requires backend implementation.
          This is a frontend simulation only. In production, this would integrate with Firebase Functions
          for actual security validation.
        </p>
        <div className="flex items-center space-x-3">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter password to protect your link (demo only)"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPassword(!showPassword)}
            className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.button>
        </div>
        {password && (
          <div className="mt-3 text-green-600 flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Demo password set (not actually secured)</span>
          </div>
        )}
      </div>
      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Your Unique Link
        </h3>
        <div className="flex items-center space-x-3">
          <code className="flex-1 px-3 py-2 bg-white rounded-lg font-mono text-sm truncate border">
            {getUniqueUrl()}
          </code>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigator.clipboard.writeText(getUniqueUrl())}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-green-700 mt-3 text-sm">
          This unique link will be embedded in your QR code and NFC tag.
          <strong className="block mt-2">NFC Implementation Note:</strong>
          NFC tags will be pre-programmed with this exact URL during physical production.
        </p>
      </div>
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Analytics & Statistics (Demo)
        </h3>
        <p className="text-purple-700 mb-4">
          ⚠️ <strong>Note:</strong> Scan tracking requires backend implementation with Firestore.
          This shows simulated data for demonstration purposes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{scanCount}</div>
            <div className="text-sm text-purple-700">Total Scans</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{lastScan ? '✓' : '—'}</div>
            <div className="text-sm text-purple-700">Last Activity</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{password ? '🔒' : '🔓'}</div>
            <div className="text-sm text-purple-700">{password ? 'Password Set' : 'Public'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Design Step with Presets
  const DesignStep = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Design & Customization</h2>
      <p className="text-gray-600 mb-6">Customize the appearance of your smart card and QR code.</p>
      {/* Presets */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Presets</h3>
        <div className="grid grid-cols-3 gap-3">
          {['minimal', 'business', 'creative'].map((preset) => (
            <motion.button
              key={preset}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => applyPreset(preset)}
              className={`p-4 rounded-xl border-2 transition-all ${
                activePreset === preset
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <p className={`text-sm font-medium capitalize ${
                activePreset === preset ? 'text-indigo-700' : 'text-gray-700'
              }`}>
                {preset}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {/* Interaction Method */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Method</h3>
          <div className="grid grid-cols-3 gap-3">
            {['qr', 'nfc', 'both'].map((type) => {
              const isSelected = selectedProduct === type;
              const isRecommended = type === 'both';
              return (
                <motion.button
                  key={type}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProductSelect(type)} // ✅ الآن معرّفة
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-xs font-bold text-white px-2 py-0.5 rounded-full shadow">
                      Recommended
                    </div>
                  )}
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {type === 'qr' && <QrCode className="w-5 h-5" />}
                    {type === 'nfc' && <Smartphone className="w-5 h-5" />}
                    {type === 'both' && (
                      <div className="flex space-x-1">
                        <QrCode className="w-4 h-4" />
                        <Smartphone className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-indigo-700' : 'text-gray-700'
                  }`}>
                    {type === 'qr' && 'QR Only'}
                    {type === 'nfc' && 'NFC Only'}
                    {type === 'both' && 'QR + NFC'}
                  </p>
                </motion.button>
              );
            })}
          </div>
          {selectedProduct !== 'qr' && (
            <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              <strong>NFC Implementation:</strong> NFC tags will be pre-programmed with your unique URL during physical production.
              The same URL is embedded in both QR and NFC for seamless experience.
            </div>
          )}
        </div>
        {/* QR Customization */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Appearance</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
              <div className="grid grid-cols-4 gap-2">
                {['square', 'rounded', 'circular', 'dots'].map((shape) => {
                  const isSelected = design.qrStyle === shape;
                  return (
                    <motion.button
                      key={shape}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateProfileDesign({ qrStyle: shape })}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className={`w-4 h-4 ${
                        shape === 'square' && 'bg-gray-700'
                        || shape === 'rounded' && 'bg-gray-700 rounded'
                        || shape === 'circular' && 'bg-gray-700 rounded-full'
                        || shape === 'dots' && 'bg-gradient-to-br from-gray-700 to-gray-500 rounded-full'
                      }`} />
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-6 gap-2">
                {['#2563eb', '#166534', '#b91c1c', '#8b5cf6', '#000000', '#059669'].map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateProfileDesign({ qrColor: color })}
                    className={`aspect-square rounded-full border-2 ${
                      design.qrColor === color ? 'border-indigo-500 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Background & Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['color', 'gradient', 'image'].map((type) => {
                const isSelected = design.bgType === type;
                return (
                  <motion.button
                    key={type}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateProfileDesign({ bgType: type })}
                    className={`py-2 px-3 rounded-lg border transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo</label>
            <input
              type="text"
              value={design.logoUrl}
              onChange={(e) => updateProfileDesign({ logoUrl: e.target.value })}
              placeholder="Enter logo URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Export Step with Professional Options
  const ExportStep = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview & Export</h2>
      <p className="text-gray-600 mb-6">Review your smart identity and download or share it.</p>
      <div className="text-center mb-6">
        <div className="text-sm text-indigo-600 font-medium mb-2">Your Unique Link</div>
        <code className="px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm border">
          {getUniqueUrl()}
        </code>
        <p className="text-xs text-gray-500 mt-2">
          This link is embedded in your QR code and NFC tag
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center space-y-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
        >
          <DownloadCloud className="w-8 h-8 text-indigo-600" />
          <span className="text-sm font-medium">QR SVG</span>
          <span className="text-xs text-gray-500">Vector format</span>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center space-y-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition"
        >
          <FileDown className="w-8 h-8 text-blue-600" />
          <span className="text-sm font-medium">PNG Card</span>
          <span className="text-xs text-gray-500">High quality</span>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center space-y-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition"
        >
          <FileText className="w-8 h-8 text-green-600" />
          <span className="text-sm font-medium">PDF Print</span>
          <span className="text-xs text-gray-500">CMYK ready</span>
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDigitalView(true)}
          className="flex flex-col items-center space-y-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition"
        >
          <Eye className="w-8 h-8 text-purple-600" />
          <span className="text-sm font-medium">Preview</span>
          <span className="text-xs text-gray-500">Digital profile</span>
        </motion.button>
      </div>
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <h4 className="font-medium text-amber-800 mb-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Production Notes
        </h4>
        <ul className="text-amber-700 text-sm space-y-1">
          <li>• QR codes are generated with error correction level H (30%)</li>
          <li>• NFC tags are programmed with your unique URL during manufacturing</li>
          <li>• All exports include bleed areas and crop marks for professional printing</li>
          <li>• Physical cards are printed on 400gsm premium stock with matte lamination</li>
        </ul>
      </div>
    </div>
  );

  // Main Design Studio View
  const DesignStudioView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartID</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium">
                Sign In
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 mb-6">
            Create Your Personalized Smart Identity
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Design professional smart cards with QR codes and NFC tags that lead directly to your custom digital profile.
            Everything is personalized to your brand and accessible through a unique secure link.
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Step Navigation */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setCurrentStep(step)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                      currentStep === step
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {step}
                  </motion.button>
                  {step < 4 && (
                    <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                {currentStep === 1 && <ProfileForm />}
                {currentStep === 2 && <DesignStep />}
                {currentStep === 3 && <SecuritySettings />}
                {currentStep === 4 && <ExportStep />}
              </motion.div>
            </AnimatePresence>
            {/* Step Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-medium ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition"
              >
                {currentStep === 4 ? 'Finish' : 'Next'}
              </motion.button>
            </div>
          </div>
          {/* Preview Panel */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Live Preview</h3>
                <div className="flex justify-center mb-4">
                  {renderCardPreview()}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">QR Code links to:</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono block truncate border">
                    {getUniqueUrl()}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDigitalView(true)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg text-sm font-medium w-full"
                  >
                    View Digital Profile
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return isDigitalView ? <DigitalIdentityView /> : <DesignStudioView />;
}

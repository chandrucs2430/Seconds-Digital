import { useState, useRef, useEffect, FormEvent } from 'react';
import heroVideo from '../a_realiastic_drone_shot_of_tri.mp4';
import dellLaptopImage from '../DELL.jpg';

// ─── Types ──────────────────────────────────────────────────────────────────
type Page = 'landing' | 'products' | 'about' | 'reviews';

interface User {
  fullName: string;
  phone: string;
  email: string;
  district: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
// ↓ Replace with your actual WhatsApp business number (country code + digits only)
const WHATSAPP_NUMBER = '918838314771';

const DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam',
  'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
  'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
  'Tiruppur', 'Tiruvannamalai', 'Tiruvallur', 'Vellore', 'Villupuram',
  'Virudhunagar',
];

const PRODUCTS: Product[] = [
  {
    id: 1, name: 'DELL Latitude 5401',
    description: `9th Gen Intel Core i5 H-Series | 8GB RAM | 256GB SSD | 2GB Dedicated NVIDIA Graphics | Backlit Keyboard | Wi-Fi | USB Connectivity | Good Battery Backup | Original Charger | Ideal for Multitasking, Coding & Professional Use`,
    fullDescription: `Key Features: 9th Gen Intel Core i5 H-Series processor for powerful multitasking and productivity.2GB Dedicated NVIDIA Graphics for enhanced visual and GPU performance.8GB RAM + 256GB SSD for responsive performance and faster boot times.Backlit Keyboard for comfortable typing in low-light conditions.Wi-Fi & USB Connectivity with charger included.Good Battery Backup for everyday work, study, and professional usage`,
    price: 25999, image: 'https://i.pinimg.com/736x/7b/0e/84/7b0e842567476d5859497bbcaff4f9a8.jpg',
    category: 'Dell', rating: 4.8, reviews: 124, badge: 'Bestseller',
  },
  {
    id: 2, name: 'HP PROBOOK 440 G7',
    description: `10th Gen Intel Core i5 | 8GB RAM | 256GB SSD | Premium Metal Body | Dual Storage Provision | Fingerprint Sensor | Camera | Wi-Fi | LAN | USB | HDMI | Good Battery Backup | Original Charger | 1-Year Warranty`,
    fullDescription: `Key Features: 10th Gen Intel Core i5 processor for efficient multitasking and productivity.8GB RAM + 256GB SSD delivers responsive performance and faster boot/application loading.Premium Metal Body with a professional, durable design.Dual Storage Provision for future storage expansion.Fingerprint Sensor, camera, Wi-Fi, LAN, USB and HDMI connectivity.Good Battery Backup for everyday work and study.Original Charger + 1-Year Warranty included.`,
    price: 26499, originalPrice: 29999,
    image: 'https://i.pinimg.com/1200x/09/11/4f/09114fb2a08d0080388602cdf53efde4.jpg',
    category: 'Hp', rating: 4.9, reviews: 87, badge: 'Hot deal',
  },
  {
    id: 3, name: 'Levono Thinkpad T14',
    description: '10th Gen Intel Core i5 | 8GB RAM | 256GB SSD | Business-Class ThinkPad Build | Camera | Wi-Fi Connectivity | Good Battery Backup | Original Charger | Import Grade | Excellent Condition | Ideal for Office Work, Coding & Productivity',
    fullDescription: `Lenovo ThinkPad T14 with powerful performance, premium business-class design, fast SSD storage, smooth multitasking, and a sharp 14-inch display—ideal for office work, coding, study, and professional use.
`,
    price: 23999,originalPrice: 26499,
    image: 'https://i.pinimg.com/736x/f2/b6/9b/f2b69b23313b68146c66dc888dc90fa2.jpg',
    category: 'Lenovo', rating: 4.7, reviews: 203,
  },
  {
    id: 4, name: 'MACBOOK PRO A2141',
    description: 'Intel Core i9 8-Core | 16GB RAM | 1TB SSD | 4GB AMD Radeon Pro Graphics | 16″ Retina Display | 500 Nits Brightness | Touch Bar | 195 Battery Cycles | Apple Charger | A++++ Grade | Like-New Condition',
    fullDescription: `Apple MacBook Pro 16-inch with 8-Core Intel Core i9 2.4GHz, 16GB RAM, 1TB SSD, 4GB AMD Radeon Pro Graphics, Retina Display, Touch Bar, 195 battery cycles, A++++ Like-New Condition, with Apple Charger included.

`,
     price: 55000,originalPrice: 69999,
     image: 'https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111932_sp809mbp16touch-space-2019.jpeg',
    category: 'Apple', rating: 4.6, reviews: 56,
  },
  {
    id: 5, name: 'DELL LATITUDE 7400',
    description: '8th Gen Intel Core i5 | 8GB RAM | 256GB SSD | Touchscreen Display | Premium Business-Class Design | Camera | Wi-Fi | USB | HDMI | Good Battery Backup | Original Charger | Import Grade | Excellent Condition',
    fullDescription: `Dell Latitude 7400 with powerful performance, premium business-class design, fast SSD storage, smooth multitasking, and a 14-inch Full HD display—ideal for office work, coding, study, and professional use.
`,
    price: 24999, originalPrice: 27999,
    image: dellLaptopImage,
    category: 'DELL', rating: 4.8, reviews: 312, badge: 'New',
  },
  {
    id: 6, name: 'DELL LATITUDE 5300',
    description: 'Dell Latitude 5300 with reliable performance, compact 13.3-inch design, fast SSD storage, smooth multitasking, and a professional build—ideal for business, office work, coding, study, and everyday use.',
    fullDescription: 'Dell Latitude 5300 – Compact and reliable business laptop with powerful performance, speedy SSD, crisp display, and excellent portability, perfect for work, study, coding, and everyday productivity.',
    price: 17999, image: dellLaptopImage,
    category: 'DELL', rating: 4.9, reviews: 178, badge: 'Premium',
  },
  {
    id: 7, name: 'ACER  ONE Z 14',
    description: 'Acer One Z 14 – Stylish and lightweight laptop offering reliable everyday performance, smooth multitasking, fast storage, and a 14-inch display, ideal for students, office work, browsing, and entertainment.',
    fullDescription: 'Acer One Z 14 – Compact and portable laptop with efficient performance, sleek design, responsive display, and ample storage, perfect for study, work, online classes, and daily computing.',
    price: 12999, image: 'https://www.globalbrand.com.bd/image/cache/catalog/LAPTOP/Acer/Acer-One-Z14-52M-12th-Gen-Core-i5-Laptop-1-1200x1200.jpg',
    category: 'ACER', rating: 4.7, reviews: 94,
  },
  {
    id: 8, name: 'DELL LATITUDE 5520',
    description: 'Dell Latitude 5520 – Premium 15.6-inch business laptop delivering reliable performance, smooth multitasking, fast SSD storage, and a durable professional design, ideal for office work, coding, and productivity.',
    fullDescription: 'Dell Latitude 5520 – Powerful and versatile business laptop with a large 15.6-inch display, responsive performance, fast storage, and professional build, perfect for work, study, and everyday computing.',
    price: 31999, image: dellLaptopImage,
    category: 'DELL', rating: 4.9, reviews: 61, badge: 'Exclusive',
  },
  {
    id: 9, name: 'LENOVO THINKPAD L450',
    description: 'Lenovo ThinkPad L450 – Reliable 14-inch business laptop with a durable ThinkPad design, smooth everyday performance, comfortable keyboard, and excellent portability, ideal for office work, study, and productivity.',
    fullDescription: 'Lenovo ThinkPad L450 – Compact and dependable laptop featuring a business-class build, responsive performance, classic ThinkPad keyboard, and portable 14-inch design, perfect for work, coding, study, and daily use.',
    price: 12499, image: 'https://i.pinimg.com/736x/f2/b6/9b/f2b69b23313b68146c66dc888dc90fa2.jpg',
    category: 'LENOVO', rating: 4.9, reviews: 61, badge: 'Exclusive',
  },
];

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// ─── Star Rating ─────────────────────────────────────────────────────────────
function Stars({ rating, size = 3.5 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} style={{ width: size * 4 + 'px', height: size * 4 + 'px' }}
          className={s <= Math.round(rating) ? 'text-gold' : 'text-cream-dark'} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.951-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({
  page, setPage, user, setUser, searchQuery, setSearchQuery, onLoginClick,
}: {
  page: Page; setPage: (p: Page) => void; user: User | null; setUser: (u: User | null) => void;
  searchQuery: string; setSearchQuery: (q: string) => void; onLoginClick: () => void;
}) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const navItems: { key: Page; label: string }[] = [
    { key: 'landing', label: 'Home' },
    { key: 'products', label: 'Products' },
    { key: 'about', label: 'About Us' },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#030712]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[90px]">

          {/* Logo */}
          <button onClick={() => { setPage('landing'); setMobileOpen(false); }}
            className="flex items-center gap-3 shrink-0">
            <img src="/seconds-digital-logo.jpg" alt="Seconds Digital" className="w-12 h-12 object-contain rounded-full" />
            <div className="text-left hidden sm:block">
              <div className="font-display text-white font-semibold text-xl tracking-tight leading-none">Second Digital</div>
              <div className="text-gray-400 text-[10px] tracking-[0.2em] mt-1 uppercase">Refurbished Laptops</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-12">
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => setPage(key)}
                className={`relative text-[15px] font-medium pb-2 transition-colors ${page === key ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                {label}
                {page === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3B82F6]" />
                )}
              </button>
            ))}
          </nav>
                
          {/* Right Actions */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Search desktop */}
            <div className="relative hidden sm:flex items-center">
              {showSearch ? (
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2">
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input autoFocus type="text" placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) setPage('products'); }}
                    className="text-sm outline-none bg-transparent text-white placeholder:text-gray-500 w-40" />
                  <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowSearch(true)} className="p-2 text-gray-300 hover:text-white transition-all">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Profile / Login */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 border border-blue-500/30 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-white/5 transition-all">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="hidden sm:block max-w-[80px] truncate ml-1">{user.fullName.split(' ')[0]}</span>
                </button>
                {showProfile && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-[#0B1121] rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden z-50">
                    <div className="p-4 bg-[#151E32]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.fullName}</p>
                          <p className="text-gray-400 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-blue-500/20 p-2">
                      <button onClick={() => { setUser(null); setShowProfile(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onLoginClick}
                className="flex items-center gap-2 border border-blue-500/30 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-white/5 transition-all">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Login</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white rounded-lg hover:bg-white/5 transition-colors">
              {mobileOpen
                ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Hero */}
      <section 
        
        className="relative flex items-center overflow-hidden pt-[90px] h-auto min-h-[600px] lg:h-[650px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/hero-laptop-bg.jpeg)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/60 to-transparent z-0" />
        <div className="absolute inset-0 bg-[#030712]/40 z-0 sm:hidden" />
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 h-full flex flex-col justify-center">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 h-full">
            
            {/* Left side (~50%) */}
            <div className="w-full lg:w-[50%] flex flex-col items-start pt-6 lg:pt-0 lg:-mt-10">
              <div className="inline-flex items-center mb-6">
                <span className="w-6 h-[2px] bg-[#3B82F6] mr-4"></span>
                <span className="text-gray-400 text-[13px] font-semibold tracking-[0.25em] uppercase">
                  REFURBISHED LAPTOPS &nbsp;&nbsp;|&nbsp;&nbsp; TRICHY
                </span>
              </div>
              
              <h1 className="font-display text-5xl lg:text-[5.5rem] font-medium leading-[1.05] mb-5 tracking-tight">
                <span className="text-white block mb-1">Technology</span>
                <span className="text-[#60A5FA] block">Meets Expertise.</span>
              </h1>
              
              <p className="text-gray-300 text-[17px] leading-relaxed mb-10 max-w-[500px] font-light">
                Premium refurbished laptops, tested for performance, reliability and everyday excellence. <span className="font-medium text-white">Because your next laptop deserves more than just a price tag.</span>
              </p>
              
              {/* Trust Features */}
              <div className="flex flex-wrap lg:flex-nowrap gap-5 w-full mb-10">
                {[
                  { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Quality', sub: 'Checked' },
                  { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', title: 'Genuine', sub: 'Warranty' },
                  { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', title: 'Fast & Safe', sub: 'Delivery' },
                  { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: 'Dedicated', sub: 'Support' }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-blue-900/40 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <svg className="w-[22px] h-[22px] text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                      </svg>
                    </div>
                    <div className="text-white text-[13px] leading-tight whitespace-nowrap">
                      {f.title}<br/><span className="text-gray-300">{f.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <button onClick={() => setPage('products')} className="px-8 py-3.5 bg-[#3B82F6] hover:bg-blue-500 text-white font-medium rounded-full shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.8)] transition-all flex items-center justify-center gap-2 text-[15px]">
                  Explore Laptops
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <button onClick={() => setPage('about')} className="px-8 py-3.5 bg-transparent border border-gray-500 hover:border-gray-400 text-white font-medium rounded-full transition-all flex items-center justify-center text-[15px]">
                  About Us
                </button>
              </div>
            </div>

            {/* Right side - Handwritten Text only */}
            <div className="w-full lg:w-[50%] relative h-[20vh] lg:h-full flex items-center justify-end">
              {/* Handwritten text */}
              <div className="absolute top-0 lg:top-[12%] right-0 lg:right-[8%] z-20 -rotate-12 hidden md:block">
                <div className="font-[Caveat,cursive] text-[40px] text-[#E0E7FF] leading-[1] drop-shadow-md" style={{ fontFamily: "'Caveat', 'Segoe Script', cursive" }}>
                  Refurbished<br />
                  <span className="ml-6">Not Just</span><br />
                  <span className="ml-12 text-[#E0E7FF]">Recycled</span>
                </div>
                {/* SVG underline swoosh */}
                <svg className="absolute -bottom-4 right-0 w-32 h-6 text-[#60A5FA]" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                  <path d="M5,15 Q50,0 95,10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* BOTTOM TRUSTED BRANDS STRIP */}
<section className="bg-[#030712] border-b border-white/5 relative z-20 h-auto xl:h-[150px] flex items-center">
  <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10">

    <div className="flex items-center justify-between transform -translate-y-4">

      {/* LEFT BLOCK */}
      <div className="flex flex-col shrink-0">

        {/* Trusted Brands label */}
        <div className="flex items-center gap-3 mb-1.5">
          <span className="w-6 h-[1px] bg-[#3B82F6]"></span>

          <span className="text-gray-300 text-[11px] font-semibold tracking-[0.18em] uppercase">
            Trusted Brands
          </span>
        </div>

        {/* Logos */}
        <div className="flex items-center gap-5">

          {/* Dell */}
          <div className="w-11 h-11 rounded-full border border-white flex items-center justify-center text-white font-bold text-sm">
            DELL
          </div>

          <div className="w-[1px] h-7 bg-gray-700"></div>

          {/* HP */}
          <div className="text-white font-serif italic text-3xl font-bold">
            hp
          </div>

          <div className="w-[1px] h-7 bg-gray-700"></div>

          {/* Lenovo */}
          <div className="text-white font-bold text-xl tracking-tight">
            Lenovo
          </div>
        </div>
      </div>

      {/* CENTER DESCRIPTIONS */}
      <div className="flex items-center gap-5 whitespace-nowrap">

        <span className="text-gray-300 text-[15px]">
          Dell for <span className="text-[#3B82F6]">Reliability</span>
        </span>

        <div className="w-[1px] h-6 bg-gray-700"></div>

        <span className="text-gray-300 text-[15px]">
          HP for <span className="text-[#3B82F6]">Premium</span>
        </span>

        <div className="w-[1px] h-6 bg-gray-700"></div>

        <span className="text-gray-300 text-[15px]">
          Lenovo for <span className="text-[#3B82F6]">Affordability</span>
        </span>
      </div>

      {/* RIGHT LOCATION */}
      <div className="flex items-center gap-4 shrink-0">

        <svg
          className="w-9 h-9 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        <div className="flex flex-col">
          <span className="text-gray-400 text-[11px] uppercase tracking-wider leading-tight">
            We do this business in
          </span>

          <span className="text-white text-[19px] font-bold relative w-fit mt-1">
            Trichy

            <span className="absolute -bottom-1 left-0 w-8 h-[2px] bg-[#3B82F6]"></span>
          </span>
        </div>

      </div>

    </div>
  </div>
</section>
      {/* LOWER SECTIONS */}
      <div className="bg-[#FAF8F5] rounded-t-[2.5rem] mt-2 relative z-20">

        {/* Featured Products */}
        <section className="pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="flex items-end justify-between mb-10 sm:mb-12">
            <div>
              <span className="text-[#3B82F6] text-xs font-semibold tracking-widest uppercase">
                Fast selling Laptops
              </span>

              <h2 className="font-display text-4xl sm:text-5xl text-navy mt-2 font-bold tracking-tight">
                Top Picks
              </h2>
            </div>

            <button
              onClick={() => setPage('products')}
              className="px-6 py-2.5 border border-gray-300 rounded-full text-navy hover:bg-gray-100 transition-colors hidden sm:inline-flex items-center gap-2 text-sm font-semibold"
            >
              View all

              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {PRODUCTS.slice(0, 3).map((product) => (
              <MiniProductCard
                key={product.id}
                product={product}
                onViewProduct={() => setPage('products')}
              />
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => setPage('products')}
              className="px-8 py-3 border border-gray-300 rounded-full text-navy hover:bg-gray-100 transition-colors text-sm font-semibold"
            >
              View all Devices
            </button>
          </div>

        </section>

        {/* CTA Banner */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2.5rem] overflow-hidden relative shadow-2xl" style={{ background: 'linear-gradient(135deg, #0A0F1C 0%, #151E32 100%)' }}>
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #3B82F6 0%, transparent 60%)' }} />
              <div className="relative z-10 py-20 px-8 sm:px-16 text-center">
                <h2 className="font-display text-4xl sm:text-5xl text-white font-semibold mb-6 leading-tight tracking-tight">
                  Premium quality.<br />
                  <span className="italic text-[#3B82F6]">Delivered to your door.</span>
                </h2>
                <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto font-light">
                  Browse our full collection of Corporate series Laptops, all available across Tamil Nadu with fast and reliable delivery.
                </p>
                <button onClick={() => setPage('products')} className="px-8 py-4 bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all inline-flex items-center gap-2 text-lg">
                  Get in store
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">2S</span>
              </div>
              <span className="font-display text-navy font-bold text-lg tracking-tight">Seconds Digital</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">© 2026 Seconds Digital. All rights reserved. Tamil Nadu, India.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <a href="#" className="hover:text-navy transition-colors">Privacy</a>
              <a href="#" className="hover:text-navy transition-colors">Terms</a>
              <a href="#" className="hover:text-navy transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MiniProductCard({ product, onViewProduct }: { product: Product; onViewProduct: () => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="aspect-square bg-cream-dark overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: product.badge === 'Sale' ? '#EF4444' : product.badge === 'New' ? '#10B981' : '#1C2340', color: '#FAF8F5' }}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-muted uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-display text-navy text-lg font-semibold leading-tight mb-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-navy font-bold text-lg">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-muted text-sm line-through ml-2">{fmt(product.originalPrice)}</span>
            )}
          </div>
          <button onClick={onViewProduct}
            className="text-xs font-semibold text-gold hover:text-navy transition-colors">
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card (full version for Products page) ────────────────────────────
function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col">
      <div className="relative bg-cream-dark overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: product.badge === 'Sale' ? '#EF4444' : product.badge === 'New' ? '#10B981' : product.badge === 'Premium' ? '#7C3AED' : '#1C2340', color: '#FAF8F5' }}>
            {product.badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-muted uppercase tracking-wider mb-1.5">{product.category}</p>
        <h3 className="font-display text-navy text-xl font-semibold leading-tight mb-1.5">{product.name}</h3>
        <p className="text-muted text-sm leading-relaxed whitespace-pre-line mb-3 flex-1">{product.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted">{product.rating} ({product.reviews} reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-navy font-bold text-xl">{fmt(product.price)}</div>
            {product.originalPrice && (
              <div className="text-muted text-sm line-through">{fmt(product.originalPrice)}</div>
            )}
          </div>
          <button onClick={() => onSelect(product)}
            className="bg-navy text-cream text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-navy-hover transition-all">
            View Laptops
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Standalone form field (must be outside LoginForm to avoid focus loss) ────
interface FormFieldProps {
  id: string; label: string; type?: string; placeholder: string;
  value: string; error?: string; touched?: boolean;
  onChange: (v: string) => void; onBlur: () => void;
}
function FormField({ id, label, type = 'text', placeholder, value, error, touched, onChange, onBlur }: FormFieldProps) {
  const hasErr = !!(touched && error);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <input id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors focus:ring-2"
        style={{
          borderColor: hasErr ? '#EF4444' : '#E2DDD5',
          background: '#FFFFFF',
          outlineColor: hasErr ? '#EF4444' : '#C9973E',
        }}
      />
      {hasErr && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ product, onSubmit, onBack }: {
  product: Product; onSubmit: (u: User) => void; onBack: () => void;
}) {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', district: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (data: typeof form) => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim() || data.fullName.trim().length < 3) e.fullName = 'Enter your full name (min 3 characters)';
    if (!/^[6-9]\d{9}$/.test(data.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email address';
    if (!data.district) e.district = 'Please select your district';
    return e;
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      const errs = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: errs[field] || '' }));
    }
  };

  const handleBlur = (field: keyof typeof form) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [field]: errs[field] || '' }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, email: true, district: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onSubmit(form);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-muted hover:text-navy transition-colors text-sm mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to products
        </button>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product preview */}
          <div className="bg-white rounded-3xl overflow-hidden border border-border sticky top-24">
            <div className="relative bg-cream-dark" style={{ aspectRatio: '4/3' }}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-cream/80 text-xs uppercase tracking-wider">{product.category}</span>
                <h2 className="font-display text-cream text-2xl font-semibold">{product.name}</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-navy">{fmt(product.price)}</div>
                  {product.originalPrice && <div className="text-muted text-sm line-through">{fmt(product.originalPrice)}</div>}
                </div>
                <div className="text-right">
                  <Stars rating={product.rating} size={4} />
                  <span className="text-xs text-muted">{product.reviews} reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login form */}
          <div>
            <span className="text-gold text-xs font-medium tracking-widest uppercase">One step away</span>
            <h2 className="font-display text-4xl text-navy font-semibold mt-2 mb-2">Tell us about yourself</h2>
            <p className="text-muted text-base mb-8">Enter your details to view the full product and place your order via WhatsApp.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField id="fullName" label="Full Name" placeholder="e.g. Priya Ramasubramanian"
                value={form.fullName} error={errors.fullName} touched={touched.fullName}
                onChange={(v) => handleChange('fullName', v)} onBlur={() => handleBlur('fullName')} />
              <FormField id="phone" label="Phone Number" type="tel" placeholder="e.g. 8838314771"
                value={form.phone} error={errors.phone} touched={touched.phone}
                onChange={(v) => handleChange('phone', v)} onBlur={() => handleBlur('phone')} />
              <FormField id="email" label="Email Address" type="email" placeholder="e.g. priya@example.com"
                value={form.email} error={errors.email} touched={touched.email}
                onChange={(v) => handleChange('email', v)} onBlur={() => handleBlur('email')} />
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-navy mb-1.5">District</label>
                <select id="district" value={form.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  onBlur={() => handleBlur('district')}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all appearance-none bg-white"
                  style={{
                    borderColor: touched.district && errors.district ? '#EF4444' : '#E2DDD5',
                    boxShadow: touched.district && errors.district ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%238B8278' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem',
                  }}>
                  <option value="">Select your district in Tamil Nadu</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {touched.district && errors.district && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.district}
                  </p>
                )}
              </div>
              <button type="submit"
                className="w-full bg-navy text-cream font-semibold py-4 rounded-xl hover:bg-navy-hover transition-all text-sm tracking-wide">
                Continue to Product Details →
              </button>
            </form>
            <p className="text-muted text-xs text-center mt-4">
              Your information is used only to process your order. We never share your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessLogin({ onUserLogin, onAdminLogin, onClose }: {
  onUserLogin: (user: User) => void;
  onAdminLogin: (email: string, password: string) => Promise<string | null>;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', district: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (mode === 'admin') {
      onAdminLogin(form.email, form.password).then((message) => { if (message) setError(message); });
      return;
    }

    if (!form.fullName.trim() || !/^[6-9]\d{9}$/.test(form.phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.district) {
      setError('Please complete your name, valid phone, email, and district.');
      return;
    }

    onUserLogin({ fullName: form.fullName.trim(), phone: form.phone, email: form.email.trim(), district: form.district });
  };

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 px-4 py-8 backdrop-blur-sm" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-2xl sm:p-8" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-gold">Seconds Digital</span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy">Welcome back</h2>
            <p className="mt-1 text-sm text-muted">Choose the account you want to access.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-muted hover:bg-cream-dark hover:text-navy" aria-label="Close login">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-cream-dark p-1">
          {(['user', 'admin'] as const).map((accountMode) => (
            <button key={accountMode} type="button" onClick={() => { setMode(accountMode); setError(''); }}
              className={`rounded-lg py-2.5 text-sm font-semibold capitalize transition-colors ${mode === accountMode ? 'bg-navy text-cream shadow-sm' : 'text-muted hover:text-navy'}`}>
              {accountMode} login
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'user' ? (
            <>
              <input required value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Full name" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" />
              <input required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="10-digit phone number" type="tel" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" />
              <input required value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Email address" type="email" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" />
              <select required value={form.district} onChange={(event) => update('district', event.target.value)} className="w-full appearance-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold">
                <option value="">Select your district</option>
                {DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}
              </select>
            </>
          ) : (
            <>
              <input required value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Admin email" type="email" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" />
              <input required value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="Admin password" type="password" className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" />
              <p className="text-xs text-muted">Use the administrator credentials configured on the server.</p>
            </>
          )}
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-navy py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-hover">
            Continue as {mode === 'admin' ? 'Admin' : 'User'}
          </button>
        </form>
      </div>
    </div>
  );
}

type AdminProduct = { id: number; name: string; description: string; price: number; original_price: number | null; image: string; category: string; stock_quantity: number };
type AdminDashboard = { metrics: { revenue: number; orders: number; users: number; products: number; visitors: number }; status: { status: string; count: number }[]; recentOrders: { id: number; total_amount: number; status: string; full_name: string | null; email: string | null; created_at: string }[] };

function AdminPage() {
  const [admin, setAdmin] = useState<{ email: string } | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', original_price: '', image: '', category: 'Laptop', stock_quantity: '1' });

  const load = async () => {
    setLoading(true);
    try {
      const meResponse = await fetch('/api/admin/auth/me');
      if (!meResponse.ok) throw new Error('Please sign in through the admin login.');
      const me = await meResponse.json();
      const [dashboardResponse, productsResponse] = await Promise.all([fetch('/api/admin/dashboard'), fetch('/api/admin/products')]);
      if (!dashboardResponse.ok || !productsResponse.ok) throw new Error('Unable to load admin data.');
      setAdmin(me.admin);
      setDashboard(await dashboardResponse.json());
      setProducts((await productsResponse.json()).products);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load admin data.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null, stock_quantity: Number(form.stock_quantity) }) });
    const body = await response.json();
    if (!response.ok) { setError(body.error || 'Unable to create product.'); return; }
    setProducts((current) => [body.product, ...current]);
    setShowForm(false);
    setForm({ name: '', description: '', price: '', original_price: '', image: '', category: 'Laptop', stock_quantity: '1' });
    void load();
  };

  const archiveProduct = async (id: number) => {
    if (!window.confirm('Archive this product?')) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!response.ok) { setError('Unable to archive product.'); return; }
    setProducts((current) => current.filter((product) => product.id !== id));
    void load();
  };

  const logout = async () => { await fetch('/api/admin/auth/logout', { method: 'POST' }); window.location.assign('/'); };
  const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-cream text-muted">Verifying administrator session...</div>;
  if (!admin) return <div className="flex min-h-screen items-center justify-center bg-cream px-4"><div className="rounded-2xl bg-white p-8 text-center shadow-sm"><h1 className="font-display text-3xl font-semibold text-navy">Admin access required</h1><p className="mt-2 text-muted">{error || 'Please return to the storefront and choose Admin login.'}</p><a href="/" className="mt-6 inline-block rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream">Return to website</a></div></div>;

  return <div className="min-h-screen bg-cream text-navy">
    <header className="border-b border-border bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"><div><p className="text-xs font-semibold uppercase tracking-widest text-gold">Seconds Digital</p><h1 className="font-display text-2xl font-semibold">Admin dashboard</h1></div><div className="flex items-center gap-3"><span className="hidden text-sm text-muted sm:block">{admin.email}</span><button onClick={logout} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-cream-dark">Log out</button></div></div></header>
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{dashboard && Object.entries({ Revenue: money(dashboard.metrics.revenue), Orders: dashboard.metrics.orders, Users: dashboard.metrics.users, Products: dashboard.metrics.products, Visitors: dashboard.metrics.visitors }).map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-white p-5"><p className="text-xs uppercase tracking-wider text-muted">{label}</p><p className="mt-3 font-display text-3xl font-semibold">{value}</p></div>)}</section>
      <section className="rounded-2xl border border-border bg-white"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-display text-2xl font-semibold">Products</h2><p className="text-sm text-muted">Live records from the SQLite database.</p></div><button onClick={() => setShowForm(!showForm)} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream">{showForm ? 'Close' : 'Add product'}</button></div>
        {showForm && <form onSubmit={createProduct} className="grid gap-3 border-b border-border bg-cream p-5 sm:grid-cols-2"><input required placeholder="Product name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm" /><input required type="number" min="0" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm" /><input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm" /><input required type="number" min="0" placeholder="Stock quantity" value={form.stock_quantity} onChange={(event) => setForm({ ...form, stock_quantity: event.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm" /><input placeholder="Image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm sm:col-span-2" /><textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm sm:col-span-2" /><button className="rounded-xl bg-gold px-4 py-3 text-sm font-semibold sm:col-span-2">Save product</button></form>}
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-cream-dark text-xs uppercase tracking-wider text-muted"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody>{products.length ? products.map((product) => <tr key={product.id} className="border-t border-border"><td className="px-5 py-4 font-semibold">{product.name}</td><td className="px-5 py-4 text-muted">{product.category}</td><td className="px-5 py-4">{money(product.price)}</td><td className="px-5 py-4">{product.stock_quantity}</td><td className="px-5 py-4 text-right"><button onClick={() => archiveProduct(product.id)} className="text-sm font-semibold text-red-600">Archive</button></td></tr>) : <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">No products in the database.</td></tr>}</tbody></table></div>
      </section>
      <section className="rounded-2xl border border-border bg-white"><div className="border-b border-border px-5 py-4"><h2 className="font-display text-2xl font-semibold">Recent orders</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-cream-dark text-xs uppercase tracking-wider text-muted"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{dashboard?.recentOrders.length ? dashboard.recentOrders.map((order) => <tr key={order.id} className="border-t border-border"><td className="px-5 py-4">#{order.id}</td><td className="px-5 py-4">{order.full_name || order.email || 'Guest'}</td><td className="px-5 py-4">{money(order.total_amount)}</td><td className="px-5 py-4 capitalize">{order.status}</td></tr>) : <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">No orders recorded yet.</td></tr>}</tbody></table></div></section>
    </main>
  </div>;
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function ProductDetail({ product, user, onBack }: {
  product: Product; user: User; onBack: () => void;
}) {
  const handleOrder = () => {
    const msg = encodeURIComponent(
      `Hello Seconds Digital! 🛍️\n\nI'd like to place an order for:\n\n` +
      `*${product.name}*\nPrice: ${fmt(product.price)}\nCategory: ${product.category}\n\n` +
      `My details:\nName: ${user.fullName}\nPhone: ${user.phone}\nEmail: ${user.email}\nDistrict: ${user.district}, Tamil Nadu\n\nPlease confirm availability and delivery details. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-muted hover:text-navy transition-colors text-sm mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to products
        </button>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="sticky top-24">
            <div className="rounded-3xl overflow-hidden bg-cream-dark relative" style={{ aspectRatio: '1' }}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                  style={{ background: product.badge === 'Sale' ? '#EF4444' : product.badge === 'New' ? '#10B981' : product.badge === 'Premium' ? '#7C3AED' : '#1C2340', color: '#FAF8F5' }}>
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="text-gold text-xs font-medium tracking-widest uppercase">{product.category}</span>
              <h1 className="font-display text-4xl sm:text-5xl text-navy font-semibold mt-2 mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3">
                <Stars rating={product.rating} size={4} />
                <span className="text-sm text-muted">{product.rating} · {product.reviews} reviews</span>
              </div>
            </div>

            <div className="flex items-end gap-4 py-4 border-y border-border">
              <span className="text-4xl font-bold text-navy">{fmt(product.price)}</span>
              {product.originalPrice && (
                <div>
                  <span className="text-muted text-xl line-through">{fmt(product.originalPrice)}</span>
                  <span className="ml-2 text-green-600 text-sm font-semibold">
                    Save {fmt(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-navy mb-2">Product Description</h3>
              <p className="text-muted leading-relaxed">{product.fullDescription}</p>
            </div>

            <div className="bg-cream rounded-2xl p-5 border border-border">
              <h3 className="font-semibold text-navy text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Delivering to
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted">Name</span><p className="text-navy font-medium">{user.fullName}</p></div>
                <div><span className="text-muted">Phone</span><p className="text-navy font-medium">{user.phone}</p></div>
                <div><span className="text-muted">Email</span><p className="text-navy font-medium truncate">{user.email}</p></div>
                <div><span className="text-muted">District</span><p className="text-navy font-medium">{user.district}</p></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                { label: 'Free Delivery', sub: 'Tamil Nadu wide', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
                { label: 'Customer Support', sub: '24/7', icon: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' },
                { label: 'Genuine', sub: 'Verfied Product', icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' },
              ].map((b) => (
                <div key={b.label} className="text-center p-3 bg-white rounded-xl border border-border">
                  <svg className="w-5 h-5 text-gold mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.icon} />
                  </svg>
                  <div className="font-semibold text-navy text-xs">{b.label}</div>
                  <div className="text-muted text-[11px]">{b.sub}</div>
                </div>
              ))}
            </div>

            <button onClick={handleOrder}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:bg-[#20bc59] transition-all text-base shadow-lg shadow-green-500/20">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Place Order via WhatsApp
            </button>
            <p className="text-center text-xs text-muted">You'll be redirected to WhatsApp to confirm your order with our team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Products Page ─────────────────────────────────────────────────────────────
function ProductsPage({ user, setUser, searchQuery, setSearchQuery }: {
  user: User | null; setUser: (u: User) => void;
  searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [activeProduct, setActiveProduct] = useState('All laptops');
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  const filtered = PRODUCTS.filter((p) => {
    const matchProduct = activeProduct === 'All laptops' || p.name === activeProduct;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q);
    return matchProduct && matchSearch;
  });

  const handleSelect = (product: Product) => {
    if (user) {
      setSelected(product);
      setShowLogin(false);
    } else {
      setPendingProduct(product);
      setShowLogin(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSubmit = (u: User) => {
    setUser(u);
    if (pendingProduct) {
      setSelected(pendingProduct);
      setPendingProduct(null);
    }
    setShowLogin(false);
  };

  const handleBack = () => {
    setSelected(null);
    setShowLogin(false);
    setPendingProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showLogin && pendingProduct) {
    return <LoginForm product={pendingProduct} onSubmit={handleLoginSubmit} onBack={handleBack} />;
  }

  if (selected) {
    return <ProductDetail product={selected} user={user!} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header bar */}
      <div className="bg-navy py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-gold text-xs font-medium tracking-widest uppercase">Our Collection</span>
          <h1 className="font-display text-4xl sm:text-5xl text-cream font-semibold mt-2 mb-1">All Products</h1>
          <p className="text-cream/60">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Handpicked premium goods delivered across Tamil Nadu'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter bar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" placeholder="Search by laptop name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-border rounded-full text-sm outline-none text-navy placeholder:text-muted"
              style={{ boxShadow: 'none' }}
              onFocus={(e) => { e.target.style.borderColor = '#C9973E'; e.target.style.boxShadow = '0 0 0 3px rgba(201,151,62,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E2DDD5'; e.target.style.boxShadow = 'none'; }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-white px-4 py-2.5 sm:w-72 sm:shrink-0">
            <svg className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 6h16M7 12h10m-7 6h4" />
            </svg>
            <label htmlFor="product-filter" className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">Filter</label>
            <select id="product-filter" value={activeProduct} onChange={(event) => setActiveProduct(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-navy outline-none">
              <option>All laptops</option>
              {PRODUCTS.map((product) => <option key={product.id}>{product.name}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        {(searchQuery || activeProduct !== 'All laptops') && (
          <p className="text-muted text-sm mb-6">
            {filtered.length > 0 ? `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found` : ''}
          </p>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={handleSelect} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-navy font-semibold mb-2">No products found</h3>
            <p className="text-muted mb-6">
              We couldn't find any products matching{searchQuery ? ` "${searchQuery}"` : ' your filters'}.
            </p>
            <div className="flex items-center justify-center gap-3">
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="bg-navy text-cream text-sm font-medium px-6 py-2.5 rounded-full hover:bg-navy-hover transition-all">
                  Clear search
                </button>
              )}
              {activeProduct !== 'All laptops' && (
                <button onClick={() => setActiveProduct('All laptops')}
                  className="border border-border text-navy text-sm font-medium px-6 py-2.5 rounded-full hover:bg-cream-dark transition-colors">
                  Show all laptops
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage({ setPage }: { setPage: (p: Page) => void }) {
  const stats = [
    { value: '5.0★', label: 'Customer Rating' },
    { value: '20', label: 'Customer Reviews' },
    { value: '2026', label: 'Established' },
    { value: '7 Days', label: 'Open Every Week' },
  ];

  const services = [
    {
      title: 'Laptop Sales',
      desc: 'A laptop dealership right in Somarasampettai. Walk in, see the machines in person, and pick the laptop that fits your work, studies, or home.',
      icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25',
    },
    {
      title: 'Computer & Laptop Repair',
      desc: 'Slow, stuck, or not switching on? Bring your computer or laptop to us and we will look into the problem and get it working again.',
      icon: 'M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.264.575.41 1.208.41 1.876z',
    },
    {
      title: 'Laptop Servicing',
      desc: 'Regular servicing keeps a laptop running smoothly for longer. We look after your machine so it stays dependable day after day.',
      icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
    },
  ];

  const hours = [
    { day: 'Monday – Saturday', time: '9:00 AM – 9:00 PM' },
    { day: 'Sunday', time: '11:00 AM – 4:00 PM' },
  ];

  const pinIcon = 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Seconds+Digital+Chellamani+Complex+Somarasampettai+Srirangam';

  const whatsappUrl = 'https://wa.me/c/918838314771';
  const instagramUrl = 'https://www.instagram.com/_seconds_digital_07?stkn=NHE3eGJjdzlzdzh2';
  const youtubeUrl = 'https://youtube.com/@secondsdigital?si=E0WVmyYgS55vG8Qc';

  const contactCards = [
    {
      title: 'WhatsApp',
      value: '+91 88383 14771',
      sub: 'Tap to chat on WhatsApp',
      href: whatsappUrl,
      icon: (
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
    {
      title: 'Address',
      value: '1st Floor, Chellamani Complex, Somarasampettai Main Road, Srirangam 620102',
      sub: 'Near UCO Bank',
      href: mapsUrl,
      icon: (
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={pinIcon} />
        </svg>
      ),
    },
    {
      title: 'Instagram',
      value: '@_seconds_digital_07',
      sub: 'Follow us on Instagram',
      href: instagramUrl,
      icon: (
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: 'YouTube',
      value: '@secondsdigital',
      sub: 'Watch us on YouTube',
      href: youtubeUrl,
      icon: (
        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path strokeLinejoin="round" fill="currentColor" d="M10 9.5v5l4.5-2.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <video
            src={heroVideo}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={(event) => event.currentTarget.pause()}
            className="hero-video h-full w-full object-cover opacity-45"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-navy/65" />
        </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #C9973E 0%, transparent 55%)' }} />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-gold text-xs font-medium tracking-widest uppercase mb-6">
            <span className="w-8 h-px bg-gold" />
            About Seconds Digital
            <span className="w-8 h-px bg-gold" />
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream font-semibold leading-[1.05] mb-6">
            Laptops & repairs.<br />
            <span className="italic text-gold-light">Right in Somarasampettai.</span>
          </h1>
          <p className="text-cream/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            At SECONDS DIGITAL,we believe a device is more than just a piece of technology—it is an essential part of your work, learning, communication, and everyday life. Our mission is simple: deliver reliable technology solutions with precision, transparency, and care.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gold py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl text-navy font-bold mb-1">{s.value}</div>
              <div className="text-navy/70 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold text-xs font-medium tracking-widest uppercase">About us</span>
              <h2 className="font-display text-4xl sm:text-5xl text-navy font-semibold mt-3 mb-6 leading-tight">
                One shop for buying, fixing and servicing.
              </h2>
              <p className="text-muted leading-relaxed mb-5">
                Seconds Digital started in 2026 with a simple idea: people in Somarasampettai should not have to travel far to buy a good laptop or get a faulty one repaired. We sell laptops and we repair and service computers and laptops, all under one roof.
              </p>
              <p className="text-muted leading-relaxed mb-5">
                Our customers have given us a 5.0 out of 5 rating across 20 reviews, especially for our computer repair, laptop sales and servicing. That trust is what we work to earn with every customer who walks in.
              </p>
              <p className="text-muted leading-relaxed mb-8">
                We are on the first floor of Chellamani Complex on Somarasampettai Main Road, near UCO Bank. Drop by any day of the week, or call us before you come.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setPage('products')}
                  className="inline-flex items-center gap-2 bg-navy text-cream font-semibold px-7 py-3.5 rounded-full hover:bg-navy-hover transition-all text-sm">
                  Browse our collection
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <a href="tel:+918838314771"
                  className="inline-flex items-center gap-2 border border-navy text-navy font-semibold px-7 py-3.5 rounded-full hover:bg-navy hover:text-cream transition-all text-sm">
                  Call the shop
                </a>
              </div>
            </div>

            {/* Rating + hours card */}
            <div className="relative">
              <div className="rounded-3xl bg-navy p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, #C9973E 0%, transparent 55%)' }} />
                <div className="relative z-10">
                  <p className="text-gold text-xs font-medium tracking-widest uppercase mb-3">Customer rating</p>
                  <div className="flex items-end gap-4 mb-2">
                    <span className="font-display text-6xl text-cream font-semibold leading-none">5.0</span>
                    <div className="pb-1">
                      <Stars rating={5} size={5} />
                      <p className="text-cream/60 text-sm mt-1">out of 5, from 20 reviews</p>
                    </div>
                  </div>
                  <p className="text-cream/70 text-sm leading-relaxed mt-4 mb-8">
                    Rated highly for computer repair, laptop sales and laptop servicing.
                  </p>
                  <div className="border-t border-cream/10 pt-6">
                    <p className="text-gold text-xs font-medium tracking-widest uppercase mb-4">Opening hours</p>
                    <div className="space-y-3">
                      {hours.map((h) => (
                        <div key={h.day} className="flex items-center justify-between gap-4 text-sm">
                          <span className="text-cream/70">{h.day}</span>
                          <span className="text-cream font-medium">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold p-6 rounded-2xl shadow-xl hidden sm:block">
                <p className="font-display text-navy text-2xl font-bold">2026</p>
                <p className="text-navy/70 text-xs font-medium">Est. in Somarasampettai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-medium tracking-widest uppercase">What we do</span>
            <h2 className="font-display text-4xl sm:text-5xl text-cream font-semibold mt-3">Our services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((v) => (
              <div key={v.title} className="p-8 rounded-3xl border border-cream/10 hover:border-gold/30 hover:bg-cream/5 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <h3 className="font-display text-cream text-xl font-semibold mb-3">{v.title}</h3>
                <p className="text-cream/60 leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Visit us</span>
            <h2 className="font-display text-4xl sm:text-5xl text-navy font-semibold mt-3">Come say hello</h2>
            <p className="text-muted mt-4 max-w-lg mx-auto">Looking for a laptop, or need one repaired? Message us, follow us, or drop by the shop.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {contactCards.map((c) => (
              <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
                className="bg-white border border-border rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all block">
                <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4">
                  {c.icon}
                </div>
                <h3 className="font-semibold text-navy mb-1">{c.title}</h3>
                <p className="text-navy text-sm font-medium mb-1">{c.value}</p>
                <p className="text-muted text-xs">{c.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-navy rounded-md flex items-center justify-center">
              <span className="text-gold font-display font-bold text-xs">S</span>
            </div>
            <span className="font-display text-navy font-semibold">Seconds Digital</span>
          </div>
          <p className="text-muted text-sm">© 2026 Seconds Digital. Somarasampettai, Srirangam, Tiruchirappalli.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── App Root ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessLogin, setShowAccessLogin] = useState(false);

  if (window.location.pathname.startsWith('/admin')) return <AdminPage />;

  const handleLoginClick = () => {
    setShowAccessLogin(true);
  };

  const handleSetUser = (u: User) => setUser(u);

  return (
    <div className="min-h-screen bg-cream">
      <Header
        page={page}
        setPage={setPage}
        user={user}
        setUser={setUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLoginClick={handleLoginClick}
      />
      <main>
        {page === 'landing' && <LandingPage setPage={setPage} />}
        {page === 'products' && (
          <ProductsPage
            user={user}
            setUser={handleSetUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {page === 'about' && <AboutPage setPage={setPage} />}
      </main>
      {showAccessLogin && (
        <AccessLogin
          onClose={() => setShowAccessLogin(false)}
          onUserLogin={(loggedInUser) => { setUser(loggedInUser); setShowAccessLogin(false); }}
          onAdminLogin={async (email, password) => { const response = await fetch('/api/admin/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); if (!response.ok) return (await response.json()).error || 'Admin login failed.'; setShowAccessLogin(false); window.location.assign('/admin'); return null; }}
        />
      )}
    </div>
  );
}

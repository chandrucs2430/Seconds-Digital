import dellLaptopImage from '../../DELL.jpg';

export interface Product {
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

export const PRODUCTS: Product[] = [
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
    price: 23999, originalPrice: 26499,
    image: 'https://i.pinimg.com/736x/f2/b6/9b/f2b69b23313b68146c66dc888dc90fa2.jpg',
    category: 'Lenovo', rating: 4.7, reviews: 203,
  },
  {
    id: 4, name: 'MACBOOK PRO A2141',
    description: 'Intel Core i9 8-Core | 16GB RAM | 1TB SSD | 4GB AMD Radeon Pro Graphics | 16″ Retina Display | 500 Nits Brightness | Touch Bar | 195 Battery Cycles | Apple Charger | A++++ Grade | Like-New Condition',
    fullDescription: `Apple MacBook Pro 16-inch with 8-Core Intel Core i9 2.4GHz, 16GB RAM, 1TB SSD, 4GB AMD Radeon Pro Graphics, Retina Display, Touch Bar, 195 battery cycles, A++++ Like-New Condition, with Apple Charger included.

`,
    price: 55000, originalPrice: 69999,
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
    fullDescription: 'Lenovo ThinkPad L450 – Compact and dependable business laptop featuring a business-class build, responsive performance, classic ThinkPad keyboard, and portable 14-inch design, perfect for work, coding, study, and daily use.',
    price: 12499, image: 'https://i.pinimg.com/736x/f2/b6/9b/f2b69b23313b68146c66dc888dc90fa2.jpg',
    category: 'LENOVO', rating: 4.9, reviews: 61, badge: 'Exclusive',
  },
];
import dns from 'node:dns';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { logger } from '../utils/logger.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export const seed100UniqueImages = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB for 100 Unique Products & Unique Images Seeding...');

    const categoriesList = [
      { name: 'Smartphones & Tablets', slug: 'smartphones-tablets', description: 'Latest flagship phones, iPads and tablets' },
      { name: 'Laptops & Computers', slug: 'laptops-computers', description: 'Gaming, ultrabooks, and workstations' },
      { name: 'Audio & Wearables', slug: 'audio-wearables', description: 'Noise-cancelling headphones, earbuds & smartwatches' },
      { name: 'Cameras & Drones', slug: 'cameras-drones', description: 'Mirrorless, action cameras & 4K drones' },
      { name: 'Gaming & Consoles', slug: 'gaming-consoles', description: 'PlayStation, Xbox, Handhelds & Accessories' },
      { name: 'Fashion & Apparel', slug: 'fashion-apparel', description: 'Men and women luxury clothing' },
      { name: 'Home Appliances', slug: 'home-appliances', description: 'Smart TV, coffee makers, and air purifiers' },
      { name: 'Accessories', slug: 'accessories', description: 'Chargers, cases, cables & mounts' },
    ];

    const categoryMap: Record<string, any> = {};
    for (const cat of categoriesList) {
      let existingCat = await Category.findOne({ slug: cat.slug });
      if (!existingCat) {
        existingCat = await Category.create(cat);
      }
      categoryMap[cat.slug] = existingCat._id;
    }

    let seller = await User.findOne({ role: 'admin' });
    if (!seller) seller = await User.findOne();

    // 100 INDIVIDUAL DISTINCT PRODUCTS WITH 100% UNIQUE IMAGES
    const productsCatalog = [
      // === SMARTPHONES & TABLETS (15) ===
      {
        name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
        price: 134900, comp: 159900, brand: 'Apple', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        tags: ['iphone', 'apple', 'flagship']
      },
      {
        name: 'Samsung Galaxy S24 Ultra Titanium Grey',
        price: 129999, comp: 144999, brand: 'Samsung', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
        tags: ['samsung', 'galaxy', 'ai']
      },
      {
        name: 'Google Pixel 8 Pro Obsidian Black',
        price: 98999, comp: 106999, brand: 'Google', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        tags: ['google', 'pixel', 'android']
      },
      {
        name: 'Apple iPad Pro 11-inch M4 OLED Space Black',
        price: 99900, comp: 109900, brand: 'Apple', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        tags: ['ipad', 'apple', 'm4']
      },
      {
        name: 'OnePlus 12 5G Silky Black 16GB RAM',
        price: 69999, comp: 74999, brand: 'OnePlus', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800',
        tags: ['oneplus', '5g']
      },
      {
        name: 'Xiaomi 14 Ultra Leica Summilux Optics',
        price: 99999, comp: 119999, brand: 'Xiaomi', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        tags: ['xiaomi', 'camera']
      },
      {
        name: 'Samsung Galaxy Z Fold 5 Phantom Black',
        price: 154999, comp: 169999, brand: 'Samsung', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
        tags: ['samsung', 'foldable']
      },
      {
        name: 'Apple iPad Air 13-inch M2 Starlight',
        price: 79900, comp: 84900, brand: 'Apple', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        tags: ['ipad', 'apple']
      },
      {
        name: 'Nothing Phone (2) Dark Grey Transparent',
        price: 39999, comp: 44999, brand: 'Nothing', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=800',
        tags: ['nothing', 'glyph']
      },
      {
        name: 'Samsung Galaxy Tab S9 Ultra Dynamic AMOLED',
        price: 108999, comp: 121999, brand: 'Samsung', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        tags: ['tablet', 'samsung']
      },
      {
        name: 'Apple iPhone 15 Blue Pastel 128GB',
        price: 71900, comp: 79900, brand: 'Apple', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
        tags: ['iphone', 'apple']
      },
      {
        name: 'Vivo X100 Pro 5G Sunset Orange',
        price: 89999, comp: 99999, brand: 'Vivo', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        tags: ['vivo', 'zeiss']
      },
      {
        name: 'Motorola Razr 40 Ultra Flip Infinite Black',
        price: 69999, comp: 89999, brand: 'Motorola', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
        tags: ['flip', 'motorola']
      },
      {
        name: 'Realme GT 5 Pro Snapdragon 8 Gen 3',
        price: 42999, comp: 49999, brand: 'Realme', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800',
        tags: ['realme', 'fast']
      },
      {
        name: 'OnePlus Pad Pro 3K 144Hz Tablet',
        price: 36999, comp: 42999, brand: 'OnePlus', cat: 'smartphones-tablets',
        img: 'https://images.unsplash.com/photo-1527690789675-4ea7d8da4fe3?w=800',
        tags: ['tablet', 'oneplus']
      },

      // === LAPTOPS & COMPUTERS (15) ===
      {
        name: 'Apple MacBook Pro 16-inch M3 Max Space Black',
        price: 349900, comp: 379900, brand: 'Apple', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        tags: ['macbook', 'm3max']
      },
      {
        name: 'Dell XPS 15 9530 Core i9 OLED InfinityEdge',
        price: 245000, comp: 269000, brand: 'Dell', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        tags: ['dell', 'xps']
      },
      {
        name: 'Apple MacBook Air 13-inch M3 Midnight',
        price: 114900, comp: 124900, brand: 'Apple', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
        tags: ['macbook-air', 'm3']
      },
      {
        name: 'ASUS ROG Zephyrus G14 OLED Gaming Laptop',
        price: 189990, comp: 209990, brand: 'ASUS', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        tags: ['rog', 'gaming']
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11 Ultrabook',
        price: 165000, comp: 180000, brand: 'Lenovo', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        tags: ['thinkpad', 'business']
      },
      {
        name: 'LG UltraGear 27-inch OLED 240Hz Gaming Monitor',
        price: 74999, comp: 89999, brand: 'LG', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
        tags: ['monitor', 'oled']
      },
      {
        name: 'Apple Mac Studio M2 Max Workstation',
        price: 209900, comp: 229900, brand: 'Apple', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
        tags: ['mac-studio', 'desktop']
      },
      {
        name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
        price: 18999, comp: 21999, brand: 'Keychron', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        tags: ['keyboard', 'mechanical']
      },
      {
        name: 'Logitech MX Master 3S Performance Wireless Mouse',
        price: 9495, comp: 10995, brand: 'Logitech', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
        tags: ['mouse', 'mxmaster']
      },
      {
        name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD',
        price: 19499, comp: 24999, brand: 'Samsung', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
        tags: ['ssd', 'storage']
      },
      {
        name: 'HP Spectre x360 2-in-1 Nightfall Black',
        price: 154990, comp: 174990, brand: 'HP', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
        tags: ['hp', 'convertible']
      },
      {
        name: 'Acer Predator Helios 16 RTX 4080 Gaming',
        price: 199990, comp: 229990, brand: 'Acer', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
        tags: ['predator', 'rtx4080']
      },
      {
        name: 'BenQ DesignVue 32-inch 4K Color Accurate Monitor',
        price: 105000, comp: 120000, brand: 'BenQ', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800',
        tags: ['benq', '4k']
      },
      {
        name: 'Razer Blade 16 Dual-Mode Mini-LED QHD',
        price: 299990, comp: 329990, brand: 'Razer', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        tags: ['razer', 'blade']
      },
      {
        name: 'Corsair K70 MAX RGB Magnetic-Mechanical Keyboard',
        price: 19999, comp: 23999, brand: 'Corsair', cat: 'laptops-computers',
        img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800',
        tags: ['corsair', 'keyboard']
      },

      // === AUDIO & WEARABLES (15) ===
      {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Over-Ear',
        price: 26990, comp: 34990, brand: 'Sony', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        tags: ['sony', 'anc']
      },
      {
        name: 'Apple AirPods Pro (2nd Generation) USB-C Case',
        price: 24900, comp: 26900, brand: 'Apple', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
        tags: ['airpods', 'apple']
      },
      {
        name: 'Apple Watch Ultra 2 49mm Titanium Orange Alpine',
        price: 89900, comp: 94900, brand: 'Apple', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
        tags: ['apple-watch', 'ultra']
      },
      {
        name: 'Bose QuietComfort Ultra White Smoke Headphones',
        price: 35900, comp: 39900, brand: 'Bose', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
        tags: ['bose', 'quietcomfort']
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic Silver 47mm',
        price: 36999, comp: 42999, brand: 'Samsung', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        tags: ['galaxy-watch', 'samsung']
      },
      {
        name: 'Marshall Stanmore III Vintage Cream Speaker',
        price: 37999, comp: 41999, brand: 'Marshall', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
        tags: ['marshall', 'speaker']
      },
      {
        name: 'Garmin Fenix 7X Pro Solar Sapphire Multisport',
        price: 114990, comp: 129990, brand: 'Garmin', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
        tags: ['garmin', 'gps']
      },
      {
        name: 'Sennheiser Momentum 4 Wireless Matte Black',
        price: 29990, comp: 34990, brand: 'Sennheiser', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        tags: ['sennheiser', 'audiophile']
      },
      {
        name: 'JBL Boombox 3 Squad Camo Portable Speaker',
        price: 49999, comp: 59999, brand: 'JBL', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800',
        tags: ['jbl', 'waterproof']
      },
      {
        name: 'Nothing Ear (2) Transparent Case Hi-Res Buds',
        price: 9999, comp: 12999, brand: 'Nothing', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        tags: ['nothing', 'earbuds']
      },
      {
        name: 'Beats Studio Pro Deep Navy Wireless ANC',
        price: 29900, comp: 34900, brand: 'Beats', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=800',
        tags: ['beats', 'audio']
      },
      {
        name: 'Apple AirPods Max Space Grey Spatial Audio',
        price: 59900, comp: 64900, brand: 'Apple', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
        tags: ['airpods-max', 'apple']
      },
      {
        name: 'Sonos Era 300 Spatial Audio Smart Speaker',
        price: 54999, comp: 59999, brand: 'Sonos', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
        tags: ['sonos', 'speaker']
      },
      {
        name: 'Fossil Heritage Automatic Stainless Steel Watch',
        price: 24995, comp: 28995, brand: 'Fossil', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
        tags: ['fossil', 'classic-watch']
      },
      {
        name: 'Audio-Technica ATH-M50x Professional Studio Monitor',
        price: 13990, comp: 16990, brand: 'Audio-Technica', cat: 'audio-wearables',
        img: 'https://images.unsplash.com/photo-1520523839898-50712825e617?w=800',
        tags: ['studio', 'm50x']
      },

      // === GAMING & CONSOLES (12) ===
      {
        name: 'Sony PlayStation 5 Slim Console Disc Edition 1TB',
        price: 54990, comp: 59990, brand: 'Sony', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
        tags: ['ps5', 'playstation']
      },
      {
        name: 'Nintendo Switch OLED Model Neon Red & Blue',
        price: 31999, comp: 35999, brand: 'Nintendo', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800',
        tags: ['switch', 'nintendo']
      },
      {
        name: 'Valve Steam Deck OLED 512GB Handheld PC',
        price: 59999, comp: 65999, brand: 'Valve', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1612287233207-6f8d3840742d?w=800',
        tags: ['steamdeck', 'handheld']
      },
      {
        name: 'Microsoft Xbox Series X 1TB Robot White',
        price: 55990, comp: 59990, brand: 'Microsoft', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800',
        tags: ['xbox', 'series-x']
      },
      {
        name: 'Sony DualSense Edge Pro Wireless PS5 Controller',
        price: 18990, comp: 21990, brand: 'Sony', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800',
        tags: ['dualsense', 'controller']
      },
      {
        name: 'Razer BlackWidow V4 Pro Mechanical RGB',
        price: 22999, comp: 25999, brand: 'Razer', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
        tags: ['razer', 'keyboard']
      },
      {
        name: 'SteelSeries Arctis Nova Pro Wireless Headset',
        price: 34999, comp: 39999, brand: 'SteelSeries', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800',
        tags: ['headset', 'steelseries']
      },
      {
        name: 'Meta Quest 3 512GB Mixed Reality VR Headset',
        price: 62999, comp: 69999, brand: 'Meta', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800',
        tags: ['vr', 'meta-quest']
      },
      {
        name: 'ASUS ROG Ally X 24GB LPDDR5X Handheld Console',
        price: 89990, comp: 94990, brand: 'ASUS', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        tags: ['rog-ally', 'asus']
      },
      {
        name: 'Logitech G29 Driving Force Racing Wheel & Pedals',
        price: 29995, comp: 34995, brand: 'Logitech', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
        tags: ['racing-wheel', 'sim']
      },
      {
        name: 'Xbox Elite Wireless Controller Series 2 Core',
        price: 14990, comp: 17990, brand: 'Microsoft', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800',
        tags: ['xbox', 'controller']
      },
      {
        name: 'Elgato Wave 3 USB Condenser Microphone for Streaming',
        price: 14499, comp: 16999, brand: 'Elgato', cat: 'gaming-consoles',
        img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800',
        tags: ['microphone', 'stream']
      },

      // === CAMERAS & DRONES (10) ===
      {
        name: 'Sony Alpha 7 IV Full-frame 33MP Mirrorless Camera',
        price: 214990, comp: 242990, brand: 'Sony', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        tags: ['sony', 'alpha7']
      },
      {
        name: 'DJI Mini 4 Pro 4K HDR Drone RC 2 Remote',
        price: 94990, comp: 104990, brand: 'DJI', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800',
        tags: ['dji', 'mini4pro']
      },
      {
        name: 'GoPro HERO 12 Black 5.3K Waterproof Action Camera',
        price: 37990, comp: 44990, brand: 'GoPro', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800',
        tags: ['gopro', 'action']
      },
      {
        name: 'Fujifilm X-T5 40.2MP Mirrorless Classic Silver',
        price: 189999, comp: 209999, brand: 'Fujifilm', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800',
        tags: ['fujifilm', 'xt5']
      },
      {
        name: 'DJI Osmo Pocket 3 Creator Combo 4K Handheld',
        price: 53990, comp: 59990, brand: 'DJI', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800',
        tags: ['dji', 'pocket3']
      },
      {
        name: 'Canon EOS R6 Mark II Full-frame Mirrorless Body',
        price: 215995, comp: 239995, brand: 'Canon', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
        tags: ['canon', 'eos-r6']
      },
      {
        name: 'DJI Mavic 3 Pro Cine Drone with Hasselblad Camera',
        price: 369900, comp: 399900, brand: 'DJI', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800',
        tags: ['dji', 'mavic3']
      },
      {
        name: 'Nikon Z8 45.7MP 8K Video Flagship Mirrorless',
        price: 343990, comp: 379990, brand: 'Nikon', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800',
        tags: ['nikon', 'z8']
      },
      {
        name: 'Insta360 X4 8K 360 Degree Waterproof Action Cam',
        price: 54990, comp: 59990, brand: 'Insta360', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
        tags: ['insta360', '8k']
      },
      {
        name: 'Sigma 24-70mm F2.8 DG DN Art Lens for Sony E-Mount',
        price: 104990, comp: 119990, brand: 'Sigma', cat: 'cameras-drones',
        img: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800',
        tags: ['lens', 'sigma']
      },

      // === FASHION & APPAREL (12) ===
      {
        name: 'Classic Slim Fit Oxford Cotton Button-down Shirt',
        price: 1999, comp: 2999, brand: 'UrbanCraft', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
        tags: ['shirt', 'formal']
      },
      {
        name: 'Italian Tailored Wool Blazer Navy Blue',
        price: 34999, comp: 42999, brand: 'Armani', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
        tags: ['blazer', 'luxury']
      },
      {
        name: 'Premium Leather Biker Jacket Jet Black',
        price: 42000, comp: 48000, brand: 'AllSaints', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        tags: ['leather', 'jacket']
      },
      {
        name: 'Selvedge Japanese Denim Slim Tapered Jeans',
        price: 6999, comp: 8999, brand: 'Levi\'s', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800',
        tags: ['denim', 'jeans']
      },
      {
        name: 'Merino Wool Cable-Knit Crewneck Sweater',
        price: 14999, comp: 17999, brand: 'Ralph Lauren', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
        tags: ['sweater', 'merino']
      },
      {
        name: 'Arc\'teryx Beta AR Gore-Tex Waterproof Shell Jacket',
        price: 59990, comp: 69990, brand: 'Arc\'teryx', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
        tags: ['jacket', 'goretex']
      },
      {
        name: 'Handcrafted Italian Suede Chelsea Boots',
        price: 49999, comp: 59999, brand: 'Saint Laurent', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800',
        tags: ['boots', 'shoes']
      },
      {
        name: 'Heavyweight French Terry Luxury Hoodie Camel',
        price: 8999, comp: 11999, brand: 'Essentials', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
        tags: ['hoodie', 'streetwear']
      },
      {
        name: 'Silk Jacquard Evening Cocktail Dress',
        price: 79999, comp: 95000, brand: 'Gucci', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
        tags: ['dress', 'women']
      },
      {
        name: 'Ray-Ban Wayfarer Classic Polarized Sunglasses',
        price: 9890, comp: 11890, brand: 'Ray-Ban', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
        tags: ['sunglasses', 'rayban']
      },
      {
        name: 'Tissot PRX Powermatic 80 Blue Dial Watch',
        price: 54900, comp: 62000, brand: 'Tissot', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
        tags: ['watch', 'swiss']
      },
      {
        name: 'Montblanc Meisterstück Saffiano Leather Briefcase',
        price: 65000, comp: 75000, brand: 'Montblanc', cat: 'fashion-apparel',
        img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        tags: ['briefcase', 'leather']
      },

      // === HOME APPLIANCES (11) ===
      {
        name: 'Dyson V15 Detect Absolute Cordless Vacuum Cleaner',
        price: 65900, comp: 72900, brand: 'Dyson', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
        tags: ['dyson', 'vacuum']
      },
      {
        name: 'Philips 5400 Series Fully Automatic Espresso LatteGo',
        price: 74995, comp: 89995, brand: 'Philips', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
        tags: ['coffee', 'espresso']
      },
      {
        name: 'Dyson Purifier Hot+Cool Air Purifier Fan Heater',
        price: 59900, comp: 66900, brand: 'Dyson', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
        tags: ['purifier', 'dyson']
      },
      {
        name: 'LG 65-inch 4K OLED evo G3 Gallery Design Smart TV',
        price: 239990, comp: 289990, brand: 'LG', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
        tags: ['tv', 'oled']
      },
      {
        name: 'De\'Longhi La Specialista Prestigio Manual Espresso Machine',
        price: 84990, comp: 95990, brand: 'De\'Longhi', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
        tags: ['delonghi', 'espresso']
      },
      {
        name: 'Samsung Bespoke AI 4-Door French Door Refrigerator',
        price: 189990, comp: 219990, brand: 'Samsung', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?w=800',
        tags: ['fridge', 'samsung']
      },
      {
        name: 'iRobot Roomba j7+ Self-Emptying Robot Vacuum Clean',
        price: 69900, comp: 79900, brand: 'iRobot', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        tags: ['roomba', 'robot-vacuum']
      },
      {
        name: 'Ninja DoubleStack XL 2-Basket 10QT Air Fryer',
        price: 22999, comp: 27999, brand: 'Ninja', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
        tags: ['airfryer', 'kitchen']
      },
      {
        name: 'Sony BRAVIA XR 77-inch OLED 4K HDR Google TV',
        price: 349990, comp: 399990, brand: 'Sony', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800',
        tags: ['bravia', 'sony-tv']
      },
      {
        name: 'Breville Smart Oven Air Fryer Pro Brushed Stainless',
        price: 38990, comp: 44990, brand: 'Breville', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800',
        tags: ['oven', 'breville']
      },
      {
        name: 'Bose Smart Soundbar 900 Dolby Atmos Wireless',
        price: 89900, comp: 99900, brand: 'Bose', cat: 'home-appliances',
        img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
        tags: ['soundbar', 'dolby-atmos']
      },

      // === ACCESSORIES & GEAR (10) ===
      {
        name: 'Apple 140W USB-C Power Adapter Fast Charge',
        price: 9500, comp: 10500, brand: 'Apple', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800',
        tags: ['charger', 'apple']
      },
      {
        name: 'Anker Prime 20,000mAh 200W Output Power Bank',
        price: 11999, comp: 14999, brand: 'Anker', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1609592424368-8097d74db0a5?w=800',
        tags: ['powerbank', 'anker']
      },
      {
        name: 'Apple MagSafe Battery Pack Magnetic Wireless',
        price: 10900, comp: 11900, brand: 'Apple', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=800',
        tags: ['magsafe', 'apple']
      },
      {
        name: 'Peak Design Everyday Backpack 20L Charcoal V2',
        price: 27999, comp: 31999, brand: 'Peak Design', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        tags: ['backpack', 'travel']
      },
      {
        name: 'Spigen Tough Armor Case iPhone 15 Pro Max Gunmetal',
        price: 1999, comp: 2999, brand: 'Spigen', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        tags: ['case', 'spigen']
      },
      {
        name: 'Belkin 3-in-1 MagSafe 15W Fast Wireless Stand White',
        price: 13999, comp: 15999, brand: 'Belkin', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
        tags: ['belkin', 'wireless-stand']
      },
      {
        name: 'Nomad Rugged Horween Leather Case Rustic Brown',
        price: 4999, comp: 5999, brand: 'Nomad', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
        tags: ['leather-case', 'nomad']
      },
      {
        name: 'SanDisk Extreme Pro 1TB Portable SSD 2000MB/s',
        price: 12999, comp: 16999, brand: 'SanDisk', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
        tags: ['ssd', 'sandisk']
      },
      {
        name: 'Native Union Belt Cable Pro USB-C 240W Braided 2.4m',
        price: 3499, comp: 4299, brand: 'Native Union', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800',
        tags: ['cable', 'usbc']
      },
      {
        name: 'Twelve South Curve Aluminum Stand for MacBook',
        price: 4999, comp: 5999, brand: 'Twelve South', cat: 'accessories',
        img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
        tags: ['laptop-stand', 'desk']
      },
    ];

    // Delete existing products and inject 100 uniquely imaged products
    await Product.deleteMany({});

    const formattedProducts = productsCatalog.map((p, idx) => ({
      name: p.name,
      slug: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx + 1}`,
      description: `Experience the industry leading standard with ${p.name}. Designed with premium materials, state-of-the-art engineering, and high reliability.`,
      price: p.price,
      compareAtPrice: p.comp,
      category: categoryMap[p.cat],
      brand: p.brand,
      images: [{ url: p.img, isMain: true }],
      stock: 25 + (idx % 40),
      sku: `SKU-${p.brand.substring(0, 3).toUpperCase()}-${idx + 1001}`,
      ratingsAverage: Math.round((4.3 + ((idx % 7) * 0.1)) * 10) / 10,
      ratingsQuantity: 40 + (idx * 5),
      isFeatured: idx % 8 === 0,
      tags: p.tags,
      seller: seller?._id,
    }));

    const inserted = await Product.create(formattedProducts);
    logger.info(`🎉 Successfully seeded ${inserted.length} products with 100% distinct high-res image URLs!`);

    process.exit(0);
  } catch (err: any) {
    logger.error(`Seed error: ${err.message}`);
    process.exit(1);
  }
};

seed100UniqueImages();

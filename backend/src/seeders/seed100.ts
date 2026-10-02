import dns from 'node:dns';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { logger } from '../utils/logger.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export const seed100Products = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB for 100 Products Seeding across all categories...');

    // 1. Sync All 8 Categories
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

    // Valid reliable Unsplash CDN image URLs
    const imgUrls = {
      phone: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      phone2: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      laptop2: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
      headphone: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      drone: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800',
      gaming: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      fashion: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      fashion2: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      home: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?w=800',
      home2: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
      accessories: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800',
    };

    const products100: any[] = [];

    // 1. Smartphones & Tablets (15 items)
    const phoneData = [
      { name: 'iPhone 15 Pro Max 256GB Titanium', brand: 'Apple', price: 134900, comp: 159900, img: imgUrls.phone },
      { name: 'Samsung Galaxy S24 Ultra 5G AI', brand: 'Samsung', price: 129999, comp: 144999, img: imgUrls.phone2 },
      { name: 'Google Pixel 8 Pro 128GB Obsidian', brand: 'Google', price: 98999, comp: 106999, img: imgUrls.phone },
      { name: 'OnePlus 12 5G 16GB RAM 512GB', brand: 'OnePlus', price: 69999, comp: 74999, img: imgUrls.phone2 },
      { name: 'Apple iPad Pro 11-inch M4 OLED', brand: 'Apple', price: 99900, comp: 109900, img: imgUrls.tablet },
      { name: 'Xiaomi 14 Ultra Leica Optics', brand: 'Xiaomi', price: 99999, comp: 119999, img: imgUrls.phone },
      { name: 'Samsung Galaxy Z Fold 5 5G', brand: 'Samsung', price: 154999, comp: 169999, img: imgUrls.phone2 },
      { name: 'iPad Air 13-inch M2 Space Grey', brand: 'Apple', price: 79900, comp: 84900, img: imgUrls.tablet },
      { name: 'Nothing Phone (2) 12GB 256GB', brand: 'Nothing', price: 39999, comp: 44999, img: imgUrls.phone },
      { name: 'Samsung Galaxy Tab S9 Ultra AMOLED', brand: 'Samsung', price: 108999, comp: 121999, img: imgUrls.tablet },
      { name: 'iPhone 15 128GB Blue Edition', brand: 'Apple', price: 71900, comp: 79900, img: imgUrls.phone },
      { name: 'Vivo X100 Pro ZEISS Optics 5G', brand: 'Vivo', price: 89999, comp: 99999, img: imgUrls.phone2 },
      { name: 'Motorola Edge 50 Ultra 512GB', brand: 'Motorola', price: 59999, comp: 64999, img: imgUrls.phone },
      { name: 'Realme GT 6 5G Flagship AI', brand: 'Realme', price: 40999, comp: 44999, img: imgUrls.phone2 },
      { name: 'OnePlus Pad 2 12.1-inch 3K Display', brand: 'OnePlus', price: 39999, comp: 45999, img: imgUrls.tablet },
    ];
    phoneData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${100 + i}`,
        description: `Experience cutting edge performance with the ${item.name}. Features latest processor, stunning display and all-day battery life.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['smartphones-tablets'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 35 + (i * 2),
        sku: `PHN-${item.brand.substring(0, 3).toUpperCase()}-${100 + i}`,
        ratingsAverage: 4.5 + ((i % 5) * 0.1),
        ratingsQuantity: 80 + (i * 12),
        isFeatured: i < 3,
        tags: ['smartphones', item.brand.toLowerCase(), 'mobile'],
      });
    });

    // 2. Laptops & Computers (15 items)
    const laptopData = [
      { name: 'MacBook Pro 16-inch M3 Max 36GB 1TB', brand: 'Apple', price: 349900, comp: 379900, img: imgUrls.laptop },
      { name: 'Dell XPS 15 9530 Core i9 RTX 4070', brand: 'Dell', price: 245000, comp: 269000, img: imgUrls.laptop2 },
      { name: 'MacBook Air 13-inch M3 16GB Midnight', brand: 'Apple', price: 114900, comp: 124900, img: imgUrls.laptop },
      { name: 'ASUS ROG Zephyrus G14 OLED Gaming', brand: 'ASUS', price: 189990, comp: 209990, img: imgUrls.laptop2 },
      { name: 'Lenovo ThinkPad X1 Carbon Gen 11', brand: 'Lenovo', price: 165000, comp: 180000, img: imgUrls.laptop },
      { name: 'LG UltraGear 27-inch OLED 240Hz Gaming Monitor', brand: 'LG', price: 74999, comp: 89999, img: imgUrls.laptop2 },
      { name: 'Apple Mac Studio M2 Max Desktop', brand: 'Apple', price: 209900, comp: 229900, img: imgUrls.laptop },
      { name: 'Keychron Q1 Pro Custom Mechanical Keyboard', brand: 'Keychron', price: 18999, comp: 21999, img: imgUrls.laptop2 },
      { name: 'Logitech MX Master 3S Wireless Mouse', brand: 'Logitech', price: 9495, comp: 10995, img: imgUrls.laptop },
      { name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD', brand: 'Samsung', price: 19499, comp: 24999, img: imgUrls.laptop2 },
      { name: 'HP Spectre x360 2-in-1 OLED Touch Laptop', brand: 'HP', price: 154990, comp: 174990, img: imgUrls.laptop },
      { name: 'Acer Predator Helios 16 RTX 4080', brand: 'Acer', price: 199990, comp: 229990, img: imgUrls.laptop2 },
      { name: 'BenQ PD3220U 32-inch 4K Thunderbolt Monitor', brand: 'BenQ', price: 105000, comp: 120000, img: imgUrls.laptop },
      { name: 'Razer Blade 16 Dual-Mode Mini-LED', brand: 'Razer', price: 299990, comp: 329990, img: imgUrls.laptop2 },
      { name: 'Corsair K100 RGB Optical Mechanical Keyboard', brand: 'Corsair', price: 18499, comp: 21999, img: imgUrls.laptop },
    ];
    laptopData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${200 + i}`,
        description: `Engineered for extreme performance and productivity. ${item.name} delivers precision, speed and durability.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['laptops-computers'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 20 + (i * 2),
        sku: `LAP-${item.brand.substring(0, 3).toUpperCase()}-${200 + i}`,
        ratingsAverage: 4.6 + ((i % 5) * 0.1),
        ratingsQuantity: 40 + (i * 10),
        isFeatured: i < 3,
        tags: ['laptops', 'computing', item.brand.toLowerCase()],
      });
    });

    // 3. Audio & Wearables (15 items)
    const audioData = [
      { name: 'Sony WH-1000XM5 Wireless ANC Headphones', brand: 'Sony', price: 26990, comp: 34990, img: imgUrls.headphone },
      { name: 'Apple AirPods Pro (2nd Gen) USB-C', brand: 'Apple', price: 24900, comp: 26900, img: imgUrls.headphone },
      { name: 'Apple Watch Ultra 2 GPS + Cellular 49mm', brand: 'Apple', price: 89900, comp: 94900, img: imgUrls.watch },
      { name: 'Bose QuietComfort Ultra Headphones', brand: 'Bose', price: 35900, comp: 39900, img: imgUrls.headphone },
      { name: 'Samsung Galaxy Watch 6 Classic 47mm LTE', brand: 'Samsung', price: 36999, comp: 42999, img: imgUrls.watch },
      { name: 'Marshall Stanmore III Bluetooth Speaker', brand: 'Marshall', price: 37999, comp: 41999, img: imgUrls.headphone },
      { name: 'Garmin Fenix 7X Pro Solar Sapphire GPS', brand: 'Garmin', price: 114990, comp: 129990, img: imgUrls.watch },
      { name: 'Sennheiser Momentum 4 Wireless ANC', brand: 'Sennheiser', price: 29990, comp: 34990, img: imgUrls.headphone },
      { name: 'JBL Boombox 3 Wi-Fi Portable Speaker', brand: 'JBL', price: 49999, comp: 59999, img: imgUrls.headphone },
      { name: 'Nothing Ear (2) True Wireless Hi-Res', brand: 'Nothing', price: 9999, comp: 12999, img: imgUrls.headphone },
      { name: 'Beats Studio Pro Wireless ANC Headphones', brand: 'Beats', price: 29900, comp: 34900, img: imgUrls.headphone },
      { name: 'Fitbit Charge 6 Fitness Tracker', brand: 'Fitbit', price: 14999, comp: 16999, img: imgUrls.watch },
      { name: 'Sonos Move 2 Portable Smart Speaker', brand: 'Sonos', price: 44999, comp: 49999, img: imgUrls.headphone },
      { name: 'Fossil Gen 6 Smartwatch Smoke Stainless', brand: 'Fossil', price: 22995, comp: 25995, img: imgUrls.watch },
      { name: 'Bang & Olufsen Beoplay H95 Luxury ANC', brand: 'B&O', price: 89900, comp: 99900, img: imgUrls.headphone },
    ];
    audioData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${300 + i}`,
        description: `Premium acoustics and sensory precision. ${item.name} features spatial audio and active noise cancellation.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['audio-wearables'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 50 + (i * 3),
        sku: `AUD-${item.brand.substring(0, 3).toUpperCase()}-${300 + i}`,
        ratingsAverage: 4.7 + ((i % 4) * 0.1),
        ratingsQuantity: 60 + (i * 15),
        isFeatured: i < 3,
        tags: ['audio', 'wearables', item.brand.toLowerCase()],
      });
    });

    // 4. Gaming & Consoles (12 items)
    const gamingData = [
      { name: 'Sony PlayStation 5 Slim Console Disc Edition', brand: 'Sony', price: 54990, comp: 59990, img: imgUrls.gaming },
      { name: 'Nintendo Switch OLED Model White Joy-Con', brand: 'Nintendo', price: 31999, comp: 35999, img: imgUrls.gaming },
      { name: 'Valve Steam Deck OLED 512GB Handheld', brand: 'Valve', price: 59999, comp: 65999, img: imgUrls.gaming },
      { name: 'Microsoft Xbox Series X 1TB Console', brand: 'Microsoft', price: 55990, comp: 59990, img: imgUrls.gaming },
      { name: 'Sony DualSense Edge Wireless Controller', brand: 'Sony', price: 18990, comp: 21990, img: imgUrls.gaming },
      { name: 'Razer BlackWidow V4 Pro Mechanical Gaming', brand: 'Razer', price: 22999, comp: 25999, img: imgUrls.gaming },
      { name: 'SteelSeries Arctis Nova Pro Wireless Headset', brand: 'SteelSeries', price: 34999, comp: 39999, img: imgUrls.gaming },
      { name: 'Logitech G PRO X SUPERLIGHT 2 Mouse', brand: 'Logitech', price: 15995, comp: 17995, img: imgUrls.gaming },
      { name: 'Meta Quest 3 512GB VR Mixed Reality Headset', brand: 'Meta', price: 62999, comp: 69999, img: imgUrls.gaming },
      { name: 'Elgato Stream Deck MK.2 15 LCD Keys', brand: 'Elgato', price: 14499, comp: 16999, img: imgUrls.gaming },
      { name: 'ASUS ROG Ally X Handheld Gaming Console', brand: 'ASUS', price: 89990, comp: 94990, img: imgUrls.gaming },
      { name: 'Secretlab TITAN Evo 2024 Gaming Chair', brand: 'Secretlab', price: 46999, comp: 52999, img: imgUrls.gaming },
    ];
    gamingData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${400 + i}`,
        description: `Next generation immersive gaming. ${item.name} delivers ultra-responsive feedback and high FPS performance.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['gaming-consoles'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 30 + (i * 2),
        sku: `GAM-${item.brand.substring(0, 3).toUpperCase()}-${400 + i}`,
        ratingsAverage: 4.8 + ((i % 3) * 0.1),
        ratingsQuantity: 110 + (i * 20),
        isFeatured: i < 3,
        tags: ['gaming', 'consoles', item.brand.toLowerCase()],
      });
    });

    // 5. Cameras & Drones (10 items)
    const cameraData = [
      { name: 'Sony Alpha 7 IV Full-frame Mirrorless Camera', brand: 'Sony', price: 214990, comp: 242990, img: imgUrls.camera },
      { name: 'DJI Mini 4 Pro 4K HDR Drone RC 2', brand: 'DJI', price: 94990, comp: 104990, img: imgUrls.drone },
      { name: 'GoPro HERO 12 Black 5.3K Action Camera', brand: 'GoPro', price: 37990, comp: 44990, img: imgUrls.camera },
      { name: 'Fujifilm X-T5 Mirrorless Camera Kit', brand: 'Fujifilm', price: 189999, comp: 209999, img: imgUrls.camera },
      { name: 'DJI Osmo Pocket 3 4K Handheld Gimbal', brand: 'DJI', price: 53990, comp: 59990, img: imgUrls.camera },
      { name: 'Canon EOS R6 Mark II Full-frame Body', brand: 'Canon', price: 215995, comp: 239995, img: imgUrls.camera },
      { name: 'DJI Air 3 Fly More Combo Drone', brand: 'DJI', price: 139900, comp: 154900, img: imgUrls.drone },
      { name: 'Nikon Z8 8K Full-frame Mirrorless Camera', brand: 'Nikon', price: 343990, comp: 379990, img: imgUrls.camera },
      { name: 'Insta360 X4 8K 360 Action Camera', brand: 'Insta360', price: 54990, comp: 59990, img: imgUrls.camera },
      { name: 'Sony FE 24-70mm F2.8 GM II Lens', brand: 'Sony', price: 199990, comp: 219990, img: imgUrls.camera },
    ];
    cameraData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${500 + i}`,
        description: `Capture cinematic 4K/8K stills and footage with the ${item.name}. Uncompromising optical clarity.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['cameras-drones'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 15 + (i * 2),
        sku: `CAM-${item.brand.substring(0, 3).toUpperCase()}-${500 + i}`,
        ratingsAverage: 4.9,
        ratingsQuantity: 75 + (i * 10),
        isFeatured: i < 3,
        tags: ['cameras', 'drones', item.brand.toLowerCase()],
      });
    });

    // 6. Fashion & Apparel (12 items)
    const fashionData = [
      { name: 'Classic Slim Fit Oxford Cotton Shirt', brand: 'UrbanCraft', price: 1999, comp: 2999, img: imgUrls.fashion },
      { name: 'Italian Tailored Wool Blazer Jacket', brand: 'Armani', price: 34999, comp: 42999, img: imgUrls.fashion2 },
      { name: 'Premium Leather Biker Jacket Black', brand: 'AllSaints', price: 42000, comp: 48000, img: imgUrls.fashion },
      { name: 'Selvedge Raw Denim Slim Jeans', brand: 'Levi\'s', price: 6999, comp: 8999, img: imgUrls.fashion2 },
      { name: 'Merino Wool Crewneck Knit Sweater', brand: 'Ralph Lauren', price: 14999, comp: 17999, img: imgUrls.fashion },
      { name: 'Waterproof Gore-Tex Alpine Trench Coat', brand: 'Arc\'teryx', price: 59990, comp: 69990, img: imgUrls.fashion2 },
      { name: 'Handmade Italian Leather Chelsea Boots', brand: 'Saint Laurent', price: 49999, comp: 59999, img: imgUrls.fashion },
      { name: 'Organic Cotton Luxury Hoodie Sand Beige', brand: 'Essentials', price: 8999, comp: 11999, img: imgUrls.fashion2 },
      { name: 'Silk Jacquard Formal Evening Dress', brand: 'Gucci', price: 79999, comp: 95000, img: imgUrls.fashion },
      { name: 'Classic Polarized Wayfarer Sunglasses', brand: 'Ray-Ban', price: 9890, comp: 11890, img: imgUrls.fashion2 },
      { name: 'Swiss Chronograph Automatic Watch', brand: 'Tissot', price: 54900, comp: 62000, img: imgUrls.fashion },
      { name: 'Full Grain Leather Business Briefcase', brand: 'Montblanc', price: 65000, comp: 75000, img: imgUrls.fashion2 },
    ];
    fashionData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${600 + i}`,
        description: `Crafted from luxury breathable fabrics with precision tailoring. ${item.name} embodies contemporary elegance.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['fashion-apparel'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 40 + (i * 3),
        sku: `FSH-${item.brand.substring(0, 3).toUpperCase()}-${600 + i}`,
        ratingsAverage: 4.6 + ((i % 4) * 0.1),
        ratingsQuantity: 45 + (i * 8),
        isFeatured: i < 2,
        tags: ['fashion', 'luxury', item.brand.toLowerCase()],
      });
    });

    // 7. Home Appliances (11 items)
    const homeData = [
      { name: 'Dyson V15 Detect Cordless Vacuum Cleaner', brand: 'Dyson', price: 65900, comp: 72900, img: imgUrls.home },
      { name: 'Philips 5400 Fully Automatic Espresso Machine', brand: 'Philips', price: 74995, comp: 89995, img: imgUrls.home2 },
      { name: 'Dyson Purifier Hot+Cool Formaldehyde Air Purifier', brand: 'Dyson', price: 59900, comp: 66900, img: imgUrls.home },
      { name: 'LG 65-inch 4K OLED evo G3 Smart TV', brand: 'LG', price: 239990, comp: 289990, img: imgUrls.home2 },
      { name: 'De\'Longhi La Specialista Espresso Maker', brand: 'De\'Longhi', price: 84990, comp: 95990, img: imgUrls.home },
      { name: 'Samsung Bespoke AI 4-Door Flex Refrigerator', brand: 'Samsung', price: 189990, comp: 219990, img: imgUrls.home2 },
      { name: 'iRobot Roomba j7+ Self-Emptying Robot Vacuum', brand: 'iRobot', price: 69900, comp: 79900, img: imgUrls.home },
      { name: 'Ninja DoubleStack XL 2-Basket Air Fryer', brand: 'Ninja', price: 22999, comp: 27999, img: imgUrls.home2 },
      { name: 'Sony BRAVIA XR 77-inch OLED 4K Google TV', brand: 'Sony', price: 349990, comp: 399990, img: imgUrls.home },
      { name: 'Breville Smart Oven Air Fryer Pro', brand: 'Breville', price: 38990, comp: 44990, img: imgUrls.home2 },
      { name: 'Bose Smart Soundbar 900 Dolby Atmos', brand: 'Bose', price: 89900, comp: 99900, img: imgUrls.home },
    ];
    homeData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${700 + i}`,
        description: `Smart living perfected. ${item.name} brings smart automation, high energy efficiency and elegant design to your home.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['home-appliances'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 25 + (i * 2),
        sku: `HOM-${item.brand.substring(0, 3).toUpperCase()}-${700 + i}`,
        ratingsAverage: 4.8,
        ratingsQuantity: 90 + (i * 10),
        isFeatured: i < 2,
        tags: ['home-appliances', 'smart-home', item.brand.toLowerCase()],
      });
    });

    // 8. Accessories & Tech Gear (10 items)
    const accessData = [
      { name: 'Apple 140W USB-C Power Adapter Charger', brand: 'Apple', price: 9500, comp: 10500, img: imgUrls.accessories },
      { name: 'Anker Prime 20,000mAh 200W Power Bank', brand: 'Anker', price: 11999, comp: 14999, img: imgUrls.accessories },
      { name: 'Apple MagSafe Battery Pack Magnetic Charger', brand: 'Apple', price: 10900, comp: 11900, img: imgUrls.accessories },
      { name: 'Peak Design Everyday Backpack 20L V2', brand: 'Peak Design', price: 27999, comp: 31999, img: imgUrls.accessories },
      { name: 'Spigen Tough Armor Case iPhone 15 Pro Max', brand: 'Spigen', price: 1999, comp: 2999, img: imgUrls.accessories },
      { name: 'Belkin 3-in-1 MagSafe Fast Wireless Stand', brand: 'Belkin', price: 13999, comp: 15999, img: imgUrls.accessories },
      { name: 'Nomad Rugged Horween Leather Case', brand: 'Nomad', price: 4999, comp: 5999, img: imgUrls.accessories },
      { name: 'SanDisk Extreme Pro 1TB Portable SSD 2000MB/s', brand: 'SanDisk', price: 12999, comp: 16999, img: imgUrls.accessories },
      { name: 'Native Union Belt Cable Pro USB-C 240W Braided', brand: 'Native Union', price: 3499, comp: 4299, img: imgUrls.accessories },
      { name: 'Twelve South Curve Stand for MacBook', brand: 'Twelve South', price: 4999, comp: 5999, img: imgUrls.accessories },
    ];
    accessData.forEach((item, i) => {
      products100.push({
        name: item.name,
        slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${800 + i}`,
        description: `Premium durable daily essentials. ${item.name} offers highest standard materials and seamless device compatibility.`,
        price: item.price,
        compareAtPrice: item.comp,
        category: categoryMap['accessories'],
        brand: item.brand,
        images: [{ url: item.img, isMain: true }],
        stock: 80 + (i * 5),
        sku: `ACC-${item.brand.substring(0, 3).toUpperCase()}-${800 + i}`,
        ratingsAverage: 4.7 + ((i % 3) * 0.1),
        ratingsQuantity: 150 + (i * 20),
        isFeatured: i < 2,
        tags: ['accessories', 'gear', item.brand.toLowerCase()],
      });
    });

    // Insert all 100 Products into Database
    await Product.deleteMany({});
    const inserted = await Product.create(
      products100.map((p) => ({
        ...p,
        seller: seller?._id,
      }))
    );

    logger.info(`🎉 Successfully seeded ${inserted.length} products across all 8 categories!`);
    process.exit(0);
  } catch (err: any) {
    logger.error(`Seeding 100 products error: ${err.message}`);
    process.exit(1);
  }
};

seed100Products();

// ─────────────────────────────────────────────────────────────────
//  Product Seed Script (via Direct MongoDB Connection)
//  Run this script:               node seedProducts.js
// ─────────────────────────────────────────────────────────────────
require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const MONGO_URI = process.env.MONGODB_URL || process.env.MONGODB_URI;

const products = [
  // ── Grocery ────────────────────────────────────────────────────
  {
    name: "Premium Basmati Rice – 5kg",
    description: "Aged extra-long grain basmati rice. Fluffy, aromatic, and perfect for biryanis and pulao.",
    price: 599, originalPrice: 799, category: "Grocery", subcategory: "Rice & Grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"],
    rating: 4.6, numReviews: 412, sold: 1800, stock: 300, discount: "25% OFF", featured: true, isNew: false
  },
  {
    name: "Cold-Pressed Extra Virgin Olive Oil – 1L",
    description: "100% pure cold-pressed olive oil from Mediterranean olives. Rich, fruity flavour.",
    price: 899, originalPrice: 1199, category: "Grocery", subcategory: "Oils & Ghee",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80"],
    rating: 4.5, numReviews: 287, sold: 920, stock: 150, discount: "25% OFF", featured: false, isNew: false
  },
  {
    name: "Organic Honey – 500g",
    description: "Raw, unprocessed forest honey with natural enzymes and antioxidants.",
    price: 449, originalPrice: 599, category: "Grocery", subcategory: "Breakfast & Spreads",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80"],
    rating: 4.7, numReviews: 356, sold: 1400, stock: 200, discount: "25% OFF", featured: true, isNew: false
  },
  {
    name: "Whole Wheat Atta – 10kg",
    description: "Stone-ground whole wheat flour for soft chapatis. High fibre, no preservatives.",
    price: 399, originalPrice: 499, category: "Grocery", subcategory: "Rice & Grains",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80"],
    rating: 4.4, numReviews: 198, sold: 2200, stock: 500, discount: "20% OFF", featured: false, isNew: false
  },
  {
    name: "Green Tea – Jasmine (100 Bags)",
    description: "Premium jasmine green tea with delicate floral aroma. Antioxidant-rich.",
    price: 349, originalPrice: 499, category: "Grocery", subcategory: "Beverages",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80"],
    rating: 4.5, numReviews: 523, sold: 1600, stock: 250, discount: "30% OFF", featured: false, isNew: true
  },
  {
    name: "Mixed Dry Fruits Pack – 1kg",
    description: "Premium combo of almonds, cashews, raisins, and pistachios. Great for gifting.",
    price: 1299, originalPrice: 1799, category: "Grocery", subcategory: "Snacks & Dry Fruits",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=80"],
    rating: 4.8, numReviews: 645, sold: 2100, stock: 180, discount: "28% OFF", featured: true, isNew: false
  },
  {
    name: "Kerala Spice Box – Set of 12",
    description: "Authentic Kerala spice set: cardamom, cinnamon, cloves, pepper, turmeric and more.",
    price: 699, originalPrice: 999, category: "Grocery", subcategory: "Spices & Masala",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80"],
    rating: 4.6, numReviews: 234, sold: 870, stock: 120, discount: "30% OFF", featured: false, isNew: true
  },
  {
    name: "Dark Chocolate Bar – 72% Cocoa",
    description: "Rich Belgian dark chocolate with 72% cocoa. Smooth, intense, and guilt-free.",
    price: 249, originalPrice: 349, category: "Grocery", subcategory: "Snacks & Dry Fruits",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80"],
    rating: 4.5, numReviews: 412, sold: 1500, stock: 300, discount: "29% OFF", featured: false, isNew: false
  },
  {
    name: "Fresh Ground Coffee – 250g",
    description: "Freshly roasted and ground Arabica coffee beans. Bold aroma, smooth finish.",
    price: 499, originalPrice: 699, category: "Grocery", subcategory: "Beverages",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80"],
    rating: 4.7, numReviews: 312, sold: 1100, stock: 160, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Premium Cold-Pressed Avocado Oil – 500ml",
    description: "100% pure cold-pressed avocado oil. Mild, buttery flavor with high smoke point.",
    price: 799, originalPrice: 999, category: "Grocery", subcategory: "Oils & Ghee",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80"],
    rating: 4.6, numReviews: 124, sold: 480, stock: 95, discount: "20% OFF", featured: false, isNew: true
  },
  {
    name: "Organic White Quinoa Grain – 1kg",
    description: "Gluten-free organic quinoa. Rich in protein, fiber, and essential minerals.",
    price: 499, originalPrice: 649, category: "Grocery", subcategory: "Rice & Grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"],
    rating: 4.5, numReviews: 86, sold: 340, stock: 150, discount: "23% OFF", featured: false, isNew: true
  },

  // ── Shoes ──────────────────────────────────────────────────────
  {
    name: "Air-Cushion Running Sneakers",
    description: "Lightweight running shoes with air-cushioned sole and breathable mesh upper.",
    price: 2799, originalPrice: 3999, category: "Shoes", subcategory: "Sneakers",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80"],
    rating: 4.6, numReviews: 512, sold: 1100, stock: 90, discount: "30% OFF", featured: true, isNew: false
  },
  {
    name: "Chelsea Leather Boots",
    description: "Classic Chelsea boots in genuine calf leather. Elastic side panels, rubber sole.",
    price: 3999, originalPrice: 5499, category: "Shoes", subcategory: "Boots",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    rating: 4.7, numReviews: 289, sold: 610, stock: 45, discount: "27% OFF", featured: true, isNew: false
  },
  {
    name: "Men's Formal Oxford Shoes",
    description: "Genuine leather cap-toe Oxford shoes with rubber sole — timeless boardroom style.",
    price: 3499, originalPrice: 4799, category: "Shoes", subcategory: "Formal",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80"],
    rating: 4.6, numReviews: 147, sold: 320, stock: 35, discount: "27% OFF", featured: false, isNew: false
  },
  {
    name: "Canvas High-Top Sneakers",
    description: "Classic high-top canvas sneakers with vulcanised rubber sole and retro vibe.",
    price: 1299, originalPrice: 1799, category: "Shoes", subcategory: "Sneakers",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80"],
    rating: 4.4, numReviews: 267, sold: 590, stock: 120, discount: "28% OFF", featured: false, isNew: true
  },
  {
    name: "Waterproof Hiking Boots",
    description: "Gore-Tex waterproof hiking boots with ankle support and deep-lug outsole.",
    price: 4499, originalPrice: 6299, category: "Shoes", subcategory: "Boots",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80"],
    rating: 4.8, numReviews: 193, sold: 440, stock: 28, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Women's Block Heel Pumps",
    description: "Chic block-heel pumps in suede with a cushioned insole for all-day comfort.",
    price: 2199, originalPrice: 3099, category: "Shoes", subcategory: "Heels",
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80"],
    rating: 4.5, numReviews: 178, sold: 406, stock: 38, discount: "29% OFF", featured: false, isNew: false
  },
  {
    name: "Leather Sandals – Tan",
    description: "Hand-stitched leather sandals with adjustable ankle strap. Perfect for summer.",
    price: 1499, originalPrice: 1999, category: "Shoes", subcategory: "Sandals",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80"],
    rating: 4.3, numReviews: 145, sold: 330, stock: 55, discount: "25% OFF", featured: false, isNew: false
  },
  {
    name: "Slip-On Espadrilles",
    description: "Lightweight canvas espadrilles with jute rope sole — the perfect summer essential.",
    price: 899, originalPrice: 1199, category: "Shoes", subcategory: "Sandals",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80"],
    rating: 4.2, numReviews: 112, sold: 260, stock: 75, discount: "25% OFF", featured: false, isNew: true
  },
  {
    name: "Classic Italian Leather Loafers",
    description: "Handcrafted loafers in genuine full-grain leather. Sleek design, cushioned insoles.",
    price: 3499, originalPrice: 4999, category: "Shoes", subcategory: "Formal",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80"],
    rating: 4.7, numReviews: 112, sold: 290, stock: 45, discount: "30% OFF", featured: true, isNew: false
  },
  {
    name: "Minimalist White Leather Sneakers",
    description: "Clean, retro-style white sneakers with a durable rubber sole. Extremely versatile.",
    price: 2499, originalPrice: 3499, category: "Shoes", subcategory: "Sneakers",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80"],
    rating: 4.6, numReviews: 245, sold: 720, stock: 85, discount: "28% OFF", featured: true, isNew: true
  },

  // ── Apparel ────────────────────────────────────────────────────
  {
    name: "Classic Oxford Button-Down Shirt",
    description: "Crisp 100% cotton Oxford shirt perfect for smart-casual looks.",
    price: 1299, originalPrice: 1799, category: "Apparel", subcategory: "Men's Shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"],
    rating: 4.5, numReviews: 134, sold: 320, stock: 80, discount: "28% OFF", featured: true, isNew: false
  },
  {
    name: "Floral Midi Dress",
    description: "Feminine floral-print midi dress with smocked bodice. Perfect for brunches and parties.",
    price: 1899, originalPrice: 2699, category: "Apparel", subcategory: "Women's Dresses",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"],
    rating: 4.6, numReviews: 243, sold: 560, stock: 70, discount: "30% OFF", featured: true, isNew: false
  },
  {
    name: "Men's Leather Biker Jacket",
    description: "Premium genuine-leather biker jacket with quilted lining. Timeless street style.",
    price: 5999, originalPrice: 8499, category: "Apparel", subcategory: "Jackets & Coats",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"],
    rating: 4.7, numReviews: 212, sold: 450, stock: 30, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Slim-Fit Chino Pants",
    description: "Versatile slim-fit chinos in stretch cotton — great for office and weekends.",
    price: 1599, originalPrice: 2199, category: "Apparel", subcategory: "Men's Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"],
    rating: 4.3, numReviews: 89, sold: 210, stock: 55, discount: "27% OFF", featured: false, isNew: false
  },
  {
    name: "Women's Printed Kurti",
    description: "Vibrant block-print cotton kurti with three-quarter sleeves. Cool and comfortable.",
    price: 849, originalPrice: 1199, category: "Apparel", subcategory: "Women's Tops",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"],
    rating: 4.5, numReviews: 210, sold: 480, stock: 90, discount: "29% OFF", featured: false, isNew: true
  },
  {
    name: "Classic Trench Coat",
    description: "Water-resistant belted trench coat with storm flap and D-ring detail.",
    price: 6999, originalPrice: 9999, category: "Apparel", subcategory: "Jackets & Coats",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80"],
    rating: 4.8, numReviews: 228, sold: 490, stock: 22, discount: "30% OFF", featured: true, isNew: false
  },
  {
    name: "High-Waist Yoga Leggings",
    description: "4-way stretch moisture-wicking leggings with hidden waistband pocket.",
    price: 1199, originalPrice: 1599, category: "Apparel", subcategory: "Activewear",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80"],
    rating: 4.8, numReviews: 405, sold: 920, stock: 150, discount: "25% OFF", featured: false, isNew: false
  },
  {
    name: "Graphic Print Casual Tee",
    description: "Relaxed-fit 100% cotton tee with urban graphic print. Soft, breathable.",
    price: 649, originalPrice: 899, category: "Apparel", subcategory: "Men's Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"],
    rating: 4.2, numReviews: 310, sold: 780, stock: 200, discount: "28% OFF", featured: false, isNew: true
  },
  {
    name: "Elegant Wrap Maxi Dress",
    description: "Flowing wrap maxi dress in satin-finish fabric — effortlessly chic for evenings.",
    price: 2499, originalPrice: 3499, category: "Apparel", subcategory: "Women's Dresses",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80"],
    rating: 4.7, numReviews: 158, sold: 340, stock: 40, discount: "29% OFF", featured: false, isNew: false
  },
  {
    name: "Classic Denim Jacket – Vintage Wash",
    description: "Rugged denim jacket crafted from premium heavy cotton with a relaxed fit.",
    price: 1999, originalPrice: 2799, category: "Apparel", subcategory: "Jackets & Coats",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"],
    rating: 4.5, numReviews: 142, sold: 310, stock: 65, discount: "28% OFF", featured: false, isNew: true
  },
  {
    name: "Knitted Cable Wool Sweater",
    description: "Cozy knit sweater made from ultra-soft wool blend. Vintage cable pattern.",
    price: 1799, originalPrice: 2499, category: "Apparel", subcategory: "Sweaters",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"],
    rating: 4.4, numReviews: 98, sold: 190, stock: 40, discount: "28% OFF", featured: false, isNew: false
  },

  // ── Stationery ─────────────────────────────────────────────────
  {
    name: "Premium Fountain Pen – Blue Ink",
    description: "Brass body fountain pen with fine nib and blue-black ink cartridge. Smooth writing.",
    price: 1499, originalPrice: 1999, category: "Stationery", subcategory: "Pens & Pencils",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80"],
    rating: 4.6, numReviews: 189, sold: 430, stock: 60, discount: "25% OFF", featured: true, isNew: false
  },
  {
    name: "A5 Leather-Bound Notebook",
    description: "Handcrafted genuine leather journal with 200 ruled pages. Bookmark ribbon included.",
    price: 699, originalPrice: 999, category: "Stationery", subcategory: "Notebooks & Diaries",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80"],
    rating: 4.7, numReviews: 324, sold: 890, stock: 120, discount: "30% OFF", featured: true, isNew: false
  },
  {
    name: "Watercolour Paint Set – 24 Colours",
    description: "Professional-grade watercolour palette with 24 vibrant pigments and mixing tray.",
    price: 1199, originalPrice: 1599, category: "Stationery", subcategory: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"],
    rating: 4.5, numReviews: 167, sold: 380, stock: 75, discount: "25% OFF", featured: false, isNew: true
  },
  {
    name: "Bamboo Desk Organiser",
    description: "Eco-friendly bamboo organiser with compartments for pens, phone, cards, and clips.",
    price: 899, originalPrice: 1299, category: "Stationery", subcategory: "Desk Accessories",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80"],
    rating: 4.4, numReviews: 142, sold: 310, stock: 90, discount: "31% OFF", featured: false, isNew: false
  },
  {
    name: "Mechanical Pencil Set – 0.5mm",
    description: "Set of 3 premium mechanical pencils with lead refills and erasers. Precision drafting.",
    price: 499, originalPrice: 699, category: "Stationery", subcategory: "Pens & Pencils",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80"],
    rating: 4.3, numReviews: 98, sold: 240, stock: 150, discount: "29% OFF", featured: false, isNew: false
  },
  {
    name: "Dot Grid Bullet Journal",
    description: "Thick 160gsm paper dot-grid journal — perfect for bullet journaling, zero bleed-through.",
    price: 549, originalPrice: 749, category: "Stationery", subcategory: "Notebooks & Diaries",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80"],
    rating: 4.8, numReviews: 456, sold: 1200, stock: 200, discount: "27% OFF", featured: true, isNew: true
  },
  {
    name: "Coloured Marker Set – 36 Pcs",
    description: "Dual-tip (fine + chisel) alcohol markers in 36 vibrant colours. For illustration & lettering.",
    price: 1799, originalPrice: 2499, category: "Stationery", subcategory: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80"],
    rating: 4.6, numReviews: 213, sold: 550, stock: 80, discount: "28% OFF", featured: false, isNew: false
  },
  {
    name: "Professional Calligraphy Pen Set",
    description: "Deluxe set with 3 fountain pens, 5 nib widths, and 12 assorted color ink cartridges.",
    price: 1899, originalPrice: 2499, category: "Stationery", subcategory: "Pens & Pencils",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80"],
    rating: 4.6, numReviews: 93, sold: 210, stock: 50, discount: "24% OFF", featured: false, isNew: true
  },
  {
    name: "A3 Self-Healing Cutting Mat",
    description: "Durable self-healing PVC cutting mat with clear grid layout. Non-slip surface.",
    price: 599, originalPrice: 799, category: "Stationery", subcategory: "Art Supplies",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"],
    rating: 4.4, numReviews: 65, sold: 180, stock: 75, discount: "25% OFF", featured: false, isNew: false
  },

  // ── Bakery ─────────────────────────────────────────────────────
  {
    name: "Artisan Sourdough Bread",
    description: "Freshly baked sourdough with crispy crust and tangy crumb. Made with natural leaven.",
    price: 249, originalPrice: 349, category: "Bakery", subcategory: "Breads",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"],
    rating: 4.7, numReviews: 378, sold: 1500, stock: 50, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Belgian Chocolate Cake – 1kg",
    description: "Rich triple-layer chocolate cake with ganache frosting. Serves 8-10.",
    price: 1299, originalPrice: 1699, category: "Bakery", subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"],
    rating: 4.8, numReviews: 524, sold: 1800, stock: 30, discount: "24% OFF", featured: true, isNew: false
  },
  {
    name: "Butter Croissants – Pack of 6",
    description: "Flaky, buttery French croissants. Perfect for breakfast with jam and coffee.",
    price: 399, originalPrice: 549, category: "Bakery", subcategory: "Pastries",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&q=80"],
    rating: 4.5, numReviews: 267, sold: 980, stock: 40, discount: "27% OFF", featured: false, isNew: false
  },
  {
    name: "Assorted Cookies Box – 500g",
    description: "Handmade assorted cookies: choco-chip, oatmeal, almond, and butter cookies.",
    price: 449, originalPrice: 599, category: "Bakery", subcategory: "Cookies & Biscuits",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"],
    rating: 4.6, numReviews: 312, sold: 1100, stock: 80, discount: "25% OFF", featured: false, isNew: true
  },
  {
    name: "Red Velvet Cupcakes – Pack of 12",
    description: "Moist red velvet cupcakes with cream cheese frosting. Perfect for celebrations.",
    price: 799, originalPrice: 1099, category: "Bakery", subcategory: "Cakes",
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80"],
    rating: 4.7, numReviews: 198, sold: 650, stock: 25, discount: "27% OFF", featured: true, isNew: false
  },
  {
    name: "Multigrain Sandwich Bread",
    description: "Healthy multigrain bread with flaxseeds, oats, and sunflower seeds. No preservatives.",
    price: 149, originalPrice: 199, category: "Bakery", subcategory: "Breads",
    image: "https://images.unsplash.com/photo-1549931319-a545753467c8?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1549931319-a545753467c8?w=600&q=80"],
    rating: 4.4, numReviews: 187, sold: 2200, stock: 100, discount: "25% OFF", featured: false, isNew: false
  },
  {
    name: "Danish Pastry Platter – 8 Pcs",
    description: "Assorted Danish pastries with custard, fruits, and chocolate. Freshly baked.",
    price: 599, originalPrice: 849, category: "Bakery", subcategory: "Pastries",
    image: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600&q=80"],
    rating: 4.5, numReviews: 145, sold: 430, stock: 35, discount: "29% OFF", featured: false, isNew: true
  },
  {
    name: "Fresh Almond Croissants – Pack of 4",
    description: "Buttery, flaky croissants filled with almond cream and topped with sliced almonds.",
    price: 349, originalPrice: 449, category: "Bakery", subcategory: "Pastries",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&q=80"],
    rating: 4.7, numReviews: 156, sold: 680, stock: 35, discount: "22% OFF", featured: false, isNew: true
  },
  {
    name: "Gourmet Blueberry Muffins – Pack of 6",
    description: "Moist, bakery-fresh muffins bursting with sweet, plump blueberries.",
    price: 299, originalPrice: 399, category: "Bakery", subcategory: "Pastries",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"],
    rating: 4.5, numReviews: 198, sold: 540, stock: 45, discount: "25% OFF", featured: false, isNew: false
  },

  // ── Sports ─────────────────────────────────────────────────────
  {
    name: "Professional Yoga Mat – 6mm",
    description: "Non-slip TPE yoga mat with alignment lines. Eco-friendly, lightweight, and durable.",
    price: 1499, originalPrice: 1999, category: "Sports", subcategory: "Fitness",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80"],
    rating: 4.7, numReviews: 389, sold: 920, stock: 100, discount: "25% OFF", featured: true, isNew: false
  },
  {
    name: "Football – FIFA Quality Pro",
    description: "Match-quality football with thermal-bonded panels. Size 5, official weight.",
    price: 1999, originalPrice: 2799, category: "Sports", subcategory: "Team Sports",
    image: "https://images.unsplash.com/photo-1614632537423-1e6078b0e1d8?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1614632537423-1e6078b0e1d8?w=600&q=80"],
    rating: 4.6, numReviews: 267, sold: 680, stock: 55, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Adjustable Dumbbell Set – 20kg",
    description: "Space-saving adjustable dumbbell pair. Quick-change weight from 2.5kg to 20kg.",
    price: 4999, originalPrice: 6999, category: "Sports", subcategory: "Fitness",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"],
    rating: 4.8, numReviews: 198, sold: 440, stock: 30, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Badminton Racket – Carbon Fibre",
    description: "Lightweight carbon fibre racket with high tension. Includes carry case.",
    price: 2499, originalPrice: 3499, category: "Sports", subcategory: "Racket Sports",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80"],
    rating: 4.5, numReviews: 156, sold: 340, stock: 45, discount: "29% OFF", featured: false, isNew: true
  },
  {
    name: "Cricket Bat – English Willow",
    description: "Grade 1 English willow cricket bat. Perfectly balanced, thick edges.",
    price: 5999, originalPrice: 7999, category: "Sports", subcategory: "Team Sports",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80"],
    rating: 4.7, numReviews: 234, sold: 510, stock: 20, discount: "25% OFF", featured: false, isNew: false
  },
  {
    name: "Camping Tent – 4 Person",
    description: "Waterproof dome tent with vestibule. Easy setup, UV-resistant fabric.",
    price: 3999, originalPrice: 5499, category: "Sports", subcategory: "Outdoor & Camping",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80"],
    rating: 4.6, numReviews: 178, sold: 290, stock: 25, discount: "27% OFF", featured: false, isNew: false
  },
  {
    name: "Resistance Bands Set – 5 Levels",
    description: "Latex-free resistance bands in 5 strengths. Portable workout anywhere.",
    price: 699, originalPrice: 999, category: "Sports", subcategory: "Fitness",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80"],
    rating: 4.4, numReviews: 312, sold: 780, stock: 200, discount: "30% OFF", featured: false, isNew: true
  },
  {
    name: "Swimming Goggles – Anti-Fog",
    description: "Professional anti-fog swim goggles with UV protection and adjustable strap.",
    price: 599, originalPrice: 849, category: "Sports", subcategory: "Swimming",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80"],
    rating: 4.5, numReviews: 145, sold: 420, stock: 80, discount: "29% OFF", featured: false, isNew: false
  },
  {
    name: "Smart Active Fitness Band",
    description: "Waterproof fitness band with heart rate monitor, sleep tracker, and AMOLED display.",
    price: 2199, originalPrice: 2999, category: "Sports", subcategory: "Fitness",
    image: "https://images.unsplash.com/photo-1506107557195-0e29a4b5b4aa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1506107557195-0e29a4b5b4aa?w=600&q=80"],
    rating: 4.5, numReviews: 184, sold: 590, stock: 80, discount: "27% OFF", featured: true, isNew: true
  },
  {
    name: "Ergonomic Insulated Water Bottle",
    description: "Double-walled vacuum insulated stainless steel bottle. Keeps drinks cold for 24h.",
    price: 799, originalPrice: 1099, category: "Sports", subcategory: "Accessories",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80"],
    rating: 4.6, numReviews: 203, sold: 850, stock: 140, discount: "27% OFF", featured: false, isNew: false
  },

  // ── Furniture ──────────────────────────────────────────────────
  {
    name: "Ergonomic Office Chair",
    description: "Adjustable lumbar support, breathable mesh back, and 360° swivel. Perfect for WFH.",
    price: 12999, originalPrice: 17999, category: "Furniture", subcategory: "Office",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80"],
    rating: 4.7, numReviews: 312, sold: 680, stock: 25, discount: "28% OFF", featured: true, isNew: false
  },
  {
    name: "Solid Oak Bookshelf – 5 Tier",
    description: "Handcrafted solid oak bookshelf with 5 open shelves. Natural wood grain finish.",
    price: 8999, originalPrice: 12999, category: "Furniture", subcategory: "Storage",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80"],
    rating: 4.6, numReviews: 178, sold: 340, stock: 15, discount: "31% OFF", featured: true, isNew: false
  },
  {
    name: "L-Shaped Computer Desk",
    description: "Modern L-shaped corner desk with cable management and monitor shelf. 150x120cm.",
    price: 7999, originalPrice: 10999, category: "Furniture", subcategory: "Office",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80"],
    rating: 4.5, numReviews: 145, sold: 280, stock: 18, discount: "27% OFF", featured: false, isNew: true
  },
  {
    name: "Velvet Accent Armchair",
    description: "Mid-century modern velvet armchair with wooden legs. Deep cushion seating.",
    price: 14999, originalPrice: 19999, category: "Furniture", subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"],
    rating: 4.8, numReviews: 234, sold: 460, stock: 12, discount: "25% OFF", featured: true, isNew: false
  },
  {
    name: "Queen-Size Platform Bed Frame",
    description: "Minimalist pine wood platform bed with slatted base. No box spring needed.",
    price: 16999, originalPrice: 22999, category: "Furniture", subcategory: "Bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80"],
    rating: 4.6, numReviews: 167, sold: 310, stock: 10, discount: "26% OFF", featured: false, isNew: false
  },
  {
    name: "Bamboo Shoe Rack – 3 Tier",
    description: "Eco-friendly bamboo shoe rack holding up to 12 pairs. Compact and sturdy.",
    price: 1999, originalPrice: 2799, category: "Furniture", subcategory: "Storage",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80"],
    rating: 4.4, numReviews: 198, sold: 520, stock: 40, discount: "29% OFF", featured: false, isNew: false
  },
  {
    name: "Round Dining Table – 4 Seater",
    description: "Modern round dining table in walnut finish with tapered legs. 110cm diameter.",
    price: 11999, originalPrice: 15999, category: "Furniture", subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80"],
    rating: 4.5, numReviews: 123, sold: 190, stock: 8, discount: "25% OFF", featured: false, isNew: true
  },
  {
    name: "Minimalist Solid Oak Coffee Table",
    description: "Chic Scandinavian-style coffee table made from solid oak wood. Sleek tapered legs.",
    price: 6499, originalPrice: 8999, category: "Furniture", subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80"],
    rating: 4.7, numReviews: 76, sold: 150, stock: 12, discount: "28% OFF", featured: true, isNew: true
  },
  {
    name: "Modern Fabric Lounge Armchair",
    description: "Comfortable accent armchair upholstered in soft premium linen fabric. Sturdy metal legs.",
    price: 11999, originalPrice: 15999, category: "Furniture", subcategory: "Living Room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"],
    rating: 4.6, numReviews: 89, sold: 110, stock: 8, discount: "25% OFF", featured: true, isNew: false
  },

  // ── Plants ─────────────────────────────────────────────────────
  {
    name: "Monstera Deliciosa – Large",
    description: "Stunning Swiss cheese plant with fenestrated leaves. 60-70cm tall, comes in terracotta pot.",
    price: 1299, originalPrice: 1799, category: "Plants", subcategory: "Indoor Plants",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80"],
    rating: 4.7, numReviews: 345, sold: 780, stock: 35, discount: "28% OFF", featured: true, isNew: false
  },
  {
    name: "Succulent Collection – Set of 6",
    description: "Curated set of 6 mini succulents in ceramic pots. Low maintenance, desk-friendly.",
    price: 899, originalPrice: 1299, category: "Plants", subcategory: "Succulents & Cacti",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80"],
    rating: 4.6, numReviews: 456, sold: 1200, stock: 60, discount: "31% OFF", featured: true, isNew: false
  },
  {
    name: "Herb Garden Kit – Basil, Mint, Rosemary",
    description: "Grow-your-own herb kit with seeds, soil pods, and biodegradable pots.",
    price: 599, originalPrice: 799, category: "Plants", subcategory: "Herbs & Edibles",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80"],
    rating: 4.5, numReviews: 278, sold: 650, stock: 80, discount: "25% OFF", featured: false, isNew: true
  },
  {
    name: "Fiddle Leaf Fig – Medium",
    description: "Popular fiddle leaf fig plant, 40-50cm tall. Bright green violin-shaped leaves.",
    price: 999, originalPrice: 1399, category: "Plants", subcategory: "Indoor Plants",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80"],
    rating: 4.4, numReviews: 198, sold: 430, stock: 25, discount: "29% OFF", featured: false, isNew: false
  },
  {
    name: "Terracotta Planter Set – 3 Sizes",
    description: "Handmade terracotta planters in 3 sizes with drainage holes. Rustic charm.",
    price: 799, originalPrice: 1099, category: "Plants", subcategory: "Planers & Pots",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80"],
    rating: 4.5, numReviews: 167, sold: 380, stock: 50, discount: "27% OFF", featured: false, isNew: false
  },
  {
    name: "Lavender Plant – Live",
    description: "Fragrant English lavender in a 6-inch pot. Calming scent, attracts butterflies.",
    price: 449, originalPrice: 599, category: "Plants", subcategory: "Outdoor Plants",
    image: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&q=80"],
    rating: 4.6, numReviews: 234, sold: 560, stock: 40, discount: "25% OFF", featured: true, isNew: false
  },
  {
    name: "Hanging Macramé Planter",
    description: "Handwoven cotton macramé hanger with wooden ring. Holds pots up to 8 inches.",
    price: 399, originalPrice: 599, category: "Plants", subcategory: "Planters & Pots",
    image: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=600&q=80"],
    rating: 4.3, numReviews: 145, sold: 320, stock: 70, discount: "33% OFF", featured: false, isNew: true
  },
  {
    name: "Aloe Vera – Medicinal",
    description: "Mature aloe vera plant in a ceramic pot. Natural skin care, easy to maintain.",
    price: 349, originalPrice: 499, category: "Plants", subcategory: "Succulents & Cacti",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80"],
    rating: 4.5, numReviews: 289, sold: 720, stock: 55, discount: "30% OFF", featured: false, isNew: false
  },
  {
    name: "Snake Plant (Sansevieria)",
    description: "Air-purifying live indoor plant. Hardy and low maintenance, grows in low light.",
    price: 499, originalPrice: 699, category: "Plants", subcategory: "Indoor Plants",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80"],
    rating: 4.8, numReviews: 412, sold: 1100, stock: 90, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Peace Lily (Spathiphyllum)",
    description: "Beautiful live peace lily plant with elegant white blooms. Terracotta pot included.",
    price: 699, originalPrice: 899, category: "Plants", subcategory: "Indoor Plants",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80"],
    rating: 4.6, numReviews: 187, sold: 430, stock: 45, discount: "22% OFF", featured: false, isNew: true
  },

  // ── Books ──────────────────────────────────────────────────────
  {
    name: "Atomic Habits – James Clear",
    description: "The #1 bestseller on building good habits and breaking bad ones. 320 pages.",
    price: 399, originalPrice: 599, category: "Books", subcategory: "Self-Help",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"],
    rating: 4.9, numReviews: 1245, sold: 5600, stock: 300, discount: "33% OFF", featured: true, isNew: false
  },
  {
    name: "Sapiens – Yuval Noah Harari",
    description: "A brief history of humankind. Thought-provoking and brilliantly written. 498 pages.",
    price: 499, originalPrice: 699, category: "Books", subcategory: "Non-Fiction",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"],
    rating: 4.8, numReviews: 987, sold: 4200, stock: 250, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "The Alchemist – Paulo Coelho",
    description: "A magical fable about following your dreams. One of the most translated books ever.",
    price: 249, originalPrice: 349, category: "Books", subcategory: "Fiction",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80"],
    rating: 4.7, numReviews: 2134, sold: 8900, stock: 500, discount: "29% OFF", featured: true, isNew: false
  },
  {
    name: "Python Programming – Beginner to Pro",
    description: "Comprehensive Python guide covering basics to advanced topics. 600+ pages with exercises.",
    price: 699, originalPrice: 999, category: "Books", subcategory: "Academic & Technical",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80"],
    rating: 4.6, numReviews: 456, sold: 1800, stock: 200, discount: "30% OFF", featured: false, isNew: true
  },
  {
    name: "Goodnight Moon – Children's Classic",
    description: "Beloved bedtime story for little ones. Beautiful illustrations, board book edition.",
    price: 299, originalPrice: 399, category: "Books", subcategory: "Children's",
    image: "https://images.unsplash.com/photo-1629992101753-56d196c8adf7?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1629992101753-56d196c8adf7?w=600&q=80"],
    rating: 4.8, numReviews: 678, sold: 3200, stock: 400, discount: "25% OFF", featured: false, isNew: false
  },
  {
    name: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. 256 pages.",
    price: 349, originalPrice: 499, category: "Books", subcategory: "Self-Help",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"],
    rating: 4.7, numReviews: 567, sold: 2400, stock: 180, discount: "30% OFF", featured: false, isNew: false
  },
  {
    name: "Harry Potter Box Set – 7 Books",
    description: "Complete Harry Potter collection in a premium box set. Hardcover edition.",
    price: 3999, originalPrice: 5499, category: "Books", subcategory: "Fiction",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"],
    rating: 4.9, numReviews: 1890, sold: 7200, stock: 100, discount: "27% OFF", featured: true, isNew: false
  },
  {
    name: "Drawing on the Right Side of the Brain",
    description: "Classic guide to learning to draw. Unlock your creative potential. 4th Edition.",
    price: 599, originalPrice: 799, category: "Books", subcategory: "Non-Fiction",
    image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600&q=80"],
    rating: 4.5, numReviews: 312, sold: 890, stock: 120, discount: "25% OFF", featured: false, isNew: true
  },
  {
    name: "Thinking, Fast and Slow",
    description: "Nobel laureate Daniel Kahneman's seminal work on how we think and make choices.",
    price: 449, originalPrice: 599, category: "Books", subcategory: "Non-Fiction",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"],
    rating: 4.8, numReviews: 812, sold: 2800, stock: 120, discount: "25% OFF", featured: true, isNew: false
  },
  {
    name: "Zero to One – Notes on Startups",
    description: "Peter Thiel's groundbreaking book on how to build the future and create new value.",
    price: 349, originalPrice: 499, category: "Books", subcategory: "Business & Tech",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"],
    rating: 4.7, numReviews: 652, sold: 1900, stock: 110, discount: "30% OFF", featured: false, isNew: true
  }
];

async function seedDirect() {
  console.log('🔌 Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('✅ Connected!');

  console.log('🧹 Clearing existing products…');
  await Product.deleteMany({});

  const result = await Product.insertMany(products, { ordered: false });
  console.log(`🎉 Inserted ${result.length} products!`);

  const after = await Product.countDocuments();
  console.log(`📦 Total products now: ${after}`);

  await mongoose.disconnect();
  console.log('🔌 Done.');
}

seedDirect().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  console.log('\n💡 TIP: Update MONGODB_URI in backend/.env with a valid connection string and retry.');
  process.exit(1);
});

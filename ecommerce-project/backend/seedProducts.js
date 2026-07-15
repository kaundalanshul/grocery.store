// ─────────────────────────────────────────────────────────────────
//  Product Seed Script (via HTTP API)
//  1. Make sure your backend is running:  npm start  (port 3001)
//  2. Then run this script:               node seedProducts.js
// ─────────────────────────────────────────────────────────────────
require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

// ── Directly use mongoose (same as server) ────────────────────────
const MONGO_URI = process.env.MONGODB_URI;

const products = [
  // ════════════════════ MEN'S ════════════════════
  {
    name: "Classic Oxford Button-Down Shirt",
    description: "Crisp 100% cotton Oxford shirt — perfect for smart-casual looks.",
    price: 1299, originalPrice: 1799, category: "Men's", subcategory: "Shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"],
    rating: 4.5, numReviews: 134, sold: 320, stock: 80, discount: "28% OFF", featured: true, isNew: false,
  },
  {
    name: "Slim-Fit Chino Pants",
    description: "Versatile slim-fit chinos crafted from stretch cotton — great for office and weekend.",
    price: 1599, originalPrice: 2199, category: "Men's", subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"],
    rating: 4.3, numReviews: 89, sold: 210, stock: 55, discount: "27% OFF", featured: false, isNew: false,
  },
  {
    name: "Men's Leather Biker Jacket",
    description: "Premium genuine-leather biker jacket with quilted lining. Timeless street style.",
    price: 5999, originalPrice: 8499, category: "Men's", subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"],
    rating: 4.7, numReviews: 212, sold: 450, stock: 30, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "3-Piece Formal Business Suit",
    description: "Tailored slim-fit suit in premium wool blend. Includes jacket, trousers, and waistcoat.",
    price: 8999, originalPrice: 12999, category: "Men's", subcategory: "Suits",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"],
    rating: 4.8, numReviews: 176, sold: 340, stock: 20, discount: "31% OFF", featured: true, isNew: false,
  },
  {
    name: "Graphic Print Casual Tee",
    description: "Relaxed-fit 100% cotton tee with urban graphic print. Soft, breathable comfort.",
    price: 649, originalPrice: 899, category: "Men's", subcategory: "Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"],
    rating: 4.2, numReviews: 310, sold: 780, stock: 200, discount: "28% OFF", featured: false, isNew: true,
  },
  {
    name: "Cargo Combat Pants",
    description: "Durable multi-pocket cargo pants in ripstop fabric — utility meets style.",
    price: 1899, originalPrice: 2499, category: "Men's", subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"],
    rating: 4.1, numReviews: 65, sold: 150, stock: 45, discount: "24% OFF", featured: false, isNew: true,
  },
  {
    name: "Wool Overcoat – Navy",
    description: "Mid-length premium wool overcoat in classic navy. Structured silhouette for a sharp look.",
    price: 6499, originalPrice: 8999, category: "Men's", subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"],
    rating: 4.6, numReviews: 98, sold: 210, stock: 18, discount: "28% OFF", featured: true, isNew: false,
  },

  // ════════════════════ WOMEN'S ════════════════════
  {
    name: "Floral Midi Dress",
    description: "Feminine floral-print midi dress with smocked bodice. Perfect for brunches and parties.",
    price: 1899, originalPrice: 2699, category: "Women's", subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"],
    rating: 4.6, numReviews: 243, sold: 560, stock: 70, discount: "30% OFF", featured: true, isNew: false,
  },
  {
    name: "Ribbed Knit Crop Top",
    description: "Stretchy ribbed crop top ideal for styling with high-waist jeans or skirts.",
    price: 799, originalPrice: 1099, category: "Women's", subcategory: "Tops",
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80"],
    rating: 4.4, numReviews: 187, sold: 430, stock: 110, discount: "27% OFF", featured: false, isNew: true,
  },
  {
    name: "Elegant Wrap Maxi Dress",
    description: "Flowing wrap maxi dress in satin-finish fabric — effortlessly chic for evenings.",
    price: 2499, originalPrice: 3499, category: "Women's", subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80"],
    rating: 4.7, numReviews: 158, sold: 340, stock: 40, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "Tailored Blazer – Caramel",
    description: "Single-button tailored blazer in caramel. Layer over a dress or jeans for polished looks.",
    price: 3299, originalPrice: 4599, category: "Women's", subcategory: "Coats",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80"],
    rating: 4.5, numReviews: 122, sold: 280, stock: 35, discount: "28% OFF", featured: true, isNew: false,
  },
  {
    name: "High-Waist Yoga Leggings",
    description: "4-way stretch moisture-wicking leggings with hidden waistband pocket.",
    price: 1199, originalPrice: 1599, category: "Women's", subcategory: "Activewear",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80"],
    rating: 4.8, numReviews: 405, sold: 920, stock: 150, discount: "25% OFF", featured: true, isNew: false,
  },
  {
    name: "Off-Shoulder Linen Blouse",
    description: "Breezy off-shoulder blouse in natural linen — ideal for summer days.",
    price: 999, originalPrice: 1399, category: "Women's", subcategory: "Tops",
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&q=80"],
    rating: 4.3, numReviews: 76, sold: 190, stock: 80, discount: "29% OFF", featured: false, isNew: true,
  },
  {
    name: "Pleated A-Line Skirt",
    description: "Elegant pleated midi skirt in chiffon. Pairs with tucked-in blouses or fitted tees.",
    price: 1299, originalPrice: 1799, category: "Women's", subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&q=80"],
    rating: 4.4, numReviews: 93, sold: 230, stock: 60, discount: "28% OFF", featured: false, isNew: false,
  },

  // ════════════════════ FOOTWEAR ════════════════════
  {
    name: "Chelsea Leather Boots",
    description: "Classic Chelsea boots in genuine calf leather. Elastic side panels, rubber sole.",
    price: 3999, originalPrice: 5499, category: "Footwear", subcategory: "Boots",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    rating: 4.7, numReviews: 289, sold: 610, stock: 45, discount: "27% OFF", featured: true, isNew: false,
  },
  {
    name: "Air-Cushion Running Sneakers",
    description: "Lightweight running shoes with air-cushioned sole and breathable mesh upper.",
    price: 2799, originalPrice: 3999, category: "Footwear", subcategory: "Sneakers",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80"],
    rating: 4.6, numReviews: 512, sold: 1100, stock: 90, discount: "30% OFF", featured: true, isNew: false,
  },
  {
    name: "Strappy Gladiator Sandals",
    description: "Hand-stitched leather gladiator sandals with adjustable ankle strap — resort-ready.",
    price: 1499, originalPrice: 1999, category: "Footwear", subcategory: "Sandals",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80"],
    rating: 4.3, numReviews: 145, sold: 330, stock: 55, discount: "25% OFF", featured: false, isNew: false,
  },
  {
    name: "Stiletto Block Heels",
    description: "Chic block-heel pumps in suede with a cushioned insole for all-day comfort.",
    price: 2199, originalPrice: 3099, category: "Footwear", subcategory: "Heels",
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80"],
    rating: 4.5, numReviews: 178, sold: 406, stock: 38, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "High-Top Canvas Sneakers",
    description: "Classic high-top canvas sneakers with vulcanised rubber sole and retro vibe.",
    price: 1299, originalPrice: 1799, category: "Footwear", subcategory: "Sneakers",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80"],
    rating: 4.4, numReviews: 267, sold: 590, stock: 120, discount: "28% OFF", featured: false, isNew: true,
  },
  {
    name: "Waterproof Hiking Boots",
    description: "Gore-Tex waterproof hiking boots with ankle support and deep-lug rubber outsole.",
    price: 4499, originalPrice: 6299, category: "Footwear", subcategory: "Boots",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80"],
    rating: 4.8, numReviews: 193, sold: 440, stock: 28, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "Slip-On Espadrilles",
    description: "Lightweight canvas espadrilles with jute rope sole — the perfect summer essential.",
    price: 899, originalPrice: 1199, category: "Footwear", subcategory: "Sandals",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80"],
    rating: 4.2, numReviews: 112, sold: 260, stock: 75, discount: "25% OFF", featured: false, isNew: false,
  },

  // ════════════════════ ACCESSORIES ════════════════════
  {
    name: "Structured Tote Bag – Tan",
    description: "Full-grain leather structured tote with interior organiser pockets and brass hardware.",
    price: 3499, originalPrice: 4999, category: "Accessories", subcategory: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"],
    rating: 4.7, numReviews: 223, sold: 510, stock: 40, discount: "30% OFF", featured: true, isNew: false,
  },
  {
    name: "Reversible Leather Belt",
    description: "Genuine leather belt, reversible between black and tan. Polished silver buckle.",
    price: 999, originalPrice: 1399, category: "Accessories", subcategory: "Belts",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"],
    rating: 4.4, numReviews: 87, sold: 200, stock: 60, discount: "29% OFF", featured: false, isNew: false,
  },
  {
    name: "Cashmere Plaid Scarf",
    description: "Ultra-soft 100% cashmere plaid scarf in autumnal tones. 190 cm long.",
    price: 2199, originalPrice: 2999, category: "Accessories", subcategory: "Scarves",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"],
    rating: 4.6, numReviews: 141, sold: 310, stock: 50, discount: "27% OFF", featured: false, isNew: false,
  },
  {
    name: "Wide-Brim Sun Hat",
    description: "Packable wide-brim hat in woven raffia with a silk ribbon band.",
    price: 1299, originalPrice: 1799, category: "Accessories", subcategory: "Hats",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80"],
    rating: 4.5, numReviews: 97, sold: 220, stock: 65, discount: "28% OFF", featured: false, isNew: true,
  },
  {
    name: "Canvas Backpack – Olive",
    description: "Durable canvas backpack with 15\" laptop sleeve, multiple compartments, and leather trim.",
    price: 2499, originalPrice: 3499, category: "Accessories", subcategory: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=600&q=80"],
    rating: 4.3, numReviews: 162, sold: 380, stock: 55, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "Crossbody Mini Bag",
    description: "Compact faux-leather crossbody with adjustable strap. Fits phone, cards, and essentials.",
    price: 1199, originalPrice: 1599, category: "Accessories", subcategory: "Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"],
    rating: 4.2, numReviews: 203, sold: 460, stock: 80, discount: "25% OFF", featured: false, isNew: true,
  },
  {
    name: "Merino Wool Beanie",
    description: "Extra-fine merino wool ribbed beanie — warm, soft, and itch-free.",
    price: 699, originalPrice: 999, category: "Accessories", subcategory: "Hats",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80"],
    rating: 4.5, numReviews: 74, sold: 170, stock: 90, discount: "30% OFF", featured: false, isNew: false,
  },

  // ════════════════════ JEWELRY ════════════════════
  {
    name: "Diamond Solitaire Ring",
    description: "0.5 ct brilliant-cut diamond set in 18k white gold. Timeless and elegant.",
    price: 24999, originalPrice: 32999, category: "Jewelry", subcategory: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"],
    rating: 4.9, numReviews: 312, sold: 680, stock: 12, discount: "24% OFF", featured: true, isNew: false,
  },
  {
    name: "Gold Hoop Earrings – 18K",
    description: "Classic 18K gold hoop earrings, 30mm diameter. Lightweight and hypoallergenic.",
    price: 4999, originalPrice: 6999, category: "Jewelry", subcategory: "Earrings",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80"],
    rating: 4.7, numReviews: 195, sold: 420, stock: 30, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "Pearl Strand Necklace",
    description: "Freshwater cultured pearl necklace, 7-8mm, 18\" length with sterling silver clasp.",
    price: 3499, originalPrice: 4999, category: "Jewelry", subcategory: "Necklaces",
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80"],
    rating: 4.6, numReviews: 138, sold: 310, stock: 25, discount: "30% OFF", featured: false, isNew: false,
  },
  {
    name: "Gold Tennis Bracelet",
    description: "Exquisite gold-plated tennis bracelet set with cubic zirconia stones.",
    price: 1999, originalPrice: 2799, category: "Jewelry", subcategory: "Bracelets",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94f1cb9?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1573408301185-9519f94f1cb9?w=600&q=80"],
    rating: 4.5, numReviews: 167, sold: 380, stock: 45, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "Stackable Midi Rings Set",
    description: "Set of 5 dainty stackable rings in sterling silver — geometric, floral, and plain bands.",
    price: 1299, originalPrice: 1799, category: "Jewelry", subcategory: "Rings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"],
    rating: 4.4, numReviews: 214, sold: 480, stock: 70, discount: "28% OFF", featured: false, isNew: true,
  },
  {
    name: "Layered Chain Necklace",
    description: "Three-in-one layered gold-plated chain necklace with star and moon pendants.",
    price: 899, originalPrice: 1299, category: "Jewelry", subcategory: "Necklaces",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80"],
    rating: 4.6, numReviews: 289, sold: 640, stock: 100, discount: "31% OFF", featured: true, isNew: true,
  },
  {
    name: "Crystal Drop Earrings",
    description: "Swarovski crystal drop earrings with rhodium-plated silver hooks.",
    price: 1499, originalPrice: 1999, category: "Jewelry", subcategory: "Earrings",
    image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80"],
    rating: 4.7, numReviews: 123, sold: 270, stock: 55, discount: "25% OFF", featured: false, isNew: false,
  },

  // ════════════════════ OUTERWEAR ════════════════════
  {
    name: "Double-Breasted Blazer",
    description: "Sharp double-breasted blazer in navy pinstripe. Versatile for work and evening looks.",
    price: 4999, originalPrice: 6999, category: "Outerwear", subcategory: "Blazers",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"],
    rating: 4.6, numReviews: 147, sold: 330, stock: 30, discount: "29% OFF", featured: true, isNew: false,
  },
  {
    name: "Classic Trench Coat",
    description: "Water-resistant belted trench coat with storm flap and D-ring detail.",
    price: 6999, originalPrice: 9999, category: "Outerwear", subcategory: "Trench Coats",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80"],
    rating: 4.8, numReviews: 228, sold: 490, stock: 22, discount: "30% OFF", featured: true, isNew: false,
  },
  {
    name: "Neon Windbreaker Jacket",
    description: "Lightweight packable windbreaker in bold neon colourway — water and wind resistant.",
    price: 2999, originalPrice: 3999, category: "Outerwear", subcategory: "Windbreakers",
    image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80"],
    rating: 4.3, numReviews: 96, sold: 215, stock: 50, discount: "25% OFF", featured: false, isNew: true,
  },
  {
    name: "Plaid Wool Blazer",
    description: "Heritage plaid wool blazer in brown tartan. Patch pockets and tortoiseshell buttons.",
    price: 5499, originalPrice: 7499, category: "Outerwear", subcategory: "Blazers",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80"],
    rating: 4.5, numReviews: 81, sold: 185, stock: 18, discount: "27% OFF", featured: false, isNew: false,
  },
  {
    name: "Quilted Puffer Jacket",
    description: "Lightweight 650-fill duck-down puffer jacket in a sleek boxy silhouette.",
    price: 4299, originalPrice: 5999, category: "Outerwear", subcategory: "Windbreakers",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80"],
    rating: 4.7, numReviews: 183, sold: 400, stock: 35, discount: "28% OFF", featured: true, isNew: false,
  },
  {
    name: "Oversized Duster Coat",
    description: "Longline oversized duster coat in sand-coloured crepe — effortlessly minimalist.",
    price: 5299, originalPrice: 7199, category: "Outerwear", subcategory: "Trench Coats",
    image: "https://images.unsplash.com/photo-1562572159-4efd90232dbe?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1562572159-4efd90232dbe?w=600&q=80"],
    rating: 4.4, numReviews: 72, sold: 160, stock: 20, discount: "26% OFF", featured: false, isNew: true,
  },

  // ════════════════════ COSMETICS ════════════════════
  {
    name: "Velvet Matte Lipstick – Rosewood",
    description: "Long-lasting velvet matte formula with hydrating hyaluronic acid. 12-hour wear.",
    price: 799, originalPrice: 999, category: "Cosmetics", subcategory: "Makeup",
    image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2c7c?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1586495777744-4e6232bf2c7c?w=600&q=80"],
    rating: 4.6, numReviews: 374, sold: 840, stock: 200, discount: "20% OFF", featured: true, isNew: false,
  },
  {
    name: "Vitamin C Brightening Serum",
    description: "20% stabilised Vitamin C serum with niacinamide. Fades dark spots in 4 weeks.",
    price: 1299, originalPrice: 1699, category: "Cosmetics", subcategory: "Skincare",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80"],
    rating: 4.8, numReviews: 521, sold: 1200, stock: 180, discount: "24% OFF", featured: true, isNew: false,
  },
  {
    name: "Argan Oil Hair Mask",
    description: "Deep-conditioning mask with Moroccan argan oil. Restores shine and reduces frizz.",
    price: 899, originalPrice: 1199, category: "Cosmetics", subcategory: "Hair Care",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80"],
    rating: 4.5, numReviews: 218, sold: 500, stock: 120, discount: "25% OFF", featured: false, isNew: false,
  },
  {
    name: "Pro Eyeshadow Palette – Warm Nudes",
    description: "18-shade warm nude palette with a mix of matte, shimmer, and glitter finishes.",
    price: 1599, originalPrice: 2199, category: "Cosmetics", subcategory: "Makeup",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80"],
    rating: 4.7, numReviews: 287, sold: 650, stock: 95, discount: "27% OFF", featured: true, isNew: false,
  },
  {
    name: "Hyaluronic Acid Moisturiser",
    description: "Lightweight gel-cream moisturiser with triple-weight hyaluronic acid. Plumps and hydrates.",
    price: 999, originalPrice: 1399, category: "Cosmetics", subcategory: "Skincare",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=600&q=80"],
    rating: 4.8, numReviews: 413, sold: 950, stock: 160, discount: "29% OFF", featured: true, isNew: true,
  },
  {
    name: "Keratin Smoothing Shampoo",
    description: "Sulphate-free shampoo infused with keratin proteins to smooth and strengthen hair.",
    price: 699, originalPrice: 899, category: "Cosmetics", subcategory: "Hair Care",
    image: "https://images.unsplash.com/photo-1585232351009-aa51a5b8f2ac?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1585232351009-aa51a5b8f2ac?w=600&q=80"],
    rating: 4.4, numReviews: 176, sold: 400, stock: 140, discount: "22% OFF", featured: false, isNew: false,
  },
  {
    name: "Waterproof Mascara – Black",
    description: "Volumising and lengthening waterproof mascara with a clump-free brush.",
    price: 649, originalPrice: 899, category: "Cosmetics", subcategory: "Makeup",
    image: "https://images.unsplash.com/photo-1631214499778-b2ce00b5b5c4?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1631214499778-b2ce00b5b5c4?w=600&q=80"],
    rating: 4.5, numReviews: 335, sold: 780, stock: 210, discount: "28% OFF", featured: false, isNew: true,
  },
  {
    name: "Retinol Night Cream",
    description: "0.3% encapsulated retinol night cream for visible anti-ageing results within 4 weeks.",
    price: 1799, originalPrice: 2499, category: "Cosmetics", subcategory: "Skincare",
    image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&q=80"],
    rating: 4.7, numReviews: 192, sold: 440, stock: 75, discount: "28% OFF", featured: true, isNew: false,
  },
];

// ── Try direct mongoose connection first ──────────────────────────
async function seedDirect() {
  console.log('🔌 Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('✅ Connected!');

  const before = await Product.countDocuments();
  console.log(`ℹ️  Products before seed: ${before}`);

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

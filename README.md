<<<<<<< HEAD
# 🛒 MegaMart — Full-Stack Grocery & E-Commerce Platform

<p align="center">
  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80" alt="MegaMart Banner" width="100%" style="border-radius: 12px; max-height: 380px; object-fit: cover;" />
</p>

<p align="center">
  <strong>A modern, production-ready Full-Stack MERN E-Commerce & Grocery platform featuring an interactive customer storefront, an isolated administrative control center, intelligent Amazon-style tokenized search, and real-time MongoDB Atlas integration.</strong>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-Complete-brightgreen?style=for-the-badge" alt="Features" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge" alt="Tech Stack" /></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-Monorepo-orange?style=for-the-badge" alt="Architecture" /></a>
  <a href="https://grocerybackend-xwkk.onrender.com"><img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" /></a>
  <a href="#-license"><img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License" /></a>
</p>

---

## 📑 Table of Contents

- [🌟 Highlights](#-highlights)
- [🏗️ System Architecture](#️-system-architecture)
- [📁 Monorepo Directory Structure](#-monorepo-directory-structure)
- [⚡ Tech Stack](#-tech-stack)
- [✨ Key Features](#-key-features)
  - [🛒 Customer Storefront (React 18)](#-customer-storefront-react-18)
  - [🛡️ Standalone Admin Control Center](#️-standalone-admin-control-center)
  - [🔍 Intelligent Search & Relevance Engine](#-intelligent-search--relevance-engine)
  - [💳 Cart, Wishlist, & Checkout Flow](#-cart-wishlist--checkout-flow)
- [🔌 RESTful API Reference](#-restful-api-reference)
- [📦 Environment Variables & Configuration](#-environment-variables--configuration)
- [🚀 Quickstart & Installation](#-quickstart--installation)
  - [Option A: Running via Monorepo Root (Recommended)](#option-a-running-via-monorepo-root-recommended)
  - [Option B: Running Individual Services](#option-b-running-individual-services)
- [🔑 Default Credentials](#-default-credentials)
- [🌱 Database Seeding](#-database-seeding)
- [☁️ Cloud Deployment (Render)](#️-cloud-deployment-render)
- [🤝 Contributing & Support](#-contributing--support)
- [📄 License](#-license)

---

## 🌟 Highlights

- **Full MERN Stack**: Built with React 18, Node.js, Express.js, and MongoDB Atlas.
- **Architectural Separation**: The customer store (`localhost:3000`) and the admin management panel (`localhost:3001`) are completely decoupled for security and performance.
- **Amazon-Grade Search**: Multi-token regex search with automated relevance scoring, category weighting, and live autocomplete suggestions.
- **Dynamic Theming & Localization**: Native Dark/Light mode switching with persistent state, plus multi-language context support.
- **Secure Authentication**: JSON Web Token (JWT) stateless auth with password encryption using `bcryptjs`.
- **Database Seeding Utility**: Pre-packaged catalog with realistic grocery and apparel products ready out-of-the-box.
- **Render Ready**: Single-click monorepo deployment with configured `render.yaml`.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   MegaMart Ecosystem                   │
└────────────────────────────────────────────────────────┘
          │                                  │
          ▼                                  ▼
┌──────────────────┐               ┌──────────────────┐
│  Customer Web    │               │  Admin Panel     │
│  (Port 3000)     │               │  (Port 3001)     │
│  React 18 SPA    │               │  Dedicated Portal│
└─────────┬────────┘               └─────────┬────────┘
          │                                  │
          │         REST API (HTTP/JSON)     │
          └─────────────────┬────────────────┘
                            ▼
               ┌────────────────────────┐
               │    Express / Node.js   │
               │      (Port 5000)       │
               │  JWT Auth & Controllers│
               └────────────┬───────────┘
                            ▼
               ┌────────────────────────┐
               │     MongoDB Atlas      │
               │  Mongoose ODM Schemas  │
               └────────────────────────┘
```

---

## 📁 Monorepo Directory Structure

```text
grocery.store/
├── package.json                    # Root monorepo workspace orchestration
├── render.yaml                     # Render infrastructure-as-code deployment blueprint
├── playground-1.mongodb.js         # MongoDB playground query scratchpad
└── ecommerce-project/
    ├── README.md                   # Project documentation
    │
    ├── frontend/                   # Client-Facing React 18 Application
    │   ├── public/                 # Static assets & index.html
    │   ├── src/
    │   │   ├── api/                # Axios API instances & service calls
    │   │   ├── components/         # Modular UI components
    │   │   │   ├── Home/           # HeroBanner, BestSellers, DealOfTheDay, NavigationBar, etc.
    │   │   │   ├── Chatbot/        # Customer support AI assistant widget
    │   │   │   └── Payment/        # Stripe & Card checkout payment forms
    │   │   ├── context/            # React Context (Cart, Wishlist, Language)
    │   │   ├── pages/              # Route views (Home, Products, Details, Cart, Checkout, etc.)
    │   │   ├── styles/             # Component and layout stylesheets
    │   │   ├── App.js              # Application routing & ProtectedRoute wrappers
    │   │   └── index.js            # React DOM mounting
    │   └── package.json
    │
    ├── backend/                    # Core REST API Server
    │   ├── config/                 # DB connection (Mongoose to Atlas)
    │   ├── controllers/            # Request handlers (User, Product, Order, etc.)
    │   ├── middleware/             # JWT auth validation & error handlers
    │   ├── models/                 # Mongoose schemas (User, Product, Order)
    │   ├── routes/                 # Express routers (/api/products, /api/users, etc.)
    │   ├── services/               # Specialized services (Payment, OrderTracking, Chatbot)
    │   ├── utils/                  # Database seeders (seedProducts.js)
    │   ├── server.js               # Express application entry point
    │   ├── .env                    # Environment credentials
    │   └── package.json
    │
    └── admin/                      # Isolated Administrative Dashboard
        ├── css/                    # Admin styling & dashboard theme
        ├── js/                     # Admin state logic & API client
        ├── index.html              # Single page administrative interface
        ├── server.js               # Native Node.js web server (Port 3001)
        └── package.json
```

---

## ⚡ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Axios, Context API, CSS3 Modules, Flexbox/Grid |
| **Admin Portal** | HTML5, Vanilla JavaScript (ES6+), Modern Glassmorphic CSS, Node.js HTTP |
| **Backend API** | Node.js, Express.js, RESTful Architecture, JWT (`jsonwebtoken`), `bcryptjs` |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Payments** | Stripe API (`stripe`), Cash on Delivery (COD) simulation |
| **DevOps & Cloud** | Render Cloud Platform (`render.yaml`), Git, npm workspaces |

---

## ✨ Key Features

### 🛒 Customer Storefront (React 18)
- **Interactive Homepage**:
  - **Hero Slider**: Eye-catching promotional carousel with direct call-to-actions.
  - **Category Stories**: Instagram-style circular category highlights for fast mobile-friendly browsing.
  - **Deal of the Day**: Live dynamic countdown timer for limited-time flash discounts.
  - **Trending Grid & Best Sellers**: Real-time showcase of popular products with rating stars and sold counters.
  - **Customer Testimonials & Services**: Highlights guarantees, express delivery, and 24/7 support.
- **Theme & Language Switching**:
  - Seamless toggle between **Light Mode** and **Dark Mode** with CSS variable synchronization.
  - Global `LanguageContext` supporting multi-lingual UI strings.
- **Product Details & Reviews**:
  - High-resolution product image gallery, stock availability badges, discount pricing breakdown, and related products recommendations.
- **Customer Support Chatbot**:
  - Floating interactive chat assistant to resolve customer FAQs, order tracking queries, and provide quick navigation links.

### 🛡️ Standalone Admin Control Center
- **Zero Frontend Contamination**: Located at `ecommerce-project/admin` and hosted on port `3001`. Completely separated from customer views.
- **Real-Time Warehouse Metrics**:
  - Total catalog items, total warehouse stock units, distinct categories, low stock alerts (&le; 10 units), and out-of-stock counters.
- **Complete Inventory Management (CRUD)**:
  - **Add Product**: Modal with live image preview, multi-keyword tags, price/discount calculation, and brand classification.
  - **Edit Product**: Instantly pre-populate and update pricing, stock counts, and descriptions.
  - **Delete Product**: Safety confirmation modal displaying the target item name before permanent removal.
- **Color-Coded Inventory Badges**:
  - 🟢 **In Stock** | 🟡 **Low Stock (&le; 10 units)** | 🔴 **Out of Stock (0 units)**.

### 🔍 Intelligent Search & Relevance Engine
- **Multi-Token Regex Parser**: Splits multi-word search queries into search tokens and safely queries across name, brand, category, subcategory, keywords, and description.
- **Relevance Scoring Algorithm**:
  - `+100` for exact title matches
  - `+40` for prefix name matches
  - `+25` for keyword tag hits
  - `+15` for brand & category matches
- **Live Autocomplete Suggestions**: `/api/products/search/suggestions?q=...` returns instant suggestions as the user types.

### 💳 Cart, Wishlist, & Checkout Flow
- **Persistent Wishlist**: One-click heart toggle synced with the user's MongoDB profile via `/api/wishlist/toggle`.
- **Cart Management**: Real-time item additions, quantity increment/decrement, and subtotal calculation with automatic discount application.
- **Protected Multi-Step Checkout**: Form validation for shipping address, delivery selection, and payment options (Stripe Card Checkout & Cash on Delivery).
- **Order Tracking**: Visual status timeline tracking orders from *Pending* ➔ *Processing* ➔ *Shipped* ➔ *Delivered*.

---

## 🔌 RESTful API Reference

### 🔐 Authentication & Users (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new user account | Public |
| `POST` | `/api/users/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/users/profile` | Retrieve profile of authenticated user | Private (Bearer Token) |
| `GET` | `/api/users/wishlist` | Fetch populated wishlist items for user | Private (Bearer Token) |
| `POST` | `/api/users/wishlist/toggle` | Add/remove a product ID to/from wishlist | Private (Bearer Token) |

### 📦 Products (`/api/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get products with search, category, sort, & pagination | Public |
| `GET` | `/api/products/search/suggestions`| Autocomplete suggestions query (`?q=`) | Public |
| `GET` | `/api/products/categories/list` | Retrieve list of unique product categories | Public |
| `GET` | `/api/products/category/:categoryName` | Retrieve products belonging to a category | Public |
| `GET` | `/api/products/:id` | Get single product details by ID | Public |
| `POST` | `/api/products` | Create a new product | Admin / API |
| `PUT` | `/api/products/:id` | Update an existing product | Admin / API |
| `DELETE`| `/api/products/:id` | Delete a product from inventory | Admin / API |

### 📑 Orders & Tracking (`/api/orders` & `/api/tracking`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place a new order with items & shipping address | Authenticated |
| `GET` | `/api/orders/my` | Retrieve all orders placed by the user | Authenticated |
| `GET` | `/api/orders/:id` | Retrieve single order details | Authenticated |
| `PUT` | `/api/orders/:id/status` | Update fulfillment status (`pending`, `shipped`, etc.)| Admin |
| `GET` | `/api/tracking/:orderId` | Live tracking status and milestone history | Authenticated |

---

## 📦 Environment Variables & Configuration

Create or update the `.env` file in `ecommerce-project/backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MongoDB Atlas Connection URI)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xweeflw.mongodb.net/ecommerce?retryWrites=true&w=majority

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PAYMENT_SUCCESS_URL=http://localhost:3000/payment-success
PAYMENT_CANCEL_URL=http://localhost:3000/payment-cancel
```

For the frontend client, if targeting a remote backend, configure `ecommerce-project/frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x, v18.x, or v20.x recommended)
- [npm](https://www.npmjs.com/) (v8+)
- Active [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance

---

### Option A: Running via Monorepo Root (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kaundalanshul/grocery.store.git
   cd grocery.store
   ```

2. **Install all dependencies & start Backend**:
   ```bash
   npm run build:backend
   npm run start:backend
   ```

3. **In a second terminal, start the Frontend**:
   ```bash
   npm run build:frontend
   npm run start:frontend
   ```

4. **In a third terminal, start the Admin Panel**:
   ```bash
   npm run start:admin
   ```

---

### Option B: Running Individual Services

#### 1. Start the Backend API
```bash
cd ecommerce-project/backend
npm install
npm run dev
```
👉 *API running on: `http://localhost:5000`*

#### 2. Start the Frontend Storefront
```bash
cd ecommerce-project/frontend
npm install
npm start
```
👉 *Storefront accessible at: `http://localhost:3000`*

#### 3. Start the Admin Dashboard
```bash
cd ecommerce-project/admin
npm start
```
👉 *Admin panel accessible at: `http://localhost:3001`*

---

## 🔑 Default Credentials

For rapid testing and evaluation, use the following pre-configured credentials:

| Role | Portal URL | Email | Password |
| :--- | :--- | :--- | :--- |
| **Administrator** | `http://localhost:3001` | `admin@megamart.com` | `Admin@123` |
| **Demo Customer** | `http://localhost:3000/login` | *Create account via `/register` or use your existing login* | *Your secure password* |

---

## 🌱 Database Seeding

To populate your MongoDB database with sample categories, apparel, groceries, and featured deals:

```bash
cd ecommerce-project/backend
npm run seed
```

This runs `utils/seedProducts.js`, verifying your connection to MongoDB Atlas and inserting a rich initial product catalog.

---

## ☁️ Cloud Deployment (Render)

This repository includes a native `render.yaml` blueprint ready for zero-downtime deployment on [Render](https://render.com):

1. Link your GitHub repository to your Render account.
2. Create a new **Blueprint** and select the repository.
3. Render will automatically configure both services according to `render.yaml`:
   - **Backend API Service**: Web Service building `ecommerce-project/backend` with automatic port binding.
   - **Frontend Static Service**: Web Service building and serving `ecommerce-project/frontend`.
4. Supply your secret `MONGODB_URI`, `JWT_SECRET`, and `STRIPE_SECRET_KEY` in the Render dashboard environment settings.

---

## 🤝 Contributing & Support

Contributions, feature requests, and bug reports are welcome!

1. **Fork** the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ for modern grocery and e-commerce shopping experiences.
</p>
=======
# Ansh Portfolio

A full-stack portfolio website split into **three independent applications**.

## Project Structure

```
├── backend/       → REST API server (Express + MongoDB)   → port 5000
├── frontend/      → Portfolio website (static HTML/CSS/JS) → port 3000
├── admin/         → Admin dashboard (static HTML/CSS/JS)   → port 3001
```

Each part is **completely independent** — it has its own `package.json`, `node_modules`, and can be developed, deployed, and scaled separately.

---

## Quick Start

### 1. Backend (start first)

```bash
cd backend
npm install
npm run dev
```

API will be available at `http://localhost:5000/api`

**Default admin credentials** (see `backend/.env`):
- Email: `admin@anshportfolio.com`
- Password: `Admin@123`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Portfolio site at `http://localhost:3000`

### 3. Admin Dashboard

```bash
cd admin
npm install
npm start
```

Admin panel at `http://localhost:3001`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/projects` | List projects | No |
| POST | `/api/projects` | Create project | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |
| GET | `/api/skills` | List skills | No |
| POST | `/api/skills` | Create skill | Yes |
| PUT | `/api/skills/:id` | Update skill | Yes |
| DELETE | `/api/skills/:id` | Delete skill | Yes |
| POST | `/api/messages` | Submit contact message | No |
| GET | `/api/messages` | List messages | Yes |
| PATCH | `/api/messages/:id/read` | Toggle read status | Yes |
| DELETE | `/api/messages/:id` | Delete message | Yes |
| GET | `/api/interests` | List interest categories with items | No |
| GET | `/api/interests/:id` | Get single interest category | No |
| POST | `/api/interests` | Create interest category | Yes |
| PUT | `/api/interests/:id` | Update interest category | Yes |
| DELETE | `/api/interests/:id` | Delete interest category | Yes |
| POST | `/api/interests/:id/items` | Add item to category | Yes |
| PUT | `/api/interests/:id/items/:itemId` | Update item | Yes |
| DELETE | `/api/interests/:id/items/:itemId` | Delete item | Yes |
| GET | `/api/health` | Health check | No |

---

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (with in-memory fallback), JWT auth
- **Frontend**: HTML, CSS, JavaScript, Three.js (3D)
- **Admin**: HTML, CSS, JavaScript
>>>>>>> 46e2e9a73ecafe40930bf8dca61873bfb3c08660

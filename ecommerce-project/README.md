# Ecommerce Project - Complete Setup Guide

## 📋 Project Overview

A full-stack ecommerce platform built with modern web technologies featuring:
- **Frontend**: React-based responsive UI
- **Backend**: Node.js/Express API
- **Database**: MongoDB integration
- **Features**: Product recommendations, secure payments, admin dashboard, order tracking, customer chatbot

## 🏗️ Project Structure

```
ecommerce-project/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home/           # Home page components
│   │   │   ├── Chatbot/        # Chat support
│   │   │   ├── Payment/        # Payment components
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Admin/          # Admin dashboard
│   │   │   └── ...
│   │   ├── styles/
│   │   ├── App.js
│   │   └── App.css
│   └── COMPONENT_GUIDE.md
│
├── backend/
│   ├── controllers/            # Request handlers
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── adminController.js
│   │   ├── chatbotController.js
│   │   └── recommendationController.js
│   │
│   ├── models/                 # Database schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   │
│   ├── routes/                 # API endpoints
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── trackingRoutes.js
│   │
│   ├── services/               # Business logic
│   │   ├── recommendationService.js
│   │   ├── paymentService.js
│   │   ├── chatbotService.js
│   │   └── orderTrackingService.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   └── server.js
│
└── database/                   # Database files
```

## ⚙️ Technology Stack

### Frontend
- **React** 18.x
- **CSS3** (Grid, Flexbox, Animations)
- **JavaScript (ES6+)**
- **Optional**: React Router, Redux, Axios

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT** for authentication
- **Stripe** (or similar for payments)

### Additional Services
- Payment Gateway (Stripe, PayPal, Razorpay)
- Email Service (SendGrid, Nodemailer)
- SMS (Twilio)
- AI/Chatbot (OpenAI, Microsoft Bot Framework)

## 🚀 Getting Started

### Frontend Setup

#### 1. Create React App (if not already done)
```bash
cd frontend
npx create-react-app . --template cra-template
```

#### 2. Install Dependencies
```bash
npm install
# Optional packages for routing and state management
npm install react-router-dom axios redux react-redux
```

#### 3. Run Development Server
```bash
npm start
```
Server runs on: `http://localhost:3000`

### Backend Setup

#### 1. Initialize Node Project
```bash
cd backend
npm init -y
```

#### 2. Install Dependencies
```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

#### 3. Create .env File
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_key
PAYMENT_SUCCESS_URL=http://localhost:3000/payment-success
PAYMENT_CANCEL_URL=http://localhost:3000/payment-cancel
```

#### 4. Update package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 5. Run Development Server
```bash
npm run dev
```
API runs on: `http://localhost:5000`

## 📱 Frontend Features

### Home Page
- **Hero Banner**: Featured products with CTA
- **Category Sidebar**: Navigation with subcategories
- **Best Sellers**: Top products showcase
- **Deal of the Day**: Time-limited offer with countdown
- **New Products**: Latest additions grid
- **Services Section**: Highlights key benefits
- **Testimonials**: Customer reviews
- **Footer**: Links and information

### Pages
- **Home** (`pages/Home.js`)
- **Product Details** (`pages/ProductDetails.js`)
- **Cart** (`pages/Cart.js`)
- **Checkout** (`pages/Checkout.js`)
- **Login** (`pages/Login.js`)
- **Payment** (`pages/Payment.js`)
- **Order Tracking** (`pages/OrderTracking.js`)

### Admin Dashboard
- `Admin/Dashboard.js` - Overview & metrics
- `Admin/Users.js` - User management
- `Admin/Orders.js` - Order management
- `Admin/Products.js` - Product management
- `Admin/Analytics.js` - Sales analytics

### Special Components
- **Chatbot**: Customer support widget
- **Payment**: Secure payment processing
- **Recommendations**: AI-powered suggestions
- **Order Tracking**: Real-time order status

## 🔌 API Endpoints

### Users
```
POST   /api/users/register          # User registration
POST   /api/users/login             # User login
GET    /api/users/:id               # Get user profile
PUT    /api/users/:id               # Update profile
```

### Products
```
GET    /api/products                # Get all products
GET    /api/products/:id            # Get product details
POST   /api/products                # Create product (admin)
PUT    /api/products/:id            # Update product (admin)
DELETE /api/products/:id            # Delete product (admin)
```

### Orders
```
GET    /api/orders                  # Get user orders
GET    /api/orders/:id              # Get order details
POST   /api/orders                  # Create order
PUT    /api/orders/:id              # Update order
```

### Payments
```
POST   /api/payments/process        # Process payment
POST   /api/payments/webhook        # Payment webhook
GET    /api/payments/:id            # Get payment details
```

### Admin
```
GET    /api/admin/dashboard         # Dashboard metrics
GET    /api/admin/analytics         # Sales analytics
GET    /api/admin/reports           # Business reports
```

### Chatbot
```
POST   /api/chatbot/message         # Send message
GET    /api/chatbot/history         # Get chat history
```

### Recommendations
```
GET    /api/recommendations         # Get recommendations
GET    /api/recommendations/:userId # Get user recommendations
```

### Order Tracking
```
GET    /api/tracking/:orderId       # Track order
GET    /api/tracking/user/:userId   # Get user orders
```

## 🔐 Authentication

### JWT Implementation
```javascript
// In authMiddleware.js
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Protected Routes
```javascript
router.get('/profile', verifyToken, (req, res) => {
  // Only authenticated users can access
});
```

## 💳 Payment Integration

### Stripe Integration Example
```javascript
// In paymentService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function processPayment(amount, token) {
  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: 'usd',
    source: token,
    description: 'Ecommerce Purchase'
  });
  return charge;
}
```

## 🤖 Features Implementation

### 1. Product Recommendations
- Analyze user browsing history
- Calculate similarity scores
- Suggest complementary products
- Machine learning for personalization

### 2. Secure Payments
- PCI-DSS compliant
- Encrypted transactions
- Multiple payment gateways
- Fraud detection

### 3. Admin Dashboard
- Real-time sales metrics
- User management
- Order management
- Product inventory control
- Revenue analytics

### 4. Order Tracking
- Real-time status updates
- Delivery timeline
- Shipping notifications
- Customer support access

### 5. Chatbot
- FAQ automation
- Order status queries
- Product recommendations
- Human handoff support

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy
```

### Backend (Heroku/Railway)
```bash
# Push to Heroku
git push heroku main
```

## 🧪 Testing

### Frontend Testing
```bash
npm test
npm run build
```

### Backend Testing
```bash
npm test
```

## 📊 Database Schema Examples

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discount: Number,
  category: String,
  image: String,
  rating: Number,
  reviews: Array,
  stock: Number,
  createdAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  products: Array,
  total: Number,
  status: String (pending/processing/shipped/delivered),
  shippingAddress: String,
  paymentStatus: String,
  createdAt: Date,
  deliveryDate: Date
}
```

## 🛠️ Development Tips

1. **Use Environment Variables**: Keep sensitive data in `.env`
2. **Error Handling**: Implement proper error handling in all routes
3. **Validation**: Validate all inputs on backend and frontend
4. **Logging**: Use logging for debugging
5. **Code Structure**: Maintain MVC pattern
6. **Comments**: Document complex logic
7. **Testing**: Write unit and integration tests

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Stripe API](https://stripe.com/docs/api)
- [JWT Authentication](https://jwt.io)

## 🐛 Troubleshooting

### CORS Issues
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Database Connection
```javascript
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.log('DB error:', err));
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review component guide
3. Check backend API docs
4. Debug using browser DevTools
5. Check console for errors

## 📄 License

This project is open source and available under the MIT License.

---

**Last Updated**: March 2026
**Version**: 1.0.0
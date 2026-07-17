const bcrypt = require('bcryptjs');

let mockUsers = [
  {
    _id: 'mock-user-1',
    name: 'Test User',
    email: 'test@example.com',
    password: bcrypt.hashSync('password123', 10),
    wishlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let mockProducts = [
  {
    _id: 'mock-product-1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    price: 99.99,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wireless%20headphones%20product%20photo&image_size=square',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'mock-product-2',
    name: 'Smart Watch',
    description: 'Feature-rich smart watch with health tracking',
    price: 199.99,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=smart%20watch%20product%20photo&image_size=square',
    category: 'Electronics',
    stock: 30,
    rating: 4.8,
    reviews: 85,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'mock-product-3',
    name: 'Laptop Backpack',
    description: 'Durable laptop backpack with multiple compartments',
    price: 49.99,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=laptop%20backpack%20product%20photo&image_size=square',
    category: 'Accessories',
    stock: 100,
    rating: 4.2,
    reviews: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let mockOrders = [];

const mockData = {
  users: mockUsers,
  products: mockProducts,
  orders: mockOrders,
  
  findUserByEmail: (email) => {
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  
  findUserById: (id) => {
    return mockUsers.find(u => u._id === id);
  },
  
  addUser: (user) => {
    const newUser = {
      _id: `mock-user-${mockUsers.length + 1}`,
      ...user,
      wishlist: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  },
  
  findAllProducts: () => {
    return mockProducts;
  },
  
  findProductById: (id) => {
    return mockProducts.find(p => p._id === id);
  },
  
  findProductsByCategory: (category) => {
    return mockProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },
  
  addOrder: (order) => {
    const newOrder = {
      _id: `mock-order-${mockOrders.length + 1}`,
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockOrders.push(newOrder);
    return newOrder;
  },
  
  findOrdersByUser: (userId) => {
    return mockOrders.filter(o => o.userId === userId);
  },
};

module.exports = mockData;

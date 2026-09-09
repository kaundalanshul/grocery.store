/**
 * MegaMart Admin API Client
 * Connects directly to existing backend server and MongoDB database
 */

const API_BASE = 'http://localhost:5000/api';

const AdminAPI = {
  // Token management
  getToken() {
    return localStorage.getItem('megamart_admin_token') || '';
  },

  setToken(token) {
    localStorage.setItem('megamart_admin_token', token);
  },

  getAdminUser() {
    try {
      return JSON.parse(localStorage.getItem('megamart_admin_user') || '{}');
    } catch {
      return {};
    }
  },

  setAdminUser(user) {
    localStorage.setItem('megamart_admin_user', JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem('megamart_admin_token');
    localStorage.removeItem('megamart_admin_user');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  // Helper for requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`[AdminAPI Error] ${endpoint}:`, error);
      throw error;
    }
  },

  // 1. Admin Login
  async login(email, password) {
    // Connects to existing /api/users/login
    const data = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.setToken(data.token);
      this.setAdminUser(data.user || { email, name: 'Administrator' });
    }
    return data;
  },

  // 2. Fetch all products (with search, category, pagination)
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, { method: 'GET' });
  },

  // 3. Fetch single product by ID
  async getProductById(id) {
    return this.request(`/products/${id}`, { method: 'GET' });
  },

  // 4. Create new product
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // 5. Update existing product
  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // 6. Delete product
  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // 7. Get category list
  async getCategories() {
    try {
      const data = await this.request('/products/categories/list', { method: 'GET' });
      return data.categories || [];
    } catch {
      return [];
    }
  },
};

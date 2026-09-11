const Product = require('../models/Product');

// Helper to escape regex special characters safely
const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper to build Amazon-style tokenized search query across product attributes
const buildSearchQuery = (search) => {
  const trimmed = (search || '').trim();
  if (!trimmed) return {};

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return {};

  if (tokens.length === 1) {
    const reg = new RegExp(escapeRegex(tokens[0]), 'i');
    return {
      $or: [
        { name: reg },
        { brand: reg },
        { category: reg },
        { subcategory: reg },
        { keywords: reg },
        { description: reg },
      ],
    };
  }

  // Multi-term query: all terms must match across the product's attributes
  return {
    $and: tokens.map((token) => {
      const reg = new RegExp(escapeRegex(token), 'i');
      return {
        $or: [
          { name: reg },
          { brand: reg },
          { category: reg },
          { subcategory: reg },
          { keywords: reg },
          { description: reg },
        ],
      };
    }),
  };
};

// Compute relevance score for Amazon-like ranking
const computeRelevance = (product, rawQuery, tokens) => {
  let score = 0;
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const subcategory = (product.subcategory || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const keywords = Array.isArray(product.keywords)
    ? product.keywords.map((k) => (k || '').toLowerCase())
    : [];
  const q = rawQuery.toLowerCase();

  // 1. Exact phrase match in name (highest)
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 60;
  else if (name.includes(q)) score += 40;

  // 2. Exact match in brand
  if (brand === q) score += 50;
  else if (brand.includes(q)) score += 30;

  // 3. Category / Subcategory
  if (category === q) score += 45;
  else if (category.includes(q)) score += 25;
  if (subcategory.includes(q)) score += 20;

  // 4. Keywords
  if (keywords.includes(q)) score += 35;
  keywords.forEach((k) => {
    if (k.includes(q)) score += 15;
  });

  // 5. Individual tokens
  tokens.forEach((t) => {
    const term = t.toLowerCase();
    if (name.includes(term)) score += 15;
    if (brand.includes(term)) score += 10;
    if (category.includes(term)) score += 8;
    if (subcategory.includes(term)) score += 6;
    if (keywords.some((k) => k.includes(term))) score += 8;
    if (description.includes(term)) score += 3;
  });

  // Subtle tie-breakers: rating and popularity
  score += (product.rating || 0) * 0.5;
  score += Math.min((product.sold || 0) / 100, 5);

  return score;
};

// GET /api/products  — all products + optional search + optional category filter
const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 500 } = req.query;
    let query = {};

    const trimmedSearch = (search || '').trim();
    if (trimmedSearch) {
      query = buildSearchQuery(trimmedSearch);
    }

    if (category) {
      query.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
    }

    let sortOption = null;
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { sold: -1 };
    else if (!trimmedSearch) sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    let products;
    if (sortOption) {
      products = await Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));
    } else {
      // Amazon-style relevance sorting when search is active without explicit sort
      const tokens = trimmedSearch.split(/\s+/).filter(Boolean);
      const allMatches = await Product.find(query);
      const scored = allMatches.map((prod) => ({
        prod,
        score: computeRelevance(prod, trimmedSearch, tokens),
      }));
      scored.sort((a, b) => b.score - a.score);
      products = scored.slice(skip, skip + Number(limit)).map((item) => item.prod);
    }

    return res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

// GET /api/products/search/suggestions?q=...
const getSearchSuggestions = async (req, res) => {
  try {
    const rawQuery = (req.query.q || '').trim();

    if (!rawQuery) {
      // Default trending searches / popular suggestions
      const popularProducts = await Product.find({ featured: true })
        .limit(4)
        .select('_id name price originalPrice discount image category brand rating');
      const categories = await Product.distinct('category');

      return res.status(200).json({
        success: true,
        query: '',
        suggestions: [
          { text: 'Cotton T-Shirt', type: 'query' },
          { text: 'Denim Jacket', type: 'query' },
          { text: 'Running Sneakers', type: 'query' },
          { text: 'Leather Boots', type: 'query' },
          { text: 'Basmati Rice', type: 'query' },
        ],
        products: popularProducts,
        categories: categories.slice(0, 5),
      });
    }

    const searchQuery = buildSearchQuery(rawQuery);
    const tokens = rawQuery.split(/\s+/).filter(Boolean);

    // Fetch matching products (up to 20 for scoring & extracting suggestions)
    const matching = await Product.find(searchQuery)
      .select('_id name price originalPrice discount image category subcategory brand rating sold keywords')
      .limit(20);

    const scored = matching.map((prod) => ({
      prod,
      score: computeRelevance(prod, rawQuery, tokens),
    }));
    scored.sort((a, b) => b.score - a.score);

    // Top 4 preview products
    const topProducts = scored.slice(0, 4).map((item) => item.prod);

    // Generate relevant keyword and department suggestions
    const suggestionMap = new Map();
    const categoriesSet = new Set();

    scored.forEach(({ prod }) => {
      if (prod.category) categoriesSet.add(prod.category);
      if (prod.name) {
        suggestionMap.set(prod.name.toLowerCase(), prod.name);
      }
      if (prod.brand && prod.brand.toLowerCase().includes(rawQuery.toLowerCase())) {
        suggestionMap.set(prod.brand.toLowerCase(), prod.brand);
      }
      if (Array.isArray(prod.keywords)) {
        prod.keywords.forEach((k) => {
          if (k && k.toLowerCase().includes(rawQuery.toLowerCase())) {
            suggestionMap.set(k.toLowerCase(), k);
          }
        });
      }
    });

    // Format suggestions
    const formattedSuggestions = [];
    const directSuggestions = Array.from(suggestionMap.values()).slice(0, 5);

    directSuggestions.forEach((text) => {
      formattedSuggestions.push({
        text,
        type: 'query',
      });
    });

    // Add category scope suggestions (e.g. "cotton in Men's")
    const matchedCategories = Array.from(categoriesSet).slice(0, 3);
    matchedCategories.forEach((cat) => {
      formattedSuggestions.push({
        text: `${rawQuery} in ${cat}`,
        category: cat,
        type: 'category_scope',
      });
    });

    return res.status(200).json({
      success: true,
      query: rawQuery,
      suggestions: formattedSuggestions,
      products: topProducts,
      categories: matchedCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch search suggestions',
      error: error.message,
    });
  }
};

// GET /api/products/category/:categoryName
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { sort, page = 1, limit = 100 } = req.query;

    const query = { category: { $regex: `^${categoryName}$`, $options: 'i' } };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popular') sortOption = { sold: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      category: categoryName,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch category products', error: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
  }
};

// GET /api/products/categories/list
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

// POST /api/products  (admin: create product)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getSearchSuggestions,
  getProductsByCategory,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
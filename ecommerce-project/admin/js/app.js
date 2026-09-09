/**
 * MegaMart Admin Panel - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    products: [],
    categories: [],
    currentPage: 1,
    pageSize: 15,
    totalPages: 1,
    totalCount: 0,
    searchQuery: '',
    categoryFilter: '',
    stockFilter: 'all', // all | in_stock | low_stock | out_of_stock
    isLoading: false,
    editingProduct: null,
    deletingProduct: null,
  };

  // DOM Elements - Auth
  const authScreen = document.getElementById('authScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const loginForm = document.getElementById('adminLoginForm');
  const loginEmail = document.getElementById('adminEmail');
  const loginPassword = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const loginBtn = document.getElementById('adminLoginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminNameDisplay = document.getElementById('adminNameDisplay');
  const adminEmailDisplay = document.getElementById('adminEmailDisplay');

  // DOM Elements - Metrics
  const metricTotalProducts = document.getElementById('metricTotalProducts');
  const metricTotalStock = document.getElementById('metricTotalStock');
  const metricLowStock = document.getElementById('metricLowStock');
  const metricOutOfStock = document.getElementById('metricOutOfStock');
  const metricCategories = document.getElementById('metricCategories');

  // DOM Elements - Filters & Table
  const searchInput = document.getElementById('tableSearchInput');
  const categoryFilterSelect = document.getElementById('categoryFilterSelect');
  const filterPills = document.querySelectorAll('.filter-pill');
  const productsTableBody = document.getElementById('productsTableBody');
  const tableCountInfo = document.getElementById('tableCountInfo');
  const paginationControls = document.getElementById('paginationControls');
  const refreshBtn = document.getElementById('refreshBtn');
  const openAddModalBtn = document.getElementById('openAddModalBtn');

  // DOM Elements - Modals
  const productModal = document.getElementById('productModal');
  const productModalTitle = document.getElementById('productModalTitle');
  const productForm = document.getElementById('productForm');
  const btnCloseProductModal = document.getElementById('btnCloseProductModal');
  const btnCancelProduct = document.getElementById('btnCancelProduct');
  const btnSaveProduct = document.getElementById('btnSaveProduct');

  // Form Inputs
  const inputName = document.getElementById('prodName');
  const inputPrice = document.getElementById('prodPrice');
  const inputOriginalPrice = document.getElementById('prodOriginalPrice');
  const inputCategory = document.getElementById('prodCategory');
  const inputSubcategory = document.getElementById('prodSubcategory');
  const inputBrand = document.getElementById('prodBrand');
  const inputStock = document.getElementById('prodStock');
  const inputDiscount = document.getElementById('prodDiscount');
  const inputImage = document.getElementById('prodImage');
  const inputKeywords = document.getElementById('prodKeywords');
  const inputDescription = document.getElementById('prodDescription');
  const imagePreview = document.getElementById('imagePreview');

  // Delete Modal
  const deleteModal = document.getElementById('deleteModal');
  const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  const deleteTargetName = document.getElementById('deleteTargetName');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================
  // Toast Helper
  // ==========================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ==========================================
  // Auth Flow
  // ==========================================
  function checkAuth() {
    if (AdminAPI.isAuthenticated()) {
      authScreen.style.display = 'none';
      dashboardScreen.style.display = 'flex';
      const user = AdminAPI.getAdminUser();
      if (adminNameDisplay) adminNameDisplay.textContent = user.name || 'Administrator';
      if (adminEmailDisplay) adminEmailDisplay.textContent = user.email || 'admin@megamart.com';
      initDashboard();
    } else {
      authScreen.style.display = 'flex';
      dashboardScreen.style.display = 'none';
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner"></span> Authenticating...';

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    try {
      await AdminAPI.login(email, password);
      showToast('Admin logged in successfully!');
      checkAuth();
    } catch (err) {
      loginError.textContent = err.message || 'Invalid admin credentials.';
      loginError.style.display = 'block';
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerHTML = 'Sign In to Admin Panel →';
    }
  });

  logoutBtn.addEventListener('click', () => {
    AdminAPI.clearSession();
    showToast('Logged out successfully.', 'info');
    checkAuth();
  });

  // ==========================================
  // Data Loading & Dashboard Setup
  // ==========================================
  async function initDashboard() {
    await Promise.all([loadCategories(), loadProducts()]);
  }

  async function loadCategories() {
    try {
      const categories = await AdminAPI.getCategories();
      state.categories = categories;

      // Populate filter select
      categoryFilterSelect.innerHTML = '<option value="">All Categories</option>';
      inputCategory.innerHTML = '<option value="">Select or type category...</option>';

      const standardCategories = [
        'Fruits & Vegetables',
        'Dairy & Eggs',
        'Bakery',
        'Beverages',
        'Snacks',
        'Meat & Seafood',
        'Pantry Staples',
        'Frozen Foods',
        'Personal Care',
        'Household',
      ];

      const allCats = Array.from(new Set([...standardCategories, ...categories])).filter(Boolean);

      allCats.forEach((cat) => {
        const optFilter = document.createElement('option');
        optFilter.value = cat;
        optFilter.textContent = cat;
        categoryFilterSelect.appendChild(optFilter);

        const optInput = document.createElement('option');
        optInput.value = cat;
        optInput.textContent = cat;
        inputCategory.appendChild(optInput);
      });
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }

  async function loadProducts() {
    state.isLoading = true;
    renderTableLoading();

    try {
      // Fetch products from backend with high limit to compute live dashboard metrics
      const response = await AdminAPI.getProducts({
        search: state.searchQuery,
        category: state.categoryFilter,
        limit: 100,
      });

      const allFetched = response.products || [];
      state.products = allFetched;
      state.totalCount = allFetched.length;

      updateMetrics(allFetched);
      renderTable();
    } catch (err) {
      console.error('Error loading products:', err);
      showToast(err.message || 'Failed to fetch products', 'error');
      renderTableError();
    } finally {
      state.isLoading = false;
    }
  }

  // Update Top Metric Cards
  function updateMetrics(items) {
    const totalCount = items.length;
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const catSet = new Set();

    items.forEach((p) => {
      const s = Number(p.stock) || 0;
      totalStock += s;
      if (s === 0) outOfStockCount++;
      else if (s <= 10) lowStockCount++;

      if (p.category) catSet.add(p.category);
    });

    if (metricTotalProducts) metricTotalProducts.textContent = totalCount;
    if (metricTotalStock) metricTotalStock.textContent = totalStock.toLocaleString();
    if (metricLowStock) metricLowStock.textContent = lowStockCount;
    if (metricOutOfStock) metricOutOfStock.textContent = outOfStockCount;
    if (metricCategories) metricCategories.textContent = catSet.size || state.categories.length;
  }

  // ==========================================
  // Table Rendering & Filtering
  // ==========================================
  function getFilteredProducts() {
    return state.products.filter((product) => {
      // Category filter
      if (state.categoryFilter && product.category !== state.categoryFilter) {
        return false;
      }

      // Stock status filter
      const stock = Number(product.stock) || 0;
      if (state.stockFilter === 'in_stock' && stock <= 10) return false;
      if (state.stockFilter === 'low_stock' && (stock <= 0 || stock > 10)) return false;
      if (state.stockFilter === 'out_of_stock' && stock > 0) return false;

      // Text Search
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const name = (product.name || '').toLowerCase();
        const brand = (product.brand || '').toLowerCase();
        const cat = (product.category || '').toLowerCase();
        const desc = (product.description || '').toLowerCase();
        const keywords = Array.isArray(product.keywords)
          ? product.keywords.join(' ').toLowerCase()
          : '';

        if (!name.includes(q) && !brand.includes(q) && !cat.includes(q) && !desc.includes(q) && !keywords.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }

  function renderTable() {
    const filtered = getFilteredProducts();
    const totalItems = filtered.length;
    state.totalPages = Math.ceil(totalItems / state.pageSize) || 1;

    if (state.currentPage > state.totalPages) {
      state.currentPage = state.totalPages;
    }

    const startIdx = (state.currentPage - 1) * state.pageSize;
    const endIdx = startIdx + state.pageSize;
    const pageItems = filtered.slice(startIdx, endIdx);

    // Update count info
    if (tableCountInfo) {
      if (totalItems === 0) {
        tableCountInfo.textContent = 'No products found';
      } else {
        tableCountInfo.textContent = `Showing ${startIdx + 1}–${Math.min(endIdx, totalItems)} of ${totalItems} products`;
      }
    }

    // Render Table Rows
    if (pageItems.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="table-empty-state">
              <div class="empty-icon">📦</div>
              <div class="empty-title">No matching products found</div>
              <div class="empty-desc">Try clearing your search query or selecting a different category filter.</div>
            </div>
          </td>
        </tr>
      `;
      renderPagination(0);
      return;
    }

    productsTableBody.innerHTML = pageItems.map((product) => {
      const stock = Number(product.stock) || 0;
      let stockBadgeClass = 'in-stock';
      let stockBadgeText = `${stock} in stock`;

      if (stock === 0) {
        stockBadgeClass = 'out-of-stock';
        stockBadgeText = 'Out of stock';
      } else if (stock <= 10) {
        stockBadgeClass = 'low-stock';
        stockBadgeText = `Low: ${stock} left`;
      }

      const price = Number(product.price) || 0;
      const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
      const imageUrl = product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';

      return `
        <tr data-id="${product._id}">
          <td>
            <div class="product-cell">
              <div class="product-thumb-wrap">
                <img class="product-thumb" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.name)}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60'" />
              </div>
              <div class="product-meta">
                <span class="product-name-text" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</span>
                <div class="product-sub-info">
                  ${product.brand ? `<span class="product-brand-tag">${escapeHtml(product.brand)}</span>` : ''}
                  ${product.discount ? `<span style="color:var(--accent); font-weight:600;">${escapeHtml(product.discount)}</span>` : ''}
                </div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge-category">${escapeHtml(product.category || 'General')}</span>
          </td>
          <td>
            <div>
              <span class="price-text">₹${price.toFixed(2)}</span>
              ${originalPrice && originalPrice > price ? `<span class="price-original">₹${originalPrice.toFixed(2)}</span>` : ''}
            </div>
          </td>
          <td>
            <span class="badge-stock ${stockBadgeClass}">${stockBadgeText}</span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action edit" data-action="edit" data-id="${product._id}" title="Edit Product">
                ✏️
              </button>
              <button class="btn-table-action delete" data-action="delete" data-id="${product._id}" title="Delete Product">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    renderPagination(state.totalPages);
    attachRowActionListeners();
  }

  function renderTableLoading() {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="table-empty-state">
            <span class="spinner" style="width:32px; height:32px; border-width:3px;"></span>
            <div class="empty-desc" style="margin-top:12px;">Loading products from database...</div>
          </div>
        </td>
      </tr>
    `;
  }

  function renderTableError() {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="table-empty-state">
            <div class="empty-icon" style="color:var(--danger)">⚠️</div>
            <div class="empty-title">Failed to load products</div>
            <div class="empty-desc">Please verify that backend server is running at http://localhost:5000.</div>
          </div>
        </td>
      </tr>
    `;
  }

  function renderPagination(totalPages) {
    if (!paginationControls) return;

    if (totalPages <= 1) {
      paginationControls.innerHTML = '';
      return;
    }

    let html = `
      <button class="btn-page" id="btnPrevPage" ${state.currentPage === 1 ? 'disabled' : ''}>← Prev</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      html += `
        <button class="btn-page ${i === state.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
      `;
    }

    html += `
      <button class="btn-page" id="btnNextPage" ${state.currentPage === totalPages ? 'disabled' : ''}>Next →</button>
    `;

    paginationControls.innerHTML = html;

    // Attach pagination click handlers
    document.getElementById('btnPrevPage')?.addEventListener('click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderTable();
      }
    });

    document.getElementById('btnNextPage')?.addEventListener('click', () => {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        renderTable();
      }
    });

    paginationControls.querySelectorAll('.btn-page[data-page]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        state.currentPage = Number(e.target.dataset.page);
        renderTable();
      });
    });
  }

  function attachRowActionListeners() {
    productsTableBody.querySelectorAll('.btn-table-action').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const button = e.currentTarget;
        const action = button.dataset.action;
        const productId = button.dataset.id;
        const product = state.products.find((p) => p._id === productId);

        if (!product) return;

        if (action === 'edit') {
          openEditProductModal(product);
        } else if (action === 'delete') {
          openDeleteConfirmModal(product);
        }
      });
    });
  }

  // ==========================================
  // Filters and Search Events
  // ==========================================
  let searchTimeout = null;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      state.currentPage = 1;
      renderTable();
    }, 250);
  });

  categoryFilterSelect.addEventListener('change', (e) => {
    state.categoryFilter = e.target.value;
    state.currentPage = 1;
    renderTable();
  });

  filterPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      filterPills.forEach((p) => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.stockFilter = e.currentTarget.dataset.stock;
      state.currentPage = 1;
      renderTable();
    });
  });

  refreshBtn.addEventListener('click', async () => {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<span class="spinner"></span>';
    await loadProducts();
    refreshBtn.disabled = false;
    refreshBtn.innerHTML = '🔄 Refresh';
    showToast('Products refreshed from database.');
  });

  // ==========================================
  // Add / Edit Product Modal
  // ==========================================
  function openAddProductModal() {
    state.editingProduct = null;
    productModalTitle.textContent = 'Add New Product';
    btnSaveProduct.textContent = 'Create Product';
    productForm.reset();
    imagePreview.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
    productModal.style.display = 'flex';
  }

  function openEditProductModal(product) {
    state.editingProduct = product;
    productModalTitle.textContent = 'Edit Product';
    btnSaveProduct.textContent = 'Save Changes';

    inputName.value = product.name || '';
    inputPrice.value = product.price || '';
    inputOriginalPrice.value = product.originalPrice || '';
    inputCategory.value = product.category || '';
    inputSubcategory.value = product.subcategory || '';
    inputBrand.value = product.brand || '';
    inputStock.value = product.stock ?? 0;
    inputDiscount.value = product.discount || '';
    inputImage.value = product.image || '';
    inputKeywords.value = Array.isArray(product.keywords) ? product.keywords.join(', ') : '';
    inputDescription.value = product.description || '';

    imagePreview.src = product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
    productModal.style.display = 'flex';
  }

  function closeProductModal() {
    productModal.style.display = 'none';
    state.editingProduct = null;
    productForm.reset();
  }

  openAddModalBtn.addEventListener('click', openAddProductModal);
  btnCloseProductModal.addEventListener('click', closeProductModal);
  btnCancelProduct.addEventListener('click', closeProductModal);

  // Live image preview
  inputImage.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    imagePreview.src = val || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
  });

  // Handle Form Submit (Add or Edit)
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = inputName.value.trim();
    const price = parseFloat(inputPrice.value);
    const originalPrice = inputOriginalPrice.value ? parseFloat(inputOriginalPrice.value) : undefined;
    const category = inputCategory.value.trim();
    const subcategory = inputSubcategory.value.trim();
    const brand = inputBrand.value.trim();
    const stock = parseInt(inputStock.value, 10) || 0;
    const discount = inputDiscount.value.trim();
    const image = inputImage.value.trim();
    const description = inputDescription.value.trim();
    const keywords = inputKeywords.value
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    if (!name || isNaN(price) || !category) {
      showToast('Name, price, and category are required.', 'error');
      return;
    }

    const payload = {
      name,
      price,
      originalPrice,
      category,
      subcategory,
      brand,
      stock,
      discount,
      image,
      description,
      keywords,
    };

    btnSaveProduct.disabled = true;
    btnSaveProduct.innerHTML = '<span class="spinner"></span> Saving...';

    try {
      if (state.editingProduct) {
        // Edit existing product
        await AdminAPI.updateProduct(state.editingProduct._id, payload);
        showToast(`Product "${name}" updated successfully!`);
      } else {
        // Add new product
        await AdminAPI.createProduct(payload);
        showToast(`Product "${name}" created successfully!`);
      }

      closeProductModal();
      await loadProducts();
    } catch (err) {
      showToast(err.message || 'Failed to save product.', 'error');
    } finally {
      btnSaveProduct.disabled = false;
      btnSaveProduct.textContent = state.editingProduct ? 'Save Changes' : 'Create Product';
    }
  });

  // ==========================================
  // Delete Confirmation Modal
  // ==========================================
  function openDeleteConfirmModal(product) {
    state.deletingProduct = product;
    deleteTargetName.textContent = product.name;
    deleteModal.style.display = 'flex';
  }

  function closeDeleteModal() {
    deleteModal.style.display = 'none';
    state.deletingProduct = null;
  }

  btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  btnCancelDelete.addEventListener('click', closeDeleteModal);

  btnConfirmDelete.addEventListener('click', async () => {
    if (!state.deletingProduct) return;

    btnConfirmDelete.disabled = true;
    btnConfirmDelete.innerHTML = '<span class="spinner"></span> Deleting...';

    try {
      await AdminAPI.deleteProduct(state.deletingProduct._id);
      showToast(`Product "${state.deletingProduct.name}" deleted from database.`);
      closeDeleteModal();
      await loadProducts();
    } catch (err) {
      showToast(err.message || 'Failed to delete product.', 'error');
    } finally {
      btnConfirmDelete.disabled = false;
      btnConfirmDelete.textContent = 'Delete Product';
    }
  });

  // ==========================================
  // Mobile Navigation Drawer
  // ==========================================
  const adminSidebar = document.getElementById('adminSidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openSidebar() {
    if (adminSidebar) adminSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  // Close sidebar on link click on mobile
  document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 960) closeSidebar();
    });
  });

  // Automatically close sidebar if window resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeSidebar();
    }
  });

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
    if (e.target === deleteModal) closeDeleteModal();
  });

  // Initialize App
  checkAuth();
});

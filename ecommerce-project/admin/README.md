# MegaMart Admin Panel

A standalone, secure, and professional Administrative Control Center for the MegaMart Ecommerce & Grocery Store.

## Architecture & Isolation

- **Directory**: `ecommerce-project/admin/` (completely isolated from `frontend` and `backend`).
- **Main Website Integrity**: **Zero** admin buttons, links, or UI elements on the customer-facing website (`localhost:3000`).
- **Backend & Database Connectivity**: Connects directly to existing backend APIs (`localhost:5000/api`) and the live MongoDB Atlas cluster.
- **Instant Synchronization**: Every change made here (Add, Edit, Price Change, Stock Change, Delete) is saved directly to MongoDB and immediately visible on the customer store.

---

## How to Run the Admin Panel

From the terminal, navigate to the `admin` folder and start the server:

```bash
cd ecommerce-project/admin
npm start
```

This launches the admin panel on:
👉 **`http://localhost:3001`**

*(Zero additional `npm install` needed — runs natively with Node.js HTTP server).*

---

## Default Admin Credentials

- **Admin Email**: `admin@megamart.com`
- **Password**: `Admin@123`

---

## Features Included

1. **Admin Login**:
   - Secure login authenticated against the existing `/api/users/login` endpoint.
   - Session storage in `localStorage` with auto-logout and route protection.

2. **Dashboard Overview**:
   - **Total Catalog Items** count.
   - **Total Stock in Warehouse** count.
   - **Low Stock Warnings** (items with &le; 10 units).
   - **Out of Stock Items** (items with 0 units).
   - **Distinct Categories** count.

3. **Product Inventory Table**:
   - Real-time product listing with thumbnails, name, brand, discount tag, category pill, formatted price, and stock indicators.
   - Color-coded stock badges:
     - 🟢 **In Stock**
     - 🟡 **Low Stock (&le; 10 units)**
     - 🔴 **Out of Stock (0 units)**

4. **Search & Multi-Filter**:
   - Instant search across product name, brand, category, keywords, and description.
   - Dynamic Category dropdown filter (auto-loaded from MongoDB).
   - Quick Stock Status tabs: *All*, *In Stock*, *Low Stock*, *Out of Stock*.

5. **Add New Product**:
   - Modal with fields for Name, Price, Original Price, Category, Subcategory, Brand, Stock Quantity, Discount Tag, Image URL (with live preview), Keywords, and Description.
   - Validates required inputs and creates the document in MongoDB via `POST /api/products`.

6. **Edit Product**:
   - Pre-populates all current attributes.
   - Edit Name, Price, Stock, Category, Subcategory, Brand, Description, and Image.
   - Saves updates directly via `PUT /api/products/:id`.

7. **Delete Product**:
   - Safety confirmation dialog showing target product name to prevent accidental deletion.
   - Deletes product from MongoDB via `DELETE /api/products/:id`.

8. **Toast Notifications**:
   - Instant visual feedback on every action (success, error, information).

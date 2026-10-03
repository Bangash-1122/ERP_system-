# Nexus ERP — Enterprise Resource Planning Management System

A modern, production-grade Enterprise ERP platform engineered with **React.js + Vite (JavaScript ES6+)**, **Node.js / Express**, **MongoDB / Mongoose**, **Redis Caching**, **Socket.IO Real-time WebSockets**, **Multer File System**, and **Tailwind CSS**.

---

## 🚀 Key Modules & Capabilities

### 1. 🏢 Multi-Organization & Catalog Management
- Multi-Branch, Multi-Warehouse, Multi-Shop, and Multi-Currency exchange management.
- Products catalog with SKU, Barcodes, Categories, Quantity Units, and Packing Units.

### 2. 📦 Movement-Based Stock & Inventory Engine
- Accurate inventory tracking via atomic transactions (`IN`, `OUT`, `TRANSFER`, `ADJUSTMENT`, `DAMAGE`).
- Warehouse Transfers with visual status workflow (`Warehouse A ➔ In-Transit ➔ Warehouse B`).
- Low-stock threshold warning systems and real-time inventory balances.

### 3. 👥 Parties & CRM
- Comprehensive tracking for Customers, Suppliers, Transporters, Employees, Business Owners, Partnerships, and Saraf exchange accounts.

### 4. 🛒 Purchases & 🛍️ Sales Workflow
- Purchase Orders & Supplier Invoices with live calculation of subtotal, VAT/GST taxes, freight, and net totals.
- Sales Orders & Tax Invoices with live stock availability verification and printable invoices.
- Purchase Returns and Sales Returns workflows.

### 5. 💰 Double-Entry General Ledger & Accounting
- Interactive Chart of Accounts with hierarchical Tree View.
- General Ledger with running debit & credit balance auditing.
- Payment Vouchers, Receipt Vouchers, and Journal Vouchers with mathematical double-entry balance validation (`Debit === Credit`).

### 6. 🚚 Logistics & Fleet Management
- Live shipment dispatching, vehicle registry, and delivery tracking manifests.

### 7. 📊 Financial & Executive Reporting
- Balance Sheet, Profit & Loss Statement, Trial Balance, Cash Flow Dynamics, Stock Valuation, Aging Reports, and Sales Margins.
- Instant export to **Excel (.xlsx)**, **PDF**, and **CSV**.

### 8. 🔒 Security, RBAC & Audit Trail
- Fine-grained Role-Based Access Control matrix (Create, Read, Update, Delete, Approve, Post).
- Immutable Audit Trail with visual field mutation inspector (`Old State ➔ Diff ➔ New State`).

---

## ⚡ Tech Stack

- **Frontend**: React 19, Vite, TanStack Query, Zustand, React Hook Form, Zod, Recharts, Lucide Icons, Tailwind CSS.
- **Backend**: Node.js, Express, Mongoose (MongoDB), Redis Cache, Socket.io, Multer, Helmet, Rate Limiter.

---

## 🛠️ Getting Started

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Seed Initial Demo Database
```bash
cd backend
node src/seed.js
```

---

## 🔑 Default Credentials
- **Administrator**: `admin@nexus.com` / `admin123`
- **Accountant**: `finance@nexus.com` / `finance123`
- **Inventory Manager**: `inventory@nexus.com` / `inventory123`
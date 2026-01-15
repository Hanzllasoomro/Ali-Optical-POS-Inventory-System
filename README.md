# Ali Optical POS Inventory System

A comprehensive **Point of Sale (POS) and Inventory Management System** designed specifically for optical retail businesses. This full-stack application enables efficient product management, sales tracking, inventory control, and business analytics.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Folder Structure Details](#folder-structure-details)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Project Overview

The **Ali Optical POS Inventory System** is a modern, scalable solution for managing optical retail operations. It provides:

- **Point of Sale (POS)**: Fast checkout with product search, cart management, and payment processing
- **Inventory Management**: Real-time stock tracking, low stock alerts, and inventory adjustments
- **Product Catalog**: Comprehensive product database with categories (glasses, sunglasses, contact lenses, etc.)
- **Sales Analytics**: Detailed reporting and business intelligence dashboards
- **User Management**: Role-based access control (Admin, Staff, Manager)
- **Multi-platform Support**: Desktop, tablet, and mobile-responsive design

---

## 🏗️ Architecture

This is a **MERN Stack** application with a clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│         Frontend (my-app/)                   │
│      Next.js 16 + React + TypeScript         │
│    Responsive UI for Web & Mobile            │
└──────────────┬──────────────────────────────┘
               │ (HTTP/REST API)
┌──────────────▼──────────────────────────────┐
│         Backend (server/)                    │
│    Express.js + Node.js + MongoDB            │
│    RESTful API Endpoints                     │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│      Database (MongoDB)                      │
│    Product, Order, Inventory Data            │
└─────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Ali Optical POS Inventory System/
├── server/                    # Backend Application
│   ├── src/
│   │   ├── models/           # MongoDB Schema Definitions
│   │   ├── routes/           # API Route Handlers
│   │   ├── controllers/      # Business Logic
│   │   ├── middleware/       # Auth, Validation, Error Handling
│   │   ├── config/           # Database & Environment Config
│   │   └── index.js          # Main Server Entry Point
│   ├── .env                  # Environment Variables
│   ├── package.json          # Dependencies
│   └── README.md             # Backend Documentation
│
└── my-app/                   # Frontend Application
    ├── src/
    │   ├── app/              # Next.js App Router (Pages)
    │   ├── components/       # Reusable UI Components
    │   ├── pages/            # Legacy Pages (if using Pages Router)
    │   ├── styles/           # Global & Component Styles
    │   ├── utils/            # Helper Functions & API Client
    │   ├── hooks/            # Custom React Hooks
    │   ├── types/            # TypeScript Interfaces
    │   └── constants/        # App Constants & Config
    ├── public/               # Static Assets
    ├── .env.local            # Frontend Environment Variables
    ├── next.config.js        # Next.js Configuration
    ├── tsconfig.json         # TypeScript Configuration
    ├── package.json          # Dependencies
    └── README.md             # Frontend Documentation
```

---

## 🛠️ Tech Stack

### Frontend (my-app/)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.1 | React Framework with SSR |
| **React** | 19+ | UI Library |
| **TypeScript** | Latest | Type Safety |
| **Tailwind CSS** | Latest | Styling Framework |
| **Axios** | Latest | HTTP Client |
| **React Query/SWR** | Latest | Data Fetching & Caching |

### Backend (server/)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **Express.js** | 4.x | Web Framework |
| **MongoDB** | 5.0+ | NoSQL Database |
| **Mongoose** | Latest | ODM (Object Document Mapper) |
| **JWT** | Latest | Authentication |
| **dotenv** | Latest | Environment Management |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- **Node.js** v18 or higher
- **npm** or **pnpm** package manager
- **MongoDB** (Local or Atlas Cloud)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
cd "Ali Optical POS Inventory System"
```

#### 2. Install Backend Dependencies

```bash
cd server
npm install
# or
pnpm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../my-app
npm install
# or
pnpm install
```

---

## ⚙️ Configuration

### Backend Configuration (server/)

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ali_optical
DB_NAME=ali_optical

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://192.168.10.18:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend Configuration (my-app/)

Create a `.env.local` file in the `my-app/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000

# App Configuration
NEXT_PUBLIC_APP_NAME=Ali Optical POS
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Application

Open a new terminal:

```bash
cd my-app
npm run dev
# Frontend runs on http://localhost:3000
# Network: http://192.168.10.18:3000
```

### Access the Application

- **Web**: http://localhost:3000
- **Mobile on Same Network**: http://192.168.10.18:3000
- **API Documentation**: http://localhost:5000/api/docs (if Swagger configured)

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Key Endpoints

#### Products
```
GET    /api/products              # List all products
GET    /api/products/:id          # Get product details
POST   /api/products              # Create product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product
```

#### Orders/Sales
```
GET    /api/orders                # List all orders
POST   /api/orders                # Create new order
GET    /api/orders/:id            # Get order details
PUT    /api/orders/:id/status     # Update order status
```

#### Inventory
```
GET    /api/inventory             # Get inventory status
PUT    /api/inventory/:productId  # Update stock level
GET    /api/inventory/low-stock   # Low stock alerts
```

#### Users
```
POST   /api/auth/login            # User login
POST   /api/auth/register         # User registration
POST   /api/auth/logout           # User logout
GET    /api/users                 # List users (Admin only)
```

---

## ✨ Features

### Core Features

- ✅ **Product Management**
  - Add, edit, delete products
  - Multiple categories (Glasses, Sunglasses, Contact Lenses)
  - SKU and barcode tracking
  - Product pricing and discounts

- ✅ **POS System**
  - Fast checkout process
  - Shopping cart management
  - Multiple payment methods
  - Receipt generation and printing

- ✅ **Inventory Control**
  - Real-time stock tracking
  - Low stock notifications
  - Stock adjustments and transfers
  - Expiry date management

- ✅ **Sales Analytics**
  - Daily/Weekly/Monthly sales reports
  - Revenue analytics
  - Best-selling products
  - Customer purchase history

- ✅ **User Management**
  - Role-based access control
  - User authentication (JWT)
  - Activity logging
  - Staff performance tracking

- ✅ **Mobile Responsive**
  - Works on tablets and phones
  - Touch-optimized interface
  - Offline capability (planned)

---

## 📂 Folder Structure Details

### server/

```
server/
├── src/
│   ├── models/
│   │   ├── Product.js        # Product schema
│   │   ├── Order.js          # Order schema
│   │   ├── User.js           # User schema
│   │   ├── Inventory.js      # Inventory schema
│   │   └── Category.js       # Product category schema
│   │
│   ├── routes/
│   │   ├── products.js       # Product routes
│   │   ├── orders.js         # Order routes
│   │   ├── auth.js           # Authentication routes
│   │   ├── inventory.js      # Inventory routes
│   │   └── users.js          # User management routes
│   │
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── authController.js
│   │   └── inventoryController.js
│   │
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── errorHandler.js   # Global error handling
│   │   ├── validation.js     # Request validation
│   │   └── cors.js           # CORS configuration
│   │
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── constants.js      # App constants
│   │
│   └── index.js              # Server entry point
├── .env                       # Environment variables
└── package.json
```

### my-app/

```
my-app/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Home page
│   │   ├── login/            # Login page
│   │   ├── dashboard/        # Dashboard
│   │   ├── products/         # Products management
│   │   ├── orders/           # Orders/Sales
│   │   ├── inventory/        # Inventory management
│   │   ├── layout.tsx        # Root layout
│   │   └── api/              # API routes (if needed)
│   │
│   ├── components/
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Sidebar.tsx       # Sidebar navigation
│   │   ├── ProductCard.tsx   # Product display
│   │   ├── Cart.tsx          # Shopping cart
│   │   ├── Checkout.tsx      # Checkout form
│   │   └── Reports/          # Analytics components
│   │
│   ├── hooks/
│   │   ├── useAuth.ts        # Authentication hook
│   │   ├── useProducts.ts    # Products data hook
│   │   └── useCart.ts        # Cart state hook
│   │
│   ├── utils/
│   │   ├── api.ts            # Axios instance & API calls
│   │   ├── formatters.ts     # Date, currency formatters
│   │   └── validators.ts     # Form validation
│   │
│   ├── types/
│   │   ├── product.ts        # Product types
│   │   ├── order.ts          # Order types
│   │   └── user.ts           # User types
│   │
│   └── constants/
│       ├── categories.ts     # Product categories (including sunglass)
│       └── config.ts         # App configuration
│
├── public/                   # Static assets
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 💻 Development Workflow

### Common Commands

#### Backend
```bash
# Development with auto-reload
cd server
npm run dev

# Production build
npm run build

# Run tests
npm run test
```

#### Frontend
```bash
# Development server
cd my-app
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Git Workflow

```bash
# Create a new branch for features
git checkout -b feature/category-sunglass

# Commit changes
git add .
git commit -m "feat: add sunglass product category"

# Push to repository
git push origin feature/category-sunglass
```

---

## 🐛 Troubleshooting

### Issue: Network Error on Mobile

**Symptoms**: `Runtime AxiosError - Network Error`

**Solution**:
1. Ensure dev server is running: `npm run dev`
2. Configure `allowedDevOrigins` in `next.config.js`
3. Access via IP address: `http://192.168.10.18:3000`
4. Check Windows Firewall allows Node.js

### Issue: MongoDB Connection Failed

**Solution**:
1. Verify MongoDB URI in `.env`
2. Check MongoDB service is running
3. Verify connection string format: `mongodb://user:pass@host:port/dbname`

### Issue: CORS Errors

**Solution**:
1. Update `CORS_ORIGIN` in server `.env`
2. Configure `allowedDevOrigins` in `next.config.js`
3. Check API endpoint URL in frontend `.env.local`

### Issue: Module Not Found

**Solution**:
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

---

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes with descriptive messages
3. Push to remote: `git push origin feature/your-feature`
4. Create a Pull Request with detailed description

---

## 📄 License

This project is proprietary software for Ali Optical. All rights reserved.

---

## 👨‍💼 Project Owner

**Ali Optical POS Inventory System**
- **Developer**: Hanzlla Soomro
- **Project Location**: `C:\Users\Hanzlla Soomro\Projects\web\Ali Optical POS Inventory System`
- **Last Updated**: January 2026

---

## 📞 Support

For issues, questions, or feature requests, please contact the development team.

---

**Happy Coding! 🚀**
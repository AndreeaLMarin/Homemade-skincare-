<<<<<<< HEAD
#  Homemade Skincare 
**University Final Graduation Project**  
Stack: React + Vite + Express + Node.js + Firebase

---

## Project Structure

```
skincare-app/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── assets/styles/    # Global CSS
│   │   ├── components/
│   │   │   ├── admin/        # AdminLayout (sidebar)
│   │   │   ├── common/       # ProductCard, RecipeCard, ProtectedRoute
│   │   │   └── layout/       # Navbar, Footer, Layout
│   │   ├── context/          # AuthContext (Firebase auth state)
│   │   ├── hooks/            # Custom React hooks (to be added)
│   │   ├── pages/
│   │   │   ├── admin/        # Dashboard, Orders, Products, Blog
│   │   │   ├── customer/     # MyOrdersPage
│   │   │   └── public/       # Home, Products, Blog, Login, Register
│   │   └── services/         # firebase.js, authService, productService, orderService, blogService
│   └── index.html
│
├── server/                   # Express backend
│   ├── config/               # Firebase Admin SDK init
│   ├── middleware/           # verifyToken, requireAdmin
│   ├── routes/               # auth, products, orders, recipes, users
│   └── index.js
│
└── package.json              # Root — runs both with concurrently
```

---










---

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Enable **Firestore Database** (start in test mode for dev)
5. Enable **Storage** (optional, for product images)

### 2. Client Firebase Config

1. In Firebase Console → Project Settings → General → Your apps → Add Web App
2. Copy the config values
3. Rename `client/.env.example` to `client/.env`
4. Fill in the values from Firebase

### 3. Server Firebase Admin SDK

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key" → download JSON
3. Save as `server/config/serviceAccountKey.json`
4. Rename `server/.env.example` to `server/.env`

### 4. Install & Run

```bash
# Install all dependencies
npm run install:all

# Start both client + server
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:5000

---

## Creating an Admin User

Since all registrations default to `customer` role, to create an admin:

1. Register a user normally through the app
2. In Firebase Console → Firestore → `users` collection
3. Find the document for that user
4. Change `role` field from `"customer"` to `"admin"`

The user can now access `/admin` dashboard.

---

## Firebase Firestore Collections

| Collection | Description |
|-----------|-------------|
| `users`   | uid, name, email, role (customer/admin) |
| `products`| name, category, price, description, ingredients[], skinTypes[], benefits[], imageUrl, howToUse |
| `orders`  | userId, productId, productName, quantity, totalPrice, status, note, adminNote |
| `recipes` | title, summary, content, imageUrl, tags[], skinType, difficulty, duration |

---

## Key Features

### Customer
- Browse products with full ingredient transparency
- Filter by category, search by name
- Request products (place orders)
- View order history with status tracking

### Admin
- Dashboard with stats overview
- Manage orders (update status: pending → processing → completed/cancelled)
- Add/edit/delete products with ingredient builder
- Create/edit/delete blog recipes

---

## Next Steps (Suggested)
- [ ] Product image upload via Firebase Storage
- [ ] Customer recipe selection from blog (link recipes to orders)
- [ ] Email notifications (Firebase Functions + SendGrid)
- [ ] Product reviews & ratings
- [ ] Cart functionality (multiple products per order)
- [ ] Admin user management page
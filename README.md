
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





###  Install & Run

```bash
# Install all dependencies
npm run install:all

# Start both client + server
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:5001

---

## Test Accounts 
Admin: 
user: andreea7niram@gmail.com
password: Andreea 

Regular User:
user: deaconuandreealavinia@gmail.com
password: Lavinia



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

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Firebase Hosting | https://homemade-skincare.web.app |
| Backend API | Render.com | https://homemade-skincare-api.onrender.com |
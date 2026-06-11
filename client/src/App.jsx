// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { RequireAuth, RequireAdmin } from './components/common/ProtectedRoute'

// Layouts
import Layout      from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'

// Public pages
import HomePage          from './pages/public/HomePage'
import AboutPage         from './pages/public/AboutPage'
import TutorialsPage     from './pages/public/TutorialsPage'
import ProductsPage      from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import BlogPage          from './pages/public/BlogPage'
import RecipeDetailPage  from './pages/public/RecipeDetailPage'
import ResearchPage      from './pages/public/ResearchPage'
import LoginPage         from './pages/public/LoginPage'
import RegisterPage      from './pages/public/RegisterPage'
import WaitlistPage      from './pages/public/WaitlistPage'

// Customer pages
import MyOrdersPage from './pages/customer/MyOrdersPage'

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminOrdersPage    from './pages/admin/AdminOrdersPage'
import AdminProductsPage  from './pages/admin/AdminProductsPage'
import AdminBlogPage      from './pages/admin/AdminBlogPage'
import AdminTutorialsPage from './pages/admin/AdminTutorialsPage'
import AdminStoryPage     from './pages/admin/AdminStoryPage'

export default function App() {
  return (
    // AuthProvider must wrap NotificationProvider (notifications depend on auth state)
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>

            {/* ── Public ── */}
            <Route element={<Layout />}>
              <Route path="/"             element={<HomePage />} />
              <Route path="/about"        element={<AboutPage />} />
              <Route path="/tutorials"    element={<TutorialsPage />} />
              <Route path="/products"     element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/blog"         element={<BlogPage />} />
              <Route path="/blog/:id"     element={<RecipeDetailPage />} />
              <Route path="/research"     element={<ResearchPage />} />
              <Route path="/login"        element={<LoginPage />} />
              <Route path="/register"     element={<RegisterPage />} />
              <Route path="/waitlist"  element={<WaitlistPage />} /> 

              {/* ── Customer ── */}
             <Route element={<RequireAuth />}>
                <Route path="/my-orders" element={<MyOrdersPage />} />
              </Route>
            </Route>

            {/* ── Admin ── */}
            <Route element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin"              element={<AdminDashboard />} />
                <Route path="/admin/orders"       element={<AdminOrdersPage />} />
                <Route path="/admin/products"     element={<AdminProductsPage />} />
                <Route path="/admin/tutorials"    element={<AdminTutorialsPage />} />
                <Route path="/admin/story"        element={<AdminStoryPage />} />
                <Route path="/admin/blog"         element={<AdminBlogPage />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

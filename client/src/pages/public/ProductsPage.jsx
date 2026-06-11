// src/pages/public/ProductsPage.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { getAllProducts } from '../../services/productService'
import ProductCard from '../../components/common/ProductCard'

const CATEGORIES = ['All', 'Cleanser', 'Serum', 'Moisturizer', 'Toner', 'Sunscreen', 'Lip Balm']

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProducts().then(data => {
      setProducts(data)
      setFiltered(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let result = products
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory)
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [activeCategory, search, products])

  return (
    <div className="products-page">
      <div className="page-hero-sm">
        <div className="container">
          <h1>Range of Products</h1>
          <p>Clean formulas, full transparency. Find your perfect match.</p>
        </div>
      </div>

      <div className="container section-pad">
        {/* Filters */}
        <div className="products-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-lg">
            <p>No products found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

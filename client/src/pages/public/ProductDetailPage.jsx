// src/pages/public/ProductDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Leaf } from 'lucide-react'
import { getProductById } from '../../services/productService'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductById(id).then(data => { setProduct(data); setLoading(false) })
  }, [id])

  if (loading) return <div className="page-loader" />
  if (!product) return <div className="container section-pad"><p>Product not found.</p></div>

  const ingredients = product.ingredients || []

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="product-detail-grid">
          {/* Image */}
          <motion.div className="product-image-wrap"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} />
              : <div className="product-image-placeholder"><Leaf size={64} /></div>
            }
            <div className="product-category-badge">{product.category}</div>
          </motion.div>

          {/* Info */}
          <motion.div className="product-info"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1>{product.name}</h1>
            <p className="product-description">{product.description}</p>

            {product.skinTypes?.length > 0 && (
              <div className="product-meta-section">
                <h3>Suitable For</h3>
                <div className="tag-list">
                  {product.skinTypes.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            )}

            {product.benefits?.length > 0 && (
              <div className="product-meta-section">
                <h3>Key Benefits</h3>
                <ul className="benefits-list">
                  {product.benefits.map((b, i) => <li key={i}><span>✓</span> {b}</li>)}
                </ul>
              </div>
            )}

            {/* Informational notice */}
            <div className="handmade-notice">
               This product is handmade in small batches. To receive a curated box of our full range, join the waiting list.
            </div>

            {/* CTA to waitlist */}
            <button
              className="btn btn-primary btn-lg w-full"
              onClick={() => navigate('/waitlist')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Join the Waiting List
            </button>

          </motion.div>
        </div>

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <section className="ingredients-section">
            <h2>Full Ingredient List</h2>
            <p className="ingredients-intro">
              Full transparency — here is everything in this product:
            </p>
            <div className="ingredients-grid">
              {ingredients.map((ing, i) => (
                <div key={i} className="ingredient-card">
                  <h4>{ing.name}</h4>
                  <span className={`ingredient-type ${ing.type?.toLowerCase()}`}>{ing.type}</span>
                  {ing.description && <p>{ing.description}</p>}
                  {ing.benefit && <p className="ingredient-benefit">✦ {ing.benefit}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {product.howToUse && (
          <section className="how-to-use-section">
            <h2>How to Use</h2>
            <p>{product.howToUse}</p>
          </section>
        )}
      </div>
    </div>
  )
}

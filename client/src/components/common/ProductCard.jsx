// src/components/common/ProductCard.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf } from 'lucide-react'

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/products/${product.id}`} className="product-card">
        <div className="product-card-img">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} loading="lazy" />
            : <div className="product-card-placeholder"><Leaf size={40} /></div>
          }
          <span className="product-card-category">{product.category}</span>
        </div>
        <div className="product-card-body">
          <h3>{product.name}</h3>
          <p>{product.description?.substring(0, 80)}{product.description?.length > 80 ? '…' : ''}</p>
          <div className="product-card-footer">

            <span className="product-card-arrow"><ArrowRight size={16} /></span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

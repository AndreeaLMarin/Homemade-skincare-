// src/components/common/RecipeCard.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Leaf } from 'lucide-react'

export default function RecipeCard({ recipe, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/blog/${recipe.id}`} className="recipe-card">
        <div className="recipe-card-img">
          {recipe.imageUrl
            ? <img src={recipe.imageUrl} alt={recipe.title} loading="lazy" />
            : <div className="recipe-card-placeholder"><Leaf size={40} /></div>
          }
          {recipe.difficulty && <span className="recipe-badge">{recipe.difficulty}</span>}
        </div>
        <div className="recipe-card-body">
          {recipe.tags?.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
          <h3>{recipe.title}</h3>
          <p>{recipe.summary?.substring(0, 100)}{recipe.summary?.length > 100 ? '…' : ''}</p>
          {recipe.duration && (
            <div className="recipe-meta">
              <Clock size={14} /> {recipe.duration}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

// src/pages/public/RecipeDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRecipeById } from '../../services/blogService'
import { ArrowLeft, Clock, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecipeById(id).then(data => {
      setRecipe(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="page-loader" />
  if (!recipe) return <div className="container"><p>Recipe not found.</p></div>

  return (
    <div className="recipe-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Blog
        </button>

        <motion.article className="recipe-article"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {recipe.imageUrl && (
            <div className="recipe-hero-img">
              <img src={recipe.imageUrl} alt={recipe.title} />
            </div>
          )}

          <div className="recipe-article-content">
            <div className="recipe-meta-row">
              {recipe.skinType && <span className="tag">{recipe.skinType}</span>}
              {recipe.difficulty && <span className="tag">{recipe.difficulty}</span>}
              {recipe.duration && <span className="tag"><Clock size={12} /> {recipe.duration}</span>}
            </div>

            <h1>{recipe.title}</h1>
            {recipe.summary && <p className="recipe-summary">{recipe.summary}</p>}

            <div className="recipe-body">
              {recipe.content?.split('\n').map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}

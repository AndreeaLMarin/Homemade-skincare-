// src/pages/public/BlogPage.jsx
import { useEffect, useState } from 'react'
import { getAllRecipes } from '../../services/blogService'
import RecipeCard from '../../components/common/RecipeCard'
import { Search } from 'lucide-react'

export default function BlogPage() {
  const [recipes, setRecipes] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllRecipes().then(data => {
      setRecipes(data)
      setFiltered(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!search) return setFiltered(recipes)
    setFiltered(recipes.filter(r =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.summary?.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, recipes])

  return (
    <div className="blog-page">
      <div className="page-hero-sm page-hero-green">
        <div className="container">
          <h1>Recipes & Blog</h1>
          <p>DIY skincare routines, ingredient deep-dives, and expert tips.</p>
        </div>
      </div>

      <div className="container section-pad">
        <div className="search-box search-box-centered">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-lg"><p>No recipes found.</p></div>
        ) : (
          <div className="recipe-grid recipe-grid-lg">
            {filtered.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

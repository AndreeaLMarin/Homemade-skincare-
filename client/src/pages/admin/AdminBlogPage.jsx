// src/pages/admin/AdminBlogPage.jsx
import { useEffect, useState } from 'react'
import { getAllRecipes, createRecipe, updateRecipe, deleteRecipe } from '../../services/blogService'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, X } from 'lucide-react'

const EMPTY_RECIPE = {
  title: '', summary: '', content: '', imageUrl: '',
  skinType: '', tags: [], difficulty: 'Easy', duration: '',
  productsUsed: [],
}

export default function AdminBlogPage() {
  const [recipes, setRecipes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_RECIPE)

  const load = () => getAllRecipes().then(setRecipes)
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY_RECIPE); setEditTarget(null); setShowModal(true) }
  const openEdit = (r) => { setForm({ ...r, tags: r.tags || [], productsUsed: r.productsUsed || [] }); setEditTarget(r.id); setShowModal(true) }

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required')
    try {
      if (editTarget) await updateRecipe(editTarget, form)
      else await createRecipe(form)
      toast.success(editTarget ? 'Recipe updated' : 'Recipe created')
      setShowModal(false)
      load()
    } catch { toast.error('Save failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this recipe?')) return
    await deleteRecipe(id)
    toast.success('Recipe deleted')
    load()
  }

  return (
    <div className="admin-blog-page">
      <div className="admin-page-header">
        <h1>Recipes & Blog</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Recipe</button>
      </div>

      <div className="blog-admin-list">
        {recipes.map(r => (
          <div key={r.id} className="blog-admin-row">
            {r.imageUrl && <img src={r.imageUrl} alt={r.title} />}
            <div className="blog-admin-info">
              <h3>{r.title}</h3>
              <p>{r.summary}</p>
              <div className="tag-list">
                {r.tags?.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="admin-product-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)}><Edit size={14} /></button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {recipes.length === 0 && <p className="empty-state">No recipes yet. Create your first one!</p>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editTarget ? 'Edit Recipe' : 'New Recipe'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <input value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Short description..." />
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Skin Type</label>
                  <input value={form.skinType} onChange={e => setForm({ ...form, skinType: e.target.value })} placeholder="e.g. Oily, Dry" />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    {['Easy', 'Medium', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 10 minutes" />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input value={form.tags.join(', ')}
                  onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>
              <div className="form-group">
                <label>Full Content</label>
                <textarea rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your recipe guide here..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Publish Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

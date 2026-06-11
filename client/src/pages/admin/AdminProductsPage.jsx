// src/pages/admin/AdminProductsPage.jsx
import { useEffect, useState } from 'react'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, X } from 'lucide-react'

const EMPTY_PRODUCT = {
  name: '', category: 'Serum', price: '', description: '',
  skinTypes: [], benefits: [], imageUrl: '', howToUse: '',
  ingredients: [],
}

const CATEGORIES = ['Cleanser', 'Serum', 'Moisturizer', 'Toner', 'Sunscreen', 'Lip Balm']

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [ingredientInput, setIngredientInput] = useState({ name: '', type: 'Active', description: '', benefit: '' })

  const load = () => getAllProducts().then(data => { setProducts(data); setLoading(false) })
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY_PRODUCT); setEditTarget(null); setShowModal(true) }
  const openEdit = (p) => {
    setForm({ ...p, skinTypes: p.skinTypes || [], benefits: p.benefits || [], ingredients: p.ingredients || [] })
    setEditTarget(p.id)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) return toast.error('Name and price are required')
    try {
      const data = { ...form, price: parseFloat(form.price) }
      if (editTarget) await updateProduct(editTarget, data)
      else await createProduct(data)
      toast.success(editTarget ? 'Product updated' : 'Product created')
      setShowModal(false)
      load()
    } catch { toast.error('Save failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    toast.success('Product deleted')
    load()
  }

  const addIngredient = () => {
    if (!ingredientInput.name) return
    setForm(f => ({ ...f, ingredients: [...f.ingredients, ingredientInput] }))
    setIngredientInput({ name: '', type: 'Active', description: '', benefit: '' })
  }

  const removeIngredient = (i) => {
    setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }))
  }

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Product</button>
      </div>

      <div className="admin-card-grid">
        {products.map(p => (
          <div key={p.id} className="admin-product-card">
            <div className="admin-product-img">
              {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : <span>🌿</span>}
            </div>
            <div className="admin-product-info">
              <span className="category-tag">{p.category}</span>
              <h3>{p.name}</h3>
              <p>£{p.price?.toFixed(2)}</p>
              <p className="text-sm text-muted">{p.ingredients?.length || 0} ingredients</p>
            </div>
            <div className="admin-product-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><Edit size={14} /></button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editTarget ? 'Edit Product' : 'New Product'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (£) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="form-group">
                <label>How to Use</label>
                <textarea rows={2} value={form.howToUse} onChange={e => setForm({ ...form, howToUse: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Skin Types (comma-separated)</label>
                <input value={form.skinTypes.join(', ')}
                  onChange={e => setForm({ ...form, skinTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>

              <div className="form-group">
                <label>Benefits (comma-separated)</label>
                <input value={form.benefits.join(', ')}
                  onChange={e => setForm({ ...form, benefits: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>

              {/* Ingredients builder */}
              <div className="ingredient-builder">
                <h4>Ingredients</h4>
                <div className="ingredient-input-row">
                  <input placeholder="Ingredient name" value={ingredientInput.name}
                    onChange={e => setIngredientInput({ ...ingredientInput, name: e.target.value })} />
                  <select value={ingredientInput.type}
                    onChange={e => setIngredientInput({ ...ingredientInput, type: e.target.value })}>
                    {['Active', 'Emollient', 'Humectant', 'Preservative', 'Fragrance', 'Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <input placeholder="Benefit" value={ingredientInput.benefit}
                    onChange={e => setIngredientInput({ ...ingredientInput, benefit: e.target.value })} />
                  <button className="btn btn-sm btn-outline" onClick={addIngredient}><Plus size={14} /></button>
                </div>
                <div className="ingredient-tags">
                  {form.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient-tag">
                      {ing.name} <button onClick={() => removeIngredient(i)}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

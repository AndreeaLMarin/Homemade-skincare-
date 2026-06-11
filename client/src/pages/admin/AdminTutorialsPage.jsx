// src/pages/admin/AdminTutorialsPage.jsx
import { useEffect, useState } from 'react'
import {
  getAllTutorials, createTutorial,
  updateTutorial, deleteTutorial, getYouTubeId
} from '../../services/tutorialService'
import { getAllProducts } from '../../services/productService'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, X, Youtube, Package } from 'lucide-react'

const EMPTY = {
  title: '',
  description: '',
  youtubeUrl: '',
  linkedProductIds: [],
  published: true,
}

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [ytPreview, setYtPreview] = useState(null)

  const load = () =>
    Promise.all([getAllTutorials(), getAllProducts()]).then(([t, p]) => {
      setTutorials(t); setProducts(p); setLoading(false)
    })

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setYtPreview(null); setShowModal(true) }
  const openEdit = (t) => {
    setForm({ ...t, linkedProductIds: t.linkedProductIds || [] })
    setEditTarget(t.id)
    const id = getYouTubeId(t.youtubeUrl)
    setYtPreview(id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null)
    setShowModal(true)
  }

  const handleUrlChange = (url) => {
    setForm(f => ({ ...f, youtubeUrl: url }))
    const id = getYouTubeId(url)
    setYtPreview(id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null)
  }

  const toggleProduct = (pid) => {
    setForm(f => ({
      ...f,
      linkedProductIds: f.linkedProductIds.includes(pid)
        ? f.linkedProductIds.filter(id => id !== pid)
        : [...f.linkedProductIds, pid]
    }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.youtubeUrl.trim()) return toast.error('YouTube URL is required')
    if (!getYouTubeId(form.youtubeUrl)) return toast.error('Invalid YouTube URL')
    try {
      if (editTarget) {
        await updateTutorial(editTarget, form)
        toast.success('Tutorial updated')
      } else {
        await createTutorial(form)
        toast.success('Tutorial created')
      }
      setShowModal(false)
      load()
    } catch { toast.error('Save failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this tutorial?')) return
    await deleteTutorial(id)
    toast.success('Deleted')
    load()
  }

  return (
    <div className="admin-tutorials-page">
      <div className="admin-page-header">
        <div>
          <h1>Tutorials</h1>
          <p className="page-subtitle">Add YouTube tutorials and link the products used in each one.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Tutorial
        </button>
      </div>

      {loading ? <div className="page-loader" /> : (
        <div className="tutorial-admin-grid">
          {tutorials.length === 0 && (
            <div className="empty-state-lg"><p>No tutorials yet. Add the first one!</p></div>
          )}
          {tutorials.map(t => {
            const ytId = getYouTubeId(t.youtubeUrl)
            const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
            const linkedNames = (t.linkedProductIds || [])
              .map(pid => products.find(p => p.id === pid)?.name)
              .filter(Boolean)
            return (
              <div key={t.id} className={`tutorial-admin-card ${!t.published ? 'unpublished' : ''}`}>
                <div className="tutorial-admin-thumb">
                  {thumb
                    ? <img src={thumb} alt={t.title} />
                    : <div className="tutorial-thumb-placeholder"><Youtube size={32} /></div>
                  }
                  {!t.published && <span className="draft-badge">Draft</span>}
                </div>
                <div className="tutorial-admin-info">
                  <h3>{t.title}</h3>
                  <p>{t.description?.substring(0, 100)}{t.description?.length > 100 ? '…' : ''}</p>
                  {linkedNames.length > 0 && (
                    <div className="tutorial-products-list">
                      <Package size={13} />
                      {linkedNames.map(n => <span key={n} className="tag">{n}</span>)}
                    </div>
                  )}
                </div>
                <div className="tutorial-admin-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(t)}>
                    <Edit size={14} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editTarget ? 'Edit Tutorial' : 'New Tutorial'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">

              <div className="form-group">
                <label>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Making a simple face serum" />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this tutorial cover? What will the viewer learn?" />
              </div>

              <div className="form-group">
                <label>YouTube URL *</label>
                <div className="yt-url-row">
                  <input
                    value={form.youtubeUrl}
                    onChange={e => handleUrlChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                  />
                </div>
                {ytPreview && (
                  <div className="yt-preview">
                    <img src={ytPreview} alt="YouTube preview" />
                    <span className="yt-preview-label">✓ Valid YouTube video detected</span>
                  </div>
                )}
                {form.youtubeUrl && !ytPreview && (
                  <span className="yt-invalid">⚠ Could not detect a valid YouTube video ID</span>
                )}
              </div>

              {/* Link products */}
              <div className="form-group">
                <label>Linked Products <span style={{ fontWeight: 400, color: 'var(--warm-ink-soft)' }}>(optional — shown below the video)</span></label>
                {products.length === 0 ? (
                  <p className="text-sm text-muted">No products yet. Add some in the Products section first.</p>
                ) : (
                  <div className="product-checkbox-grid">
                    {products.map(p => (
                      <label key={p.id} className={`product-checkbox-item ${form.linkedProductIds.includes(p.id) ? 'selected' : ''}`}>
                        <input type="checkbox"
                          checked={form.linkedProductIds.includes(p.id)}
                          onChange={() => toggleProduct(p.id)} />
                        <span>{p.name}</span>
                        <small>{p.category}</small>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                    style={{ width: 'auto' }} />
                  Published (visible on public site)
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Publish Tutorial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

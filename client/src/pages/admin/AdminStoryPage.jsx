// src/pages/admin/AdminStoryPage.jsx
import { useEffect, useState } from 'react'
import {
  getStorySections, createStorySection,
  updateStorySection, deleteStorySection
} from '../../services/storyService'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, X, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'

const ICON_OPTIONS = ['Heart', 'Search', 'Baby', 'Microscope', 'Leaf', 'FlaskConical', 'BookOpen', 'Star']

const EMPTY = {
  icon: 'Heart',
  title: '',
  body: [''],   // array of paragraphs
  order: 0,
  published: true,
}

export default function AdminStoryPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const load = () =>
    getStorySections().then(data => { setSections(data); setLoading(false) })

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm({ ...EMPTY, order: sections.length })
    setEditTarget(null)
    setShowModal(true)
  }

  const openEdit = (s) => {
    setForm({ ...s, body: s.body?.length ? s.body : [''] })
    setEditTarget(s.id)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    const cleanBody = form.body.filter(p => p.trim())
    if (!cleanBody.length) return toast.error('Add at least one paragraph')
    try {
      if (editTarget) {
        await updateStorySection(editTarget, { ...form, body: cleanBody })
        toast.success('Section updated')
      } else {
        await createStorySection({ ...form, body: cleanBody })
        toast.success('Section created')
      }
      setShowModal(false)
      load()
    } catch { toast.error('Save failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this section?')) return
    await deleteStorySection(id)
    toast.success('Deleted')
    load()
  }

  const moveSection = async (index, dir) => {
    const other = index + dir
    if (other < 0 || other >= sections.length) return
    const a = sections[index]
    const b = sections[other]
    await Promise.all([
      updateStorySection(a.id, { order: b.order }),
      updateStorySection(b.id, { order: a.order }),
    ])
    load()
  }

  // Paragraph helpers
  const setParagraph = (i, val) =>
    setForm(f => { const body = [...f.body]; body[i] = val; return { ...f, body } })
  const addParagraph = () => setForm(f => ({ ...f, body: [...f.body, ''] }))
  const removeParagraph = (i) =>
    setForm(f => ({ ...f, body: f.body.filter((_, idx) => idx !== i) }))

  return (
    <div className="admin-story-page">
      <div className="admin-page-header">
        <div>
          <h1>Story / About Page</h1>
          <p className="page-subtitle">Each card below is a section on the public Story page. Reorder, edit or delete freely.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Section
        </button>
      </div>

      {loading ? <div className="page-loader" /> : (
        <div className="story-section-list">
          {sections.length === 0 && (
            <div className="empty-state-lg">
              <p>No story sections yet. Add the first one!</p>
            </div>
          )}
          {sections.map((s, i) => (
            <div key={s.id} className={`story-admin-card ${!s.published ? 'unpublished' : ''}`}>
              <div className="story-admin-order">
                <button onClick={() => moveSection(i, -1)} disabled={i === 0}><ChevronUp size={16} /></button>
                <span>{i + 1}</span>
                <button onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1}><ChevronDown size={16} /></button>
              </div>
              <div className="story-admin-icon">{s.icon}</div>
              <div className="story-admin-content">
                <div className="story-admin-meta">
                  <h3>{s.title}</h3>
                  {!s.published && <span className="draft-badge">Draft</span>}
                </div>
                <p>{s.body?.[0]?.substring(0, 120)}{s.body?.[0]?.length > 120 ? '…' : ''}</p>
                <small className="text-muted">{s.body?.length} paragraph{s.body?.length !== 1 ? 's' : ''}</small>
              </div>
              <div className="story-admin-actions">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>
                  <Edit size={14} /> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editTarget ? 'Edit Section' : 'New Section'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Section Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Where it started" />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>
                    {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" value={form.order}
                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end', paddingTop: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.published}
                      onChange={e => setForm({ ...form, published: e.target.checked })}
                      style={{ width: 'auto' }} />
                    Published (visible on public site)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Paragraphs</label>
                <div className="paragraph-list">
                  {form.body.map((para, i) => (
                    <div key={i} className="paragraph-row">
                      <span className="para-num">{i + 1}</span>
                      <textarea
                        rows={3}
                        value={para}
                        onChange={e => setParagraph(i, e.target.value)}
                        placeholder={`Paragraph ${i + 1}…`}
                      />
                      {form.body.length > 1 && (
                        <button className="icon-btn para-remove" onClick={() => removeParagraph(i)}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="btn btn-outline btn-sm" onClick={addParagraph}>
                    <Plus size={13} /> Add paragraph
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Create Section'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

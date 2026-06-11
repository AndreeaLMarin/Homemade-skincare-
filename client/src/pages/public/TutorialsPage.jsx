// src/pages/public/TutorialsPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllTutorials, getYouTubeId } from '../../services/tutorialService'
import { getAllProducts } from '../../services/productService'
import { Youtube, Package, X, ArrowRight, Play } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }
  })
}

// Inline YouTube modal player
function VideoModal({ ytId, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div className="video-modal-overlay" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="video-modal-inner" onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <div className="video-modal-header">
            <h3>{title}</h3>
            <button className="video-modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="video-embed-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState(null) // { ytId, title }

  useEffect(() => {
    Promise.all([getAllTutorials(), getAllProducts()]).then(([t, p]) => {
      setTutorials(t.filter(tut => tut.published !== false))
      setProducts(p)
      setLoading(false)
    })
  }, [])

  const getLinkedProducts = (ids = []) =>
    ids.map(id => products.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="tutorials-page">

      {/* HERO */}
      <section className="page-hero-sm">
        <div className="container">
          <span className="lp-section-label">How it's made</span>
          <h1>Tutorials</h1>
          <p>Watch the process — from raw ingredients to finished product. No editing magic, no sponsorships.</p>
        </div>
      </section>

      <div className="container section-pad">
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : tutorials.length === 0 ? (
          <div className="empty-state-lg">
            <Youtube size={48} />
            <p>No tutorials yet — check back soon.</p>
          </div>
        ) : (
          <div className="tutorials-grid">
            {tutorials.map((tut, i) => {
              const ytId = getYouTubeId(tut.youtubeUrl)
              const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
              const linked = getLinkedProducts(tut.linkedProductIds)

              return (
                <motion.div key={tut.id} className="tutorial-card"
                  variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}>

                  {/* Thumbnail + play button */}
                  <div className="tutorial-thumb-wrap"
                    onClick={() => ytId && setActiveVideo({ ytId, title: tut.title })}>
                    {thumb
                      ? <img src={thumb} alt={tut.title} />
                      : <div className="tutorial-thumb-placeholder"><Youtube size={40} /></div>
                    }
                    {ytId && (
                      <div className="tutorial-play-btn">
                        <Play size={22} fill="white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="tutorial-card-body">
                    <h3>{tut.title}</h3>
                    {tut.description && <p>{tut.description}</p>}

                    {/* Linked products */}
                    {linked.length > 0 && (
                      <div className="tutorial-linked-products">
                        <span className="tutorial-linked-label">
                          <Package size={13} /> Products in this tutorial
                        </span>
                        <div className="tutorial-product-chips">
                          {linked.map(p => (
                            <Link key={p.id} to={`/products/${p.id}`} className="tutorial-product-chip">
                              {p.name} <ArrowRight size={11} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <VideoModal
          ytId={activeVideo.ytId}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  )
}

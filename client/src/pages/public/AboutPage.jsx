// src/pages/public/AboutPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Search, Baby, Microscope, Leaf, FlaskConical, BookOpen, Star } from 'lucide-react'
import { getStorySections } from '../../services/storyService'

// Maps icon name string → Lucide component
const ICON_MAP = {
  Heart: <Heart size={18} />,
  Search: <Search size={18} />,
  Baby: <Baby size={18} />,
  Microscope: <Microscope size={18} />,
  Leaf: <Leaf size={18} />,
  FlaskConical: <FlaskConical size={18} />,
  BookOpen: <BookOpen size={18} />,
  Star: <Star size={18} />,
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
}

// Fallback content shown when Firestore has no sections yet
const FALLBACK_SECTIONS = [
  {
    id: 'fallback-1',
    icon: 'Heart',
    title: 'Where it started',
    body: [
      'Like a lot of people, I spent years buying skincare products based on what looked good on a shelf or what someone online recommended. I\'d read the claims on the packaging — "clinically tested," "dermatologist approved," "natural formula" — and just trust them.',
      'Then I started having actual skin issues. And when those same issues appeared on my daughter\'s skin, I stopped trusting labels and started actually reading them.',
    ]
  },
  {
    id: 'fallback-2',
    icon: 'Search',
    title: 'The research phase',
    body: [
      'I started reading. Properly. Not blog posts — actual published studies, ingredient databases, supplier documentation. I wanted to understand what each ingredient actually does, at what concentration, and why it\'s in a product at all.',
      'The more I learned, the more I realised how little most product marketing has to do with the science.',
    ]
  },
  {
    id: 'fallback-3',
    icon: 'Baby',
    title: 'My little one changed everything',
    body: [
      'When my daughter started showing skin sensitivities, I became even more careful. I started formulating small batches using raw ingredients I could trace back to source.',
      'Those notes became this website.',
    ]
  },
]

export default function AboutPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStorySections()
      .then(data => {
        // Only show published sections
        setSections(data.filter(s => s.published !== false))
        setLoading(false)
      })
      .catch(() => { setSections([]); setLoading(false) })
  }, [])

  const displaySections = sections.length > 0 ? sections : FALLBACK_SECTIONS

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-texture" />
        <div className="container about-hero-inner">
          <motion.span className="lp-section-label"
            variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            The story behind this
             
          </motion.span>
          <motion.h1 className="about-title"
            variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            I got tired of <br /><em>not knowing</em>
          </motion.h1>
          <motion.p className="about-intro"
            variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            This isn't a brand. It's a research journey that got a website.
          </motion.p>
        </div>
      </section>

      {/* DYNAMIC STORY SECTIONS */}
      <section className="about-story">
        <div className="container about-story-inner">
          {loading ? (
            <div className="page-loader" />
          ) : (
            displaySections.map((s, i) => (
              <motion.div key={s.id} className="about-story-chapter"
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={0}>
                <div className="about-chapter-marker">
                  {ICON_MAP[s.icon] || <Heart size={18} />}
                </div>
                <div className="about-chapter-content">
                  <h2>{s.title}</h2>
                  {(s.body || []).map((para, pi) => (
                    <p key={pi}>{para}</p>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* SUPPLIER CHECKLIST — static, always shown */}
      <section className="about-values">
        <div className="container about-values-inner">
          <motion.div className="about-values-text"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-section-label">What I look for</span>
            <h2>How I choose<br />a supplier.</h2>
            <p>
              Raw ingredient quality varies enormously — and the label on a finished
              product tells you almost nothing about where the ingredients actually came from (the shorter the ingredients list, the better).
            </p>
            <p>Here's what I check for before buying from any supplier:</p>
          </motion.div>

          <div className="about-values-checklist">
            {[
              {
                title: <><a href="https://single-market-economy.ec.europa.eu/sectors/cosmetics/cosmetic-ingredient-database_en" target="_blank" rel="noopener noreferrer">Certificate of Analysis (CoA)</a></>,
                desc: 'Every batch should come with one. It should include purity, heavy metal testing, and microbial counts. If a supplier won\'t provide it, I don\'t buy.'
              },
              {
                title: <><a href="https://cosmileeurope.eu/inci/" target="_blank" rel="noopener noreferrer">INCI</a> name transparency</>,
                desc: 'The supplier should clearly state the full INCI name, not just a marketing name. "Rosehip Oil" is not an INCI name. "Rosa Canina Fruit Oil" is.'
              },
              {
                title: 'Origin and extraction method',
                desc: 'Where was the ingredient grown or sourced? How was it extracted? Cold-pressed vs. solvent-extracted affects both quality and what\'s left in the final product.'
              },
              {
                title: 'Storage and shelf life documentation',
                desc: 'Proper documentation includes storage conditions and expected shelf life. Suppliers who skip this are cutting corners somewhere.'
              },
              {
                title: 'Appropriate packaging',
                desc: <>I prefer suppliers who use amber glass or proper <a href="https://www.plasticsindustry.org/about-plastics/" target="_blank" rel="noopener noreferrer">HDPE</a>. If they're shipping sensitive oils in clear plastic, ingredient quality probably isn't their priority.</>
              },
            ].map((item, i) => (
              <motion.div key={i} className="about-check-item"
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.2}>
                <span className="about-check-tick">✓</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HONESTY NOTE */}
      <section className="about-honesty">
        <div className="container">
          <motion.div className="about-honesty-inner"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2>One more thing.</h2>
            <p>
              I'll get things wrong sometimes. Research evolves. My understanding changes.
              If something I've said turns out to be inaccurate, I'll update it and note that I did.
              I'd rather be corrected than confidently wrong.
            </p>
            <p>If you spot something that doesn't add up, please reach out. I mean that.</p>
            <div className="about-honesty-links">
              <Link to="/research" className="btn-warm-primary">
                Browse the research <ArrowRight size={15} />
              </Link>
              <Link to="/waitlist" className="btn-warm-outline">Join the waiting list</Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

// src/pages/public/HomePage.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, FlaskConical, Clock, ShieldCheck } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function HomePage() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-texture" />
        <div className="container lp-hero-inner">
          <motion.p className="lp-eyebrow" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            A personal skincare journal
          </motion.p>
          <motion.h1 className="lp-hero-title" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            Skincare without<br />the noise.
          </motion.h1>
          <motion.p className="lp-hero-body" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            No sponsored content. No affilliate link. No miracle claims.
            Just honest reasearch, tested ingredients, and what actually works.
            <br /><br />
            This is that place. 
            <p><em>*This is not medical advice, but my own journey and experience.</em></p>
          </motion.p>
          <motion.div className="lp-hero-cta" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Link to="/about" className="btn-warm-primary">
              Read the story <ArrowRight size={16} />
            </Link>
            <Link to="/tutorials" className="btn-warm-ghost">
              Watch tutorials
            </Link>
          </motion.div>
        </div>
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
      </section>

      {/* THE PROBLEM */}
      <section className="lp-problem">
        <div className="container lp-problem-inner">
          <motion.div className="lp-problem-text"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-section-label">Why this exists</span>
            <h2>You've been there too.</h2>
            <p>
              Scrolling product listings at midnight,
              trying to figure out what's worth buying — and what's just a pretty bottle
              with a big marketing budget behind it.
            </p>
            <p>
              This platform was created because there is a lack of honest source of information,
              No brand deals, no affiliates, no course to sell. Just formulations that have been tested,
              Researched and found to work. 

            </p>
            <Link to="/about" className="lp-text-link">
              Read the full story <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div className="lp-problem-card"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <blockquote>
              "80% of what you'll find here is real — problems I faced,
              ingredients I researched, and honest observations from
              years of trying to make sense of it all."
            </blockquote>
            <cite>— Andreea</cite>
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU'LL FIND */}
      <section className="lp-pillars">
        <div className="container">
          <motion.div className="lp-pillars-header"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-section-label">What's here</span>
            <h2>Four things, done properly.</h2>
          </motion.div>

          <div className="lp-pillars-grid">
            {[
              {
                icon: <BookOpen size={22} />,
                label: 'Tutorials',
                title: 'See it being made',
                desc: 'Short videos showing the actual making process — ingredients, steps, real results. No editing magic.',
                to: '/tutorials',
                cta: 'Watch tutorials'
              },
              {
                icon: <FlaskConical size={22} />,
                label: 'Products',
                title: 'Raw ingredients, honest picks',
                desc: 'The products and raw materials I actually use, with full ingredient transparency and supplier notes.',
                to: '/products',
                cta: 'See products'
              },
              {
                icon: <ShieldCheck size={22} />,
                label: 'Research',
                title: 'Read it yourself',
                desc: 'Studies, statistics, documented findings. I share what I find relevant and invite you to draw your own conclusions.',
                to: '/research',
                cta: 'Browse research'
              },
              {
                icon: <Clock size={22} />,
                label: 'Waiting List',
                title: 'Get notified when ready',
                desc: 'Small batches, made carefully. Leave your details and the product type you are interested in.',
                to: '/waitlist',
                cta: 'Join waiting list'
              },
            ].map((p, i) => (
              <motion.div key={i} className="lp-pillar-card"
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.5}>
                <div className="lp-pillar-icon">{p.icon}</div>
                <span className="lp-pillar-label">{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <Link to={p.to} className="lp-pillar-link">
                  {p.cta} <ArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="lp-principles">
        <div className="container lp-principles-inner">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-section-label">How this works</span>
            <h2>A few things<br />you won't find here.</h2>
          </motion.div>

          <div className="lp-principles-list">
            {[
              { no: 'No sponsored content', yes: 'Everything here is paid for and tested by me personally.' },
              { no: 'No affiliate links', yes: 'I link to suppliers because they\'re good — not because I get a cut.' },
              { no: 'No miracle claims', yes: 'Skincare works gradually. Anyone promising otherwise is selling something.' },
              { no: 'No pressure to buy', yes: 'The landing page has no products. Information always comes first.' },
            ].map((item, i) => (
              <motion.div key={i} className="lp-principle-row"
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.4}>
                <span className="lp-principle-no">{item.no}</span>
                <span className="lp-principle-yes">{item.yes}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOFT CTA */}
      <section className="lp-soft-cta">
        <div className="container">
          <motion.div className="lp-soft-cta-inner"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="lp-section-label">Ready when you are</span>
            <h2>Start wherever feels right.</h2>
            <p>
              There's no funnel here. Browse the research, watch a tutorial,
              or read the story behind it. Everything is here to inform — not to convert.
            </p>
            <div className="lp-soft-cta-links">
              <Link to="/about" className="btn-warm-primary">Meet Andreea <ArrowRight size={15} /></Link>
              <Link to="/research" className="btn-warm-outline">Browse research</Link>
              <Link to="/waitlist" className="btn-warm-outline">Join waiting list</Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

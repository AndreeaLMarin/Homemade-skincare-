// src/pages/public/ResearchPage.jsx

export default function ResearchPage() {
  const sources = [
    {
      title: "Statista",
      description: "Reliable resource for a wide range of statistics on skincare, beauty industry trends and consumer data.",
      link: "https://www.statista.com",
      tag: "Statistics"
    },
    {
      title: "Dr Herranz-Lopez — National Library of Medicine",
      description: "Peer-reviewed article on natural plant-based ingredients and their effects on skin health.",
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7466033/",
      tag: "Medical Research"
    },
    {
      title: "Natural Beauty: 35 Step-by-Step Projects for Homemade Beauty",
      description: "A practical guide to creating natural homemade beauty products, sourced via Google Scholar.",
      link: "https://books.google.co.uk/books?id=I49LCQAAQBAJ",
      tag: "Book"
    },
    {
      title: "PubMed — National Library of Medicine",
      description: "The gold standard database for peer-reviewed medical and skincare research articles.",
      link: "https://pubmed.ncbi.nlm.nih.gov",
      tag: "Medical Research"
    },
    {
      title: "Healthline — Skin & Beauty",
      description: "Evidence-based health and skincare articles, all medically reviewed by certified professionals.",
      link: "https://www.healthline.com/health/beauty-skin-care",
      tag: "Evidence-Based"
    },
    {
      title: "Paula's Choice — Ingredient Research",
      description: "Science-backed cosmetic ingredient research written by skincare and chemistry experts.",
      link: "https://www.paulaschoice.com/expert-advice",
      tag: "Cosmetic Science"
    }
  ]

  return (
    <div className="placeholder-page">
      <div className="container section-pad">

        <h1>Research &amp; Studies</h1>
        <p>A curated list of the academic sources, studies and references that inform the content on this site.</p>
        <p><em>*This is not medical advice, but my own journey and experience.</em></p>

        <div className="research-grid">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.link}
              target="_blank"
              rel="noopener noreferrer"
              className="research-card"
            >
              <span className="research-tag">{source.tag}</span>
              <h3>{source.title}</h3>
              <p>{source.description}</p>
              <span className="research-link">Visit source →</span>
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}

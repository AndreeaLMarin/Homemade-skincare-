// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">

        <div className="footer-brand">
          <span className="footer-logo">Homemade skincare</span>
          <p>
            A personal skincare journal.<br />
            No sponsored content. No affiliates. Just honest research.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <Link to="/about">The Story</Link>
            <Link to="/tutorials">Tutorials</Link>
            <Link to="/products">Products</Link>
          </div>
          <div>
            <h4>Learn</h4>
            <Link to="/research">Research & Studies</Link>
            <Link to="/blog">Recipes</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/my-orders">My Orders</Link>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Homemade skincare — University Final Project. All content is based on personal research and experience.</p>
        <p>*This is not medical advice, but my own journey and experience.</p>
      </div>
    </footer>
  )
}

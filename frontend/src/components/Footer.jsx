import { Link } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3>GetAJob</h3>
                    <p>Connecting job seekers with employers.</p>
                </div>
                <div className="footer-links">
                    <Link to="/jobs">Browse Jobs</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026 GetAJob — Team 23</p>
            </div>
        </footer>
    )
}

export default Footer
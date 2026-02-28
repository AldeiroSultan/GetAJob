import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/HomePage.css'

function HomePage() {
    const { user } = useAuth()

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Find Your Next Job</h1>
                    <p>Browse hundreds of job listings and apply with ease.</p>
                    <div className="hero-buttons">
                        <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
                        {!user && (
                            <Link to="/register" className="btn-secondary">Get Started</Link>
                        )}
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    <h3>🔍 Search Jobs</h3>
                    <p>Filter by title, location, and job type to find the perfect fit.</p>
                </div>
                <div className="feature-card">
                    <h3>📄 Easy Apply</h3>
                    <p>Apply to jobs quickly with your profile information.</p>
                </div>
                <div className="feature-card">
                    <h3>💬 Discussions</h3>
                    <p>Ask questions and connect with employers directly on job posts.</p>
                </div>
            </section>

            {!user && (
                <section className="cta">
                    <h2>Ready to get started?</h2>
                    <p>Create a free account and start applying today.</p>
                    <Link to="/register" className="btn-primary">Create Account</Link>
                </section>
            )}
        </div>
    )
}

export default HomePage
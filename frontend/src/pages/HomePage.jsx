import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, MapPin, Briefcase, FileText, MessageSquare, BarChart2 } from 'lucide-react'
import '../styles/HomePage.css'

function HomePage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [location, setLocation] = useState('')
    const [stats, setStats] = useState({ totalJobs: 0, totalUsers: 0, employers: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/public-stats')
                const data = await res.json()
                if (res.ok) setStats(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchStats()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        let url = '/jobs?'
        if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`
        if (location.trim()) url += `location=${encodeURIComponent(location.trim())}`
        navigate(url)
    }

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>
                        Find Your Next{' '}
                        <span className="hero-highlight">Career Move</span>{' '}
                        With Confidence
                    </h1>
                    <p>
                        Discover opportunities and connect with employers.
                        Your dream job is one search away.
                    </p>

                    <form onSubmit={handleSearch} className="hero-search">
                        <div className="hero-search-input">
                            <Search size={16} color="#999" />

                            <input
                                type="text"
                                placeholder="Job title, keyword, or company"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="hero-search-divider" />
                        <div className="hero-search-input">
                            <MapPin size={16} color="#999" />
                            <input
                                type="text"
                                placeholder="City, province, or remote"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="hero-search-btn">
                            Search Jobs →
                        </button>
                    </form>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-number">{stats.totalJobs}</span>
                            <span className="hero-stat-label">Active Jobs</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">{stats.employers}</span>
                            <span className="hero-stat-label">Employers</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-number">{stats.totalUsers}</span>
                            <span className="hero-stat-label">Job Seekers</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    <div className="feature-icon"><Search size={24} color="#7c3aed" /></div>
                    <h3>Smart Search</h3>
                    <p>Filter by title, location, and job type to find the perfect fit.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><FileText size={28} color="#7c3aed" /></div>
                    <h3>Easy Apply</h3>
                    <p>Apply to jobs quickly with an optional cover letter.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><MessageSquare size={28} color="#7c3aed" /></div>
                    <h3>Discussions</h3>
                    <p>Ask questions and connect with employers directly on job posts.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><BarChart2 size={28} color="#7c3aed" /></div>
                    <h3>Track Progress</h3>
                    <p>Monitor all your applications and their status from your profile.</p>
                </div>
            </section>

            {!user && (
                <section className="cta">
                    <h2>Ready to get started?</h2>
                    <p>Create a free account and start applying today.</p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-primary">Create Account</Link>
                        <Link to="/jobs" className="btn-secondary">Browse Jobs</Link>
                    </div>
                </section>
            )}
        </div>
    )
}

export default HomePage
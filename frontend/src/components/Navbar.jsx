import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.css'

function Navbar() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const roleLabel = useMemo(() => {
        if (!user) return 'Guest'
        if (user.role === 'admin') return 'Admin'
        if (user.role === 'employer') return 'Employer'
        return 'Applicant'
    }, [user])

    const contextLabel = useMemo(() => {
        if (location.pathname.startsWith('/admin')) return 'Admin workspace'
        if (location.pathname.startsWith('/employer')) return 'Employer workspace'
        if (location.pathname.startsWith('/profile')) return 'Profile'
        if (location.pathname.startsWith('/jobs')) return 'Jobs'
        if (location.pathname.startsWith('/discussion')) return 'Discussion'
        return 'Explore'
    }, [location.pathname])

    const contextTarget = useMemo(() => {
        if (location.pathname.startsWith('/admin')) return '/admin/dashboard'
        if (location.pathname.startsWith('/employer')) return '/employer/dashboard'
        if (location.pathname.startsWith('/profile')) return '/profile'
        if (location.pathname.startsWith('/jobs')) return '/jobs'
        if (location.pathname.startsWith('/discussion')) return '/jobs'
        return '/jobs'
    }, [location.pathname])

    useEffect(() => {
        setMenuOpen(false)
        setUserMenuOpen(false)
    }, [location.pathname])

    const handleLogout = () => {
        logout()
        setUserMenuOpen(false)
        navigate('/')
    }

    const primaryLinks = [
        { to: '/jobs', label: 'Browse Jobs' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ]

    const userLinks = user?.role === 'admin'
        ? [
            { to: '/admin/dashboard', label: 'Dashboard' },
            { to: '/admin/users', label: 'Manage Users' },
            { to: '/admin/jobs', label: 'Manage Jobs' },
            { to: '/profile', label: 'Profile' },
        ]
        : user?.role === 'employer'
            ? [
                { to: '/employer/dashboard', label: 'My Dashboard' },
                { to: '/employer/post-job', label: 'Post a Job' },
                { to: '/profile', label: 'Profile' },
            ]
            : user
                ? [
                    { to: '/profile', label: 'Profile' },
                    { to: '/jobs', label: 'Saved and Search' },
                ]
                : []

    return (
        <nav className="navbar">
            <div className="navbar-shell">
                <div className="navbar-brand-group">
                    <div className="navbar-brand">
                        <Link to="/">GetAJob</Link>
                    </div>
                    <div className="navbar-context">
                        <span className="navbar-context-role">{roleLabel}</span>
                        <Link to={contextTarget} className="navbar-context-page">
                            {contextLabel}
                        </Link>
                    </div>
                </div>

                <button
                    type="button"
                    className="nav-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-label="Toggle navigation menu"
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div className={menuOpen ? 'navbar-links is-open' : 'navbar-links'}>
                    <div className="navbar-primary">
                        {primaryLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="navbar-actions">
                        {!user && (
                            <>
                                <NavLink to="/login" className="nav-btn">Login</NavLink>
                                <NavLink to="/register" className="nav-btn nav-btn-primary">Register</NavLink>
                            </>
                        )}

                        {user && (
                            <div className="user-menu">
                                <button
                                    type="button"
                                    className="user-menu-trigger"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    aria-expanded={userMenuOpen}
                                    aria-label="Toggle user menu"
                                >
                                    <span className="user-menu-avatar">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                    <span className="user-menu-text">
                                        <strong>{user.name}</strong>
                                        <small>{roleLabel}</small>
                                    </span>
                                </button>

                                <div className={userMenuOpen ? 'user-menu-panel is-open' : 'user-menu-panel'}>
                                    {userLinks.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={({ isActive }) => isActive ? 'user-menu-link active' : 'user-menu-link'}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ))}
                                    <button onClick={handleLogout} className="user-menu-logout">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

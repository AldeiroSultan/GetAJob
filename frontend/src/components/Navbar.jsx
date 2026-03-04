import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.css'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">GetAJob</Link>
            </div>
            <div className="navbar-links">
                <Link to="/jobs">Browse Jobs</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>

                {!user && (
                    <>
                        <Link to="/login" className="nav-btn">Login</Link>
                        <Link to="/register" className="nav-btn nav-btn-primary">Register</Link>
                    </>
                )}

                {user && user.role === 'employer' && (
                    <Link to="/employer/dashboard">My Dashboard</Link>
                )}

                {user && user.role === 'admin' && (
                    <Link to="/admin/dashboard">Admin Panel</Link>
                )}

                {user && (
                    <>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout} className="nav-logout">Logout</button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Profile.css'

function ProfilePage() {
    const { user, login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [applications, setApplications] = useState([])
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState('profile')

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        setFormData({ name: user.name, email: user.email, password: '' })
        if (user.role === 'applicant') fetchApplications()
        fetchComments()
    }, [])

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/applications/myapplications', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const data = await res.json()
            setApplications(Array.isArray(data) ? data : [])
        } catch (err) {
            console.log(err)
        }
    }

    const fetchComments = async () => {
        try {
            const res = await fetch('/api/users/mycomments', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const data = await res.json()
            setComments(Array.isArray(data) ? data : [])
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setError('')
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.message)
                setLoading(false)
                return
            }
            login({ ...data, token: user.token })
            setMessage('Profile updated successfully!')
        } catch (err) {
            setError('Something went wrong')
        }
        setLoading(false)
    }

    const statusColor = (status) => {
        if (status === 'accepted') return '#2e7d32'
        if (status === 'rejected') return '#d32f2f'
        if (status === 'reviewed') return '#f57f17'
        return '#1565c0'
    }

    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <div className="profile-page">
            <div className="profile-container">

                {/* Profile Header */}
                <div className="profile-header-card">
                    <div className="profile-avatar">
                        {getInitials(user?.name)}
                    </div>
                    <div className="profile-header-info">
                        <h1>{user?.name}</h1>
                        <p>{user?.email}</p>
                        <span className="profile-role-badge">{user?.role}</span>
                    </div>
                    <div className="profile-header-stats">
                        {user?.role === 'applicant' && (
                            <div className="profile-stat">
                                <span className="stat-number">{applications.length}</span>
                                <span className="stat-label">Applications</span>
                            </div>
                        )}
                        <div className="profile-stat">
                            <span className="stat-number">{comments.length}</span>
                            <span className="stat-label">Comments</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    <button
                        className={tab === 'profile' ? 'tab-btn active' : 'tab-btn'}
                        onClick={() => setTab('profile')}
                    >
                        Account Details
                    </button>
                    {user?.role === 'applicant' && (
                        <button
                            className={tab === 'applications' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => setTab('applications')}
                        >
                            My Applications
                            {applications.length > 0 && (
                                <span className="tab-badge">{applications.length}</span>
                            )}
                        </button>
                    )}
                    <button
                        className={tab === 'comments' ? 'tab-btn active' : 'tab-btn'}
                        onClick={() => setTab('comments')}
                    >
                        My Comments
                        {comments.length > 0 && (
                            <span className="tab-badge">{comments.length}</span>
                        )}
                    </button>
                </div>

                {/* Account Details Tab */}
                {tab === 'profile' && (
                    <div className="profile-card">
                        <h2>Account Details</h2>
                        {message && <p className="profile-success">{message}</p>}
                        {error && <p className="profile-error">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" className="profile-btn" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Applications Tab */}
                {tab === 'applications' && (
                    <div className="profile-card">
                        <h2>My Applications</h2>
                        {applications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ color: '#666', marginBottom: '16px' }}>
                                    You haven't applied to any jobs yet.
                                </p>
                                <Link to="/jobs" style={{ color: '#4a90e2', fontWeight: 'bold' }}>
                                    Browse Jobs →
                                </Link>
                            </div>
                        ) : (
                            <div className="applications-list">
                                {applications.map(app => (
                                    <div key={app._id} className="application-item">
                                        <div>
                                            <h4>{app.job?.title}</h4>
                                            <p>{app.job?.company} — {app.job?.location}</p>
                                            <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                                                Applied {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                            <span style={{
                                                color: statusColor(app.status),
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                textTransform: 'capitalize',
                                                background: '#f4f6f8',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                            }}>
                                                {app.status}
                                            </span>
                                            <Link
                                                to={`/jobs/${app.job?._id}`}
                                                style={{ color: '#4a90e2', fontSize: '13px', textDecoration: 'none' }}
                                            >
                                                View Job →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Comments Tab */}
                {tab === 'comments' && (
                    <div className="profile-card">
                        <h2>My Comments</h2>
                        {comments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ color: '#666', marginBottom: '16px' }}>
                                    You haven't posted any comments yet.
                                </p>
                                <Link to="/jobs" style={{ color: '#4a90e2', fontWeight: 'bold' }}>
                                    Browse Jobs →
                                </Link>
                            </div>
                        ) : (
                            <div className="comments-history">
                                {comments.map(comment => (
                                    <div key={comment._id} className="comment-history-item">
                                        <div className="comment-history-header">
                                            <div>
                                                <span className="comment-job-title">
                                                    {comment.job?.title}
                                                </span>
                                                <span className="comment-job-company">
                                                    at {comment.job?.company}
                                                </span>
                                            </div>
                                            <span className="comment-history-date">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="comment-history-content">{comment.content}</p>
                                        <Link
                                            to={`/discussion/${comment.job?._id}`}
                                            style={{ color: '#4a90e2', fontSize: '13px', textDecoration: 'none' }}
                                        >
                                            View Discussion →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage
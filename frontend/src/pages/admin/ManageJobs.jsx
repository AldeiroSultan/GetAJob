import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Admin.css'

function ManageJobs() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
            return
        }
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/admin/jobs', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const data = await res.json()
            setJobs(data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return
        try {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            })
            if (res.ok) {
                setMessage('Job deleted successfully')
                setJobs(jobs.filter(j => j._id !== jobId))
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1>Manage Jobs</h1>
                <Link to="/admin/dashboard" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
                ← Back to Dashboard
                </Link>

                {message && <p className="admin-message">{message}</p>}

                <div className="admin-summary-row">
                    <div className="admin-summary-card">
                        <strong>{jobs.length}</strong>
                        <span>Total jobs listed</span>
                    </div>
                    <div className="admin-summary-card">
                        <strong>{jobs.filter((job) => job.location?.toLowerCase().includes('remote')).length}</strong>
                        <span>Remote listings</span>
                    </div>
                    <div className="admin-summary-card">
                        <strong>{jobs.filter((job) => job.type === 'full-time').length}</strong>
                        <span>Full-time listings</span>
                    </div>
                </div>

                {loading ? (
                    <p>Loading jobs...</p>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Company</th>
                                    <th>Location</th>
                                    <th>Posted By</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job._id}>
                                        <td>{job.title}</td>
                                        <td>{job.company}</td>
                                        <td>{job.location}</td>
                                        <td>{job.postedBy?.name}</td>
                                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="btn-view"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(job._id)}
                                                    className="btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageJobs

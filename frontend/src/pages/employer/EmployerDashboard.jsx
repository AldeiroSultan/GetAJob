import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function EmployerDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'employer') {
            navigate('/')
            return
        }
        fetchMyJobs()
    }, [])

    const fetchMyJobs = async () => {
        try {
            const res = await fetch('/api/jobs/myjobs', {
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
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', color: '#1a1a2e' }}>My Job Listings</h1>
                <Link
                    to="/employer/post-job"
                    style={{ background: '#4a90e2', color: 'white', padding: '10px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                    + Post New Job
                </Link>
            </div>

            {message && (
                <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                    {message}
                </p>
            )}

            {loading ? (
                <p>Loading your jobs...</p>
            ) : jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                    <p style={{ color: '#666', marginBottom: '20px', fontSize: '16px' }}>
                        You haven't posted any jobs yet.
                    </p>
                    <Link to="/employer/post-job" style={{ color: '#4a90e2', fontWeight: 'bold' }}>
                        Post your first job →
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {jobs.map(job => (
                        <div key={job._id} style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', color: '#1a1a2e', marginBottom: '4px' }}>{job.title}</h3>
                                    <p style={{ color: '#666', fontSize: '14px' }}>{job.company} — {job.location}</p>
                                    <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>
                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <Link
                                        to={`/jobs/${job._id}`}
                                        style={{ background: '#f4f6f8', color: '#333', padding: '8px 16px', borderRadius: '5px', textDecoration: 'none', fontSize: '14px' }}
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        style={{ background: '#fdecea', color: '#d32f2f', padding: '8px 16px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EmployerDashboard
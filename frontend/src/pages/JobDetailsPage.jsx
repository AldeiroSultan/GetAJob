import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function JobDetailsPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`)
                const data = await res.json()
                if (!res.ok) {
                    navigate('/jobs')
                    return
                }
                setJob(data)
            } catch (err) {
                navigate('/jobs')
            }
            setLoading(false)
        }
        fetchJob()
    }, [id])

    if (loading) return <p style={{ padding: '40px', textAlign: 'center' }}>Loading...</p>
    if (!job) return null

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
            <Link to="/jobs" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '14px' }}>
                ← Back to Jobs
            </Link>
            <div style={{ background: 'white', borderRadius: '8px', padding: '40px', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h1 style={{ fontSize: '28px', color: '#1a1a2e' }}>{job.title}</h1>
                    <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {job.type}
                    </span>
                </div>
                <p style={{ color: '#4a90e2', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{job.company}</p>
                <p style={{ color: '#666', marginBottom: '4px' }}>📍 {job.location}</p>
                <p style={{ color: '#666', marginBottom: '24px' }}>💰 {job.salary}</p>

                <hr style={{ borderColor: '#eee', marginBottom: '24px' }} />

                <h3 style={{ marginBottom: '12px', color: '#333' }}>Job Description</h3>
                <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '24px', whiteSpace: 'pre-line' }}>{job.description}</p>

                {job.requirements && (
                    <>
                        <h3 style={{ marginBottom: '12px', color: '#333' }}>Requirements</h3>
                        <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '24px', whiteSpace: 'pre-line' }}>{job.requirements}</p>
                    </>
                )}

                <hr style={{ borderColor: '#eee', marginBottom: '24px' }} />

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {user && user.role === 'applicant' && (
                        <button style={{ background: '#4a90e2', color: 'white', padding: '12px 28px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
                            Apply Now
                        </button>
                    )}
                    {!user && (
                        <Link to="/login" style={{ background: '#4a90e2', color: 'white', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '16px' }}>
                            Login to Apply
                        </Link>
                    )}
                    <Link to={`/discussion/${job._id}`} style={{ background: 'white', color: '#4a90e2', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '16px', border: '2px solid #4a90e2' }}>
                        💬 Discussion
                    </Link>
                </div>

                <p style={{ marginTop: '24px', fontSize: '13px', color: '#999' }}>
                    Posted by {job.postedBy?.name} on {new Date(job.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}

export default JobDetailsPage
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Admin.css'

function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
            return
        }
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const data = await res.json()
            setStats(data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const statusCards = stats ? [
        { label: 'Pending Review', value: stats.applicationBreakdown.pending, tone: 'neutral' },
        { label: 'Reviewed', value: stats.applicationBreakdown.reviewed, tone: 'info' },
        { label: 'Accepted', value: stats.applicationBreakdown.accepted, tone: 'success' },
        { label: 'Rejected', value: stats.applicationBreakdown.rejected, tone: 'danger' },
    ] : []

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1>Admin Dashboard</h1>

                {loading ? (
                    <p>Loading admin report...</p>
                ) : stats && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>{stats.totalUsers}</h3>
                                <p>Total Users</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.employers}</h3>
                                <p>Employers</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.applicants}</h3>
                                <p>Job Seekers</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.totalJobs}</h3>
                                <p>Total Jobs</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.totalApplications}</h3>
                                <p>Applications</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.disabledUsers}</h3>
                                <p>Disabled Users</p>
                            </div>
                        </div>

                        {/* Site Overview Bar Chart */}
                        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginTop: '24px', marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '20px', color: '#1a1a2e', fontSize: '16px', fontWeight: '600' }}>Site Overview</h3>
                            {[
                                { label: 'Users', value: stats.totalUsers, color: '#7c3aed' },
                                { label: 'Jobs', value: stats.totalJobs, color: '#4a90e2' },
                                { label: 'Applications', value: stats.totalApplications, color: '#2e7d32' },
                            ].map(({ label, value, color }) => (
                                <div key={label} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '14px', color: '#555' }}>{label}</span>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold', color }}>{value}</span>
                                    </div>
                                    <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                                        <div style={{
                                            background: color,
                                            height: '100%',
                                            width: `${Math.min((value / Math.max(stats.totalUsers, 1)) * 100, 100)}%`,
                                            borderRadius: '4px',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="report-grid">
                            <div className="report-card">
                                <div className="report-card-header">
                                    <h2>Application Pipeline</h2>
                                    <span>Current status mix</span>
                                </div>
                                <div className="status-grid">
                                    {statusCards.map((card) => (
                                        <div key={card.label} className={`status-card ${card.tone}`}>
                                            <strong>{card.value}</strong>
                                            <span>{card.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="report-card">
                                <div className="report-card-header">
                                    <h2>Operational Snapshot</h2>
                                    <span>High-level usage signals</span>
                                </div>
                                <div className="mini-metrics">
                                    <div className="mini-metric">
                                        <strong>{stats.activeJobs}</strong>
                                        <span>Active jobs</span>
                                    </div>
                                    <div className="mini-metric">
                                        <strong>{stats.remoteJobs}</strong>
                                        <span>Remote jobs</span>
                                    </div>
                                    <div className="mini-metric">
                                        <strong>{stats.fullTimeJobs}</strong>
                                        <span>Full-time roles</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="report-grid">
                            <div className="report-card">
                                <div className="report-card-header">
                                    <h2>Recent Users</h2>
                                    <span>Latest registrations</span>
                                </div>
                                <div className="activity-list">
                                    {stats.recentUsers.length === 0 ? (
                                        <p className="report-empty">No recent users.</p>
                                    ) : (
                                        stats.recentUsers.map((entry) => (
                                            <div key={entry._id} className="activity-item">
                                                <div>
                                                    <strong>{entry.name}</strong>
                                                    <p>{entry.role}</p>
                                                </div>
                                                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="report-card">
                                <div className="report-card-header">
                                    <h2>Recent Jobs</h2>
                                    <span>Latest postings</span>
                                </div>
                                <div className="activity-list">
                                    {stats.recentJobs.length === 0 ? (
                                        <p className="report-empty">No recent jobs.</p>
                                    ) : (
                                        stats.recentJobs.map((entry) => (
                                            <div key={entry._id} className="activity-item">
                                                <div>
                                                    <strong>{entry.title}</strong>
                                                    <p>{entry.company}</p>
                                                </div>
                                                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-header">
                                <h2>Recent Applications</h2>
                                <span>Latest applicant activity</span>
                            </div>
                            <div className="activity-list">
                                {stats.recentApplications.length === 0 ? (
                                    <p className="report-empty">No recent applications.</p>
                                ) : (
                                    stats.recentApplications.map((entry) => (
                                        <div key={entry._id} className="activity-item">
                                            <div>
                                                <strong>{entry.applicant?.name || 'Unknown applicant'}</strong>
                                                <p>{entry.job?.title || 'Unknown job'} • {entry.status}</p>
                                            </div>
                                            <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="admin-links">
                            <Link to="/admin/users" className="admin-link-card">
                                <h3>👥 Manage Users</h3>
                                <p>View, enable, disable, or delete user accounts</p>
                            </Link>
                            <Link to="/admin/jobs" className="admin-link-card">
                                <h3>💼 Manage Jobs</h3>
                                <p>View and remove job listings</p>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
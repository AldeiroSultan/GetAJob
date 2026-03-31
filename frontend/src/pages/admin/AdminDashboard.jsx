import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Admin.css'

function AdminDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)

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
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1>Admin Dashboard</h1>

                {stats && (
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
                    </div>
                )}

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
            </div>
        </div>
    )
}

export default AdminDashboard
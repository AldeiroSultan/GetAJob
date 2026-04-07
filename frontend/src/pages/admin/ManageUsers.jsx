import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Admin.css'

function ManageUsers() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
            return
        }
        fetchUsers()
    }, [])

    const fetchUsers = async (searchTerm = '') => {
        setLoading(true)
        try {
            const url = searchTerm
                ? `/api/admin/users?search=${searchTerm}`
                : '/api/admin/users'
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const data = await res.json()
            setUsers(data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchUsers(search)
    }

    const handleToggle = async (userId) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}/toggle`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.token}` }
            })
            const data = await res.json()
            if (res.ok) {
                setMessage(data.message)
                setUsers(users.map(u => u._id === userId ? data.user : u))
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            })
            if (res.ok) {
                setMessage('User deleted successfully')
                setUsers(users.filter(u => u._id !== userId))
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1>Manage Users</h1>
                <Link to="/admin/dashboard" style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
                 ← Back to Dashboard
                </Link>

                {message && <p className="admin-message">{message}</p>}

                <div className="admin-summary-row">
                    <div className="admin-summary-card">
                        <strong>{users.length}</strong>
                        <span>Visible users</span>
                    </div>
                    <div className="admin-summary-card">
                        <strong>{users.filter((u) => u.role === 'employer').length}</strong>
                        <span>Employers in result</span>
                    </div>
                    <div className="admin-summary-card">
                        <strong>{users.filter((u) => u.isDisabled).length}</strong>
                        <span>Disabled in result</span>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="admin-search">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                                        <td>
                                            <span style={{ color: u.isDisabled ? '#d32f2f' : '#2e7d32', fontWeight: 'bold' }}>
                                                {u.isDisabled ? 'Disabled' : 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            {u.role !== 'admin' && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleToggle(u._id)}
                                                        className={u.isDisabled ? 'btn-enable' : 'btn-disable'}
                                                    >
                                                        {u.isDisabled ? 'Enable' : 'Disable'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u._id)}
                                                        className="btn-delete"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
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

export default ManageUsers

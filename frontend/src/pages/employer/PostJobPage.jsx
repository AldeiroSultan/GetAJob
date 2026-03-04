import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function PostJobPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        description: '',
        requirements: '',
        salary: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
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

            navigate('/employer/dashboard')
        } catch (err) {
            setError('Something went wrong, please try again')
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 24px' }}>
            <Link
                to="/employer/dashboard"
                style={{ color: '#4a90e2', textDecoration: 'none', fontSize: '14px' }}
            >
                ← Back to Dashboard
            </Link>

            <h1 style={{ fontSize: '28px', color: '#1a1a2e', margin: '20px 0 32px' }}>
                Post a New Job
            </h1>

            {error && (
                <p style={{ background: '#fdecea', color: '#d32f2f', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                    {error}
                </p>
            )}

            <div style={{ background: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px' }}>
                            Job Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Developer"
                            required
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px' }}>
                            Company Name *
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Acme Corp"
                            required
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px' }}>
                            Location *
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Vancouver, BC"
                            required
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px' }}>
                            Salary (optional)
                        </label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g. $60,000 - $80,000/year"
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px' }}>
                            Job Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
                        >
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px' }}>
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, and what you're looking for..."
                            required
                            rows={6}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px' }}>
                            Requirements (optional)
                        </label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="List required skills, experience, education..."
                            rows={4}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', background: loading ? '#a0c4f1' : '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PostJobPage
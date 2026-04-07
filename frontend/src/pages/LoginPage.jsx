import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { trimFormValues, validateLoginForm } from '../utils/formValidation'
import '../styles/Auth.css'

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' })
        }
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const trimmedData = trimFormValues(formData)
        const validationErrors = validateLoginForm(trimmedData)

        setError('')
        setFieldErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trimmedData)
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                setLoading(false)
                return
            }

            login(data)
            navigate('/')
        } catch (err) {
            setError('Something went wrong, please try again')
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Welcome Back</h2>
                {error && <p className="auth-error">{error}</p>}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@email.com"
                            aria-invalid={Boolean(fieldErrors.email)}
                        />
                        {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            aria-invalid={Boolean(fieldErrors.password)}
                        />
                        {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage

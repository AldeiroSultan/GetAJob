import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateRegisterForm, trimFormValues } from '../utils/formValidation'
import '../styles/Auth.css'

function RegisterPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'applicant',
    })
    const [profileImage, setProfileImage] = useState(null)
    const [fieldErrors, setFieldErrors] = useState({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: '' })
        }
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setFieldErrors({ ...fieldErrors, profileImage: 'Only JPG and PNG files are allowed' })
                setProfileImage(null)
                return
            }
            if (file.size > 2 * 1024 * 1024) {
                setFieldErrors({ ...fieldErrors, profileImage: 'Image must be under 2MB' })
                setProfileImage(null)
                return
            }
            setFieldErrors({ ...fieldErrors, profileImage: '' })
            setProfileImage(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const trimmed = trimFormValues(formData)
        const errors = validateRegisterForm(trimmed)

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return
        }

        setLoading(true)
        setError('')

        try {
            // use FormData so we can send the image file
            const data = new FormData()
            data.append('name', trimmed.name)
            data.append('email', trimmed.email)
            data.append('password', trimmed.password)
            data.append('confirmPassword', trimmed.confirmPassword)
            data.append('role', trimmed.role)
            if (profileImage) {
                data.append('profileImage', profileImage)
            }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: data, // no Content-Type header — browser sets it with boundary automatically
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.message || 'Registration failed')
                setLoading(false)
                return
            }

            login(result)
            navigate('/')
        } catch (err) {
            setError('Something went wrong. Please try again.')
        }
        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="auth-subtitle">Join GetAJob today</p>

                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label for="name">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                        />
                        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
                    </div>

                    <div className="form-group">
                        <label>Profile Picture (optional)</label>
                        <label for="profileImage">Profile Picture (optional)</label>
                        <input
                            type="file"
                            name="profileImage"
                            id="profileImage"
                            accept="image/jpeg, image/png"
                            onChange={handleImageChange}
                        />
                        {fieldErrors.profileImage && <span className="field-error">{fieldErrors.profileImage}</span>}
                        <small style={{ color: '#999', fontSize: '12px' }}>JPG or PNG, max 2MB</small>
                    </div>

                    <div className="form-group">
                        <label for="role">I am a...</label>
                        <select name="role" id="role" value={formData.role} onChange={handleChange}>
                            <option value="applicant">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-btn" name="create account" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage

import { useState } from 'react'
import { trimFormValues, validateContactForm } from '../utils/formValidation'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [responseMessage, setResponseMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' })
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedData = trimFormValues(formData)
    const validationErrors = validateContactForm(trimmedData)

    setError('')
    setResponseMessage('')
    setFieldErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to send message')
        setLoading(false)
        return
      }

      setResponseMessage(data.message)
      setFieldErrors({})
      setFormData({
        name: '',
        email: '',
        message: '',
      })
    } catch (err) {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = (fieldName) => ({
    padding: '12px',
    border: fieldErrors[fieldName] ? '1px solid #d32f2f' : '1px solid #d0d7de',
    borderRadius: '6px',
  })

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 24px' }}>
      <h1>Contact Us</h1>
      <p>Send us a message and we’ll get back to you.</p>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
        <div style={{ display: 'grid', gap: '6px' }}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.name)}
            style={inputStyle('name')}
          />
          {fieldErrors.name && <p style={{ color: '#d32f2f', fontSize: '13px', margin: 0 }}>{fieldErrors.name}</p>}
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.email)}
            style={inputStyle('email')}
          />
          {fieldErrors.email && <p style={{ color: '#d32f2f', fontSize: '13px', margin: 0 }}>{fieldErrors.email}</p>}
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          <textarea
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            aria-invalid={Boolean(fieldErrors.message)}
            style={{ ...inputStyle('message'), resize: 'vertical', fontFamily: 'inherit' }}
          />
          {fieldErrors.message && <p style={{ color: '#d32f2f', fontSize: '13px', margin: 0 }}>{fieldErrors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            background: loading ? '#a0c4f1' : '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {responseMessage && (
        <p style={{ marginTop: '16px', color: 'green' }}>{responseMessage}</p>
      )}

      {error && (
        <p style={{ marginTop: '16px', color: 'red' }}>{error}</p>
      )}
    </div>
  )
}
export default ContactPage

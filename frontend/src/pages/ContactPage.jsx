import {useState}  from "react"
function ContactPage() {
  const [formData,setFormData] = useState({
  name: '',
  email: '',
  message: ''
  })
  const[responseMessage,setResponseMessage] = useState('')
  const[error,setError] = useState('')
  const[loading,setLoading]= useState(false)

  const handleChange = async (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setResponseMessage('')
  setLoading(true)

  try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to send message')
        setLoading(false)
        return
      }

      setResponseMessage(data.message)
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
return(
  <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 24px' }}>
      <h1>Contact Us</h1>
      <p>Send us a message and we’ll get back to you.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '12px' }}
        />

        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '12px' }}
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
          style={{ padding: '12px' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
          padding: '12px 20px',
          background: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
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
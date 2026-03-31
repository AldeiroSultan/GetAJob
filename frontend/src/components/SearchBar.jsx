import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (search.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(search.trim())}`)
        } else {
            navigate('/jobs')
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '500px' }}>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title or company..."
                style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                }}
            />
            <button
                type="submit"
                style={{
                    padding: '10px 20px',
                    background: '#4a90e2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                Search
            </button>
        </form>
    )
}

export default SearchBar
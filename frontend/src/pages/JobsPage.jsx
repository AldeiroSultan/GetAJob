import { useState, useEffect } from 'react'
import JobCard from '../components/JobCard'
import '../styles/JobsPage.css'

function JobsPage() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [type, setType] = useState('')
    const [location, setLocation] = useState('')

    const fetchJobs = async () => {
        setLoading(true)
        try {
       const query = new URLSearchParams()

        if (search) query.append('term', search)
        if (type) query.append('type', type)
        if (location) query.append('location', location)

        const res = await fetch(`/api/jobs/search?${query.toString()}`)
        const data = await res.json()

        if (!res.ok) {
            setJobs([])
            setLoading(false)
            return
        }

        setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
        console.log(err)
        setJobs([])
    }
        setLoading(false)
    }

    useEffect(() => {
        fetchJobs()
    }, [search, type, location] )

    const handleSearch = (e) => {
        e.preventDefault()
        fetchJobs()
    }

    const handleReset = () => {
        setSearch('')
        setType('')
        setLocation('')
    }

    return (
        <div className="jobs-page">
            <div className="jobs-header">
                <h1>Browse Jobs</h1>
                <p>Find the perfect job for you</p>
            </div>

            <div className="jobs-search">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by title or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                    </select>
                    <button type="submit">Search</button>
                    <button type="button" onClick={handleReset} className="reset-btn">
                        Reset
                    </button>
                </form>
            </div>

            <div className="jobs-container">
                {loading ? (
                    <p className="jobs-status">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p className="jobs-status">No jobs found. Try a different search!</p>
                ) : (
                    <>
                        <p className="jobs-count">{jobs.length} job(s) found</p>
                        <div className="jobs-grid">
                            {jobs.map((job) => (
                                <JobCard key={job._id|| job.id} job={job} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default JobsPage
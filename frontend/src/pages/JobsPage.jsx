import { useState, useEffect } from 'react'
import JobCard from '../components/JobCard'
import '../styles/JobsPage.css'

function JobsPage() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [type, setType] = useState('')
    const [location, setLocation] = useState('')
    const [savedJobs, setSavedJobs] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savedJobs')) || []
        } catch {
            return []
        }
    })

    const fetchJobs = async () => {
        setLoading(true)
        try {
            let url = '/api/jobs?'
            if (search) url += `search=${search}&`
            if (type) url += `type=${type}&`
            if (location) url += `location=${location}&`

            const res = await fetch(url)
            const data = await res.json()
            setJobs(Array.isArray(data) ? data : [])
        } catch (err) {
            console.log(err)
            setJobs([])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        fetchJobs()
    }

    const handleReset = () => {
        setSearch('')
        setType('')
        setLocation('')
        setTimeout(() => fetchJobs(), 100)
    }

    const handleSave = (job) => {
        const exists = savedJobs.find(j => j._id === job._id)
        let updated
        if (exists) {
            updated = savedJobs.filter(j => j._id !== job._id)
        } else {
            updated = [job, ...savedJobs]
        }
        setSavedJobs(updated)
        localStorage.setItem('savedJobs', JSON.stringify(updated))
    }

    const isSaved = (jobId) => savedJobs.some(j => j._id === jobId)

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

            <div className="jobs-body">
                {/* Main job list */}
                <div className="jobs-main">
                    {loading ? (
                        <p className="jobs-status">Loading jobs...</p>
                    ) : jobs.length === 0 ? (
                        <p className="jobs-status">No jobs found. Try a different search!</p>
                    ) : (
                        <>
                            <p className="jobs-count">{jobs.length} job(s) found</p>
                            <div className="jobs-list">
                                {jobs.map((job) => (
                                    <JobCard
                                        key={job._id}
                                        job={job}
                                        onSave={handleSave}
                                        isSaved={isSaved(job._id)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="jobs-sidebar">
                    <div className="sidebar-card">
                        <div className="sidebar-card-header">
                            <span>🔖</span>
                            <h3>Job Tracker</h3>
                        </div>
                        <p className="sidebar-subtitle">Jobs you've saved</p>

                        {savedJobs.length === 0 ? (
                            <div className="sidebar-empty">
                                <p>No saved jobs yet.</p>
                                <p>Click <strong>Save</strong> on any job to track it here.</p>
                            </div>
                        ) : (
                            <div className="saved-jobs-list">
                                {savedJobs.map(job => (
                                    <div key={job._id} className="saved-job-item">
                                        <div className="saved-job-logo">
                                            {job.company?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="saved-job-info">
                                            <p className="saved-job-title">{job.title}</p>
                                            <p className="saved-job-company">{job.company}</p>
                                        </div>
                                        <button
                                            onClick={() => handleSave(job)}
                                            className="saved-job-remove"
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="sidebar-card">
                        <div className="sidebar-card-header">
                            <span>💡</span>
                            <h3>Quick Tips</h3>
                        </div>
                        <ul className="tips-list">
                            <li>Tailor your cover letter for each role</li>
                            <li>Apply within the first 24 hours</li>
                            <li>Use the discussion tab to ask questions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobsPage
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import JobCard from '../components/JobCard'
import '../styles/JobsPage.css'

function JobsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(() => searchParams.get('search') || '')
    const [type, setType] = useState(() => searchParams.get('type') || '')
    const [location, setLocation] = useState(() => searchParams.get('location') || '')
    const [feedback, setFeedback] = useState('')
    const [savedJobs, setSavedJobs] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savedJobs')) || []
        } catch {
            return []
        }
    })
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('recentJobSearches')) || []
        } catch {
            return []
        }
    })

    useEffect(() => {
        setSearch(searchParams.get('search') || '')
        setType(searchParams.get('type') || '')
        setLocation(searchParams.get('location') || '')
    }, [searchParams])

    useEffect(() => {
        if (!feedback) return

        const timer = setTimeout(() => setFeedback(''), 2500)
        return () => clearTimeout(timer)
    }, [feedback])

    const updateSearchParams = ({ nextSearch, nextType, nextLocation }) => {
        const params = new URLSearchParams()

        if (nextSearch) params.set('search', nextSearch)
        if (nextType) params.set('type', nextType)
        if (nextLocation) params.set('location', nextLocation)

        setSearchParams(params)
    }

    const rememberSearch = (nextSearch, nextLocation, nextType) => {
        const labelParts = [
            nextSearch && `Search: ${nextSearch}`,
            nextLocation && `Location: ${nextLocation}`,
            nextType && `Type: ${nextType}`,
        ].filter(Boolean)

        if (labelParts.length === 0) return

        const entry = {
            label: labelParts.join(' • '),
            search: nextSearch,
            location: nextLocation,
            type: nextType,
        }

        const updated = [
            entry,
            ...recentSearches.filter(
                (item) =>
                    item.search !== entry.search ||
                    item.location !== entry.location ||
                    item.type !== entry.type
            ),
        ].slice(0, 5)

        setRecentSearches(updated)
        localStorage.setItem('recentJobSearches', JSON.stringify(updated))
    }

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
    }, [search, type, location])

    const handleSearch = (e) => {
        e.preventDefault()
        const nextSearch = search.trim()
        const nextLocation = location.trim()

        updateSearchParams({ nextSearch, nextType: type, nextLocation })
        rememberSearch(nextSearch, nextLocation, type)
    }

    const handleReset = () => {
        setSearch('')
        setType('')
        setLocation('')
        setSearchParams(new URLSearchParams())
        setFeedback('Search filters cleared.')
    }

    const handleSave = (job) => {
        const exists = savedJobs.find(j => j._id === job._id)
        let updated
        if (exists) {
            updated = savedJobs.filter(j => j._id !== job._id)
            setFeedback(`Removed ${job.title} from your tracker.`)
        } else {
            updated = [job, ...savedJobs]
            setFeedback(`Saved ${job.title} to your tracker.`)
        }
        setSavedJobs(updated)
        localStorage.setItem('savedJobs', JSON.stringify(updated))
    }

    const isSaved = (jobId) => savedJobs.some(j => j._id === jobId)
    const hasActiveFilters = Boolean(search || location || type)
    const activeFilters = [
        search && `Search: ${search}`,
        location && `Location: ${location}`,
        type && `Type: ${type}`,
    ].filter(Boolean)

    const applyRecentSearch = (entry) => {
        setSearch(entry.search || '')
        setLocation(entry.location || '')
        setType(entry.type || '')
        updateSearchParams({
            nextSearch: entry.search || '',
            nextLocation: entry.location || '',
            nextType: entry.type || '',
        })
        setFeedback(`Applied recent search: ${entry.label}`)
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

            <div className="jobs-body">
                {/* Main job list */}
                <div className="jobs-main">
                    {feedback && <p className="jobs-feedback">{feedback}</p>}
                    {hasActiveFilters && (
                        <div className="active-filters">
                            {activeFilters.map((filter) => (
                                <span key={filter} className="filter-chip">{filter}</span>
                            ))}
                        </div>
                    )}
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
                        <p className="tracker-summary">
                            {savedJobs.length} saved job{savedJobs.length === 1 ? '' : 's'}
                        </p>

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
                            <span>🧭</span>
                            <h3>Recent Searches</h3>
                        </div>
                        <p className="sidebar-subtitle">Jump back into earlier filters</p>

                        {recentSearches.length === 0 ? (
                            <div className="sidebar-empty">
                                <p>Your recent searches will appear here.</p>
                            </div>
                        ) : (
                            <div className="recent-search-list">
                                {recentSearches.map((entry) => (
                                    <button
                                        key={`${entry.label}-${entry.search}-${entry.location}-${entry.type}`}
                                        type="button"
                                        className="recent-search-item"
                                        onClick={() => applyRecentSearch(entry)}
                                    >
                                        {entry.label}
                                    </button>
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

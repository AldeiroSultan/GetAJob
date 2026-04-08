import { Link } from 'react-router-dom'
import { MapPin, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react'
import '../styles/JobCard.css'

function JobCard({ job, onSave, isSaved }) {
    return (
        <div className="job-card">
            <div className="job-card-header">
                <div className="job-company-logo">
                    {job.company?.charAt(0).toUpperCase()}
                </div>
                <div className="job-card-title-group">
                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                </div>
                <button
                    onClick={() => onSave(job)}
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    title={isSaved ? 'Unsave job' : 'Save job'}
                >
                    {isSaved ? <BookmarkCheck size={16} color="#7c3aed" /> : <Bookmark size={16} color="#7c3aed" />}
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
            </div>

            <div className="job-card-meta">
                <span className="job-location"><MapPin size={16} color="#999" /> {job.location}</span>
                <span className="job-salary"><DollarSign size={16} color="#999" /> {job.salary || 'Not specified'}</span>
                <span className={`job-type ${job.type}`}>{job.type}</span>
            </div>

            <p className="job-description">
                {job.description?.length > 100
                    ? job.description.substring(0, 100) + '...'
                    : job.description}
            </p>

            <div className="job-card-footer">
                <span className="job-date">
                    {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link to={`/jobs/${job._id}`} className="job-view-btn">
                    View Job
                </Link>
            </div>
        </div>
    )
}

export default JobCard
import { Link } from 'react-router-dom'
import '../styles/JobCard.css'

function JobCard({ job }) {
    return (
        <div className="job-card">
            <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className={`job-type ${job.type}`}>{job.type}</span>
            </div>
            <p className="job-company">{job.company}</p>
            <p className="job-location">📍 {job.location}</p>
            <p className="job-salary">💰 {job.salary}</p>
            <p className="job-description">
                {job.description.length > 120
                    ? job.description.substring(0, 120) + '...'
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
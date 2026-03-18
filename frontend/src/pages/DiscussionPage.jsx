import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Discussion.css'

function DiscussionPage() {
    const { jobId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchJob()
        fetchComments()
    }, [jobId])

    const fetchJob = async () => {
        try {
            const res = await fetch(`/api/jobs/${jobId}`)
            const data = await res.json()
            setJob(data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/discussion/${jobId}/comments`)
            const data = await res.json()
            setComments(Array.isArray(data) ? data : [])
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const handlePost = async (e) => {
        e.preventDefault()
        if (!user) {
            navigate('/login')
            return
        }
        setPosting(true)
        setError('')

        try {
            const res = await fetch(`/api/discussion/${jobId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ content: newComment }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                setPosting(false)
                return
            }

            setComments([...comments, data])
            setNewComment('')
        } catch (err) {
            setError('Something went wrong')
        }
        setPosting(false)
    }

    const handleDelete = async (commentId) => {
        try {
            const res = await fetch(`/api/discussion/${jobId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            })
            if (res.ok) {
                setComments(comments.filter(c => c._id !== commentId))
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="discussion-page">
            <div className="discussion-container">
                <Link to={`/jobs/${jobId}`} className="back-link">
                    ← Back to Job
                </Link>

                {job && (
                    <div className="discussion-header">
                        <h1>Discussion</h1>
                        <p>{job.title} at {job.company}</p>
                    </div>
                )}

                {loading ? (
                    <p>Loading comments...</p>
                ) : (
                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">
                                No comments yet. Be the first to ask a question!
                            </p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment._id} className="comment-card">
                                    <div className="comment-header">
                                        <div>
                                            <span className="comment-author">
                                                {comment.author?.name}
                                            </span>
                                            <span className="comment-role">
                                                {comment.author?.role}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span className="comment-date">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                            {user && (user._id === comment.author?._id || user.role === 'admin') && (
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className="delete-comment-btn"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="comment-content">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="comment-form-section">
                    {user ? (
                        <form onSubmit={handlePost}>
                            <h3>Leave a Comment</h3>
                            {error && <p className="comment-error">{error}</p>}
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Ask a question or leave a comment..."
                                rows={4}
                                required
                                className="comment-textarea"
                            />
                            <button
                                type="submit"
                                disabled={posting}
                                className="comment-submit-btn"
                            >
                                {posting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>
                    ) : (
                        <div className="login-prompt">
                            <p>You need to be logged in to comment.</p>
                            <Link to="/login" className="login-prompt-btn">
                                Login to Comment
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DiscussionPage
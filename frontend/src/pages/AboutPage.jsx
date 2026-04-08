import { Link } from 'react-router-dom'

function AboutPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px' }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '48px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h1 style={{ fontSize: '32px', color: '#1a1a2e', marginBottom: '16px' }}>About GetAJob</h1>
                <p style={{ color: '#555', lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                    GetAJob is a job portal built by Team 23 as part of COSC 360 at UBC. Our goal is to connect
                    job seekers with employers in a simple, clean, and efficient platform.
                </p>
                <p style={{ color: '#555', lineHeight: '1.8', fontSize: '16px', marginBottom: '20px' }}>
                    Whether you're looking for your first job, a career change, or trying to hire great talent,
                    GetAJob makes the process straightforward.
                </p>

                <h2 style={{ fontSize: '22px', color: '#1a1a2e', marginBottom: '12px', marginTop: '32px' }}>
                    Features
                </h2>
                <ul style={{ color: '#555', lineHeight: '2', fontSize: '15px', paddingLeft: '20px' }}>
                    <li>Browse and search job listings by title, location, and job type</li>
                    <li>Apply to jobs with an optional cover letter</li>
                    <li>Employer dashboard to post and manage job listings</li>
                    <li>Discussion forum on each job post</li>
                    <li>Admin panel to manage users and listings</li>
                    <li>Track your submitted applications from your profile</li>
                </ul>

                <h2 style={{ fontSize: '22px', color: '#1a1a2e', marginBottom: '12px', marginTop: '32px' }}>
                    How It Works
                </h2>
                <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', marginBottom: '12px' }}>
                    <strong>Job Seekers</strong> — Create a free account, browse available listings, and apply
                    directly through the platform. Track all your applications from your profile page.
                </p>
                <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', marginBottom: '12px' }}>
                    <strong>Employers</strong> — Register as an employer, post job listings with full details,
                    and review applicants from your dashboard.
                </p>
                <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px' }}>
                    <strong>Guests</strong> — Browse all job listings and read discussions without an account.
                    Sign up when you're ready to apply.
                </p>
            

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Link
                        to="/jobs"
                        style={{ background: '#4a90e2', color: 'white', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}
                    >
                        Browse Jobs
                    </Link>
                    <Link
                        to="/register"
                        style={{ background: 'white', color: '#4a90e2', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '15px', border: '2px solid #4a90e2' }}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
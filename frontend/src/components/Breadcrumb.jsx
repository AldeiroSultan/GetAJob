import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

function Breadcrumb() {
    const location = useLocation()

    const hidden = ['/', '/login', '/register']
    if (hidden.includes(location.pathname)) return null

    const pathMap = {
        'jobs': 'Browse Jobs',
        'profile': 'Profile',
        'about': 'About',
        'contact': 'Contact',
        'discussion': 'Discussion',
        'employer': 'Employer',
        'dashboard': 'Dashboard',
        'post-job': 'Post Job',
        'admin': 'Admin',
        'users': 'Manage Users',
        'jobs-admin': 'Manage Jobs',
    }

    const segments = location.pathname.split('/').filter(Boolean)

    return (
        <div style={{
            background: '#1a1a2e',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
        }}>
            <Link
                to="/"
                style={{ color: '#a78bfa', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
                <Home size={13} />
            </Link>

            {segments.map((seg, i) => {
                const path = '/' + segments.slice(0, i + 1).join('/')
                const label = pathMap[seg] || seg
                const isLast = i === segments.length - 1

                return (
                    <span key={path} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
                        {isLast ? (
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>{label}</span>
                        ) : (
                            <Link
                                to={path}
                                style={{ color: '#a78bfa', textDecoration: 'none' }}
                            >
                                {label}
                            </Link>
                        )}
                    </span>
                )
            })}
        </div>
    )
}

export default Breadcrumb
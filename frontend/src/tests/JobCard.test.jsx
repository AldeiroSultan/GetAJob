import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import JobCard from '../components/JobCard'

const mockJob = {
    _id: '123abc',
    title: 'Frontend Developer',
    company: 'Test Company',
    location: 'Vancouver, BC',
    salary: '$80,000',
    type: 'full-time',
    description: 'A great job opportunity for developers.',
    createdAt: new Date().toISOString()
}

const renderJobCard = () => render(
    <MemoryRouter>
        <JobCard job={mockJob} onSave={() => {}} isSaved={false} />
    </MemoryRouter>
)

describe('JobCard Component', () => {
    test('renders job title', () => {
        renderJobCard()
        expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    })

    test('renders company name', () => {
        renderJobCard()
        expect(screen.getByText('Test Company')).toBeInTheDocument()
    })

    test('renders job location', () => {
        renderJobCard()
        expect(screen.getByText(/Vancouver, BC/i)).toBeInTheDocument()
    })

    test('renders job type badge', () => {
        renderJobCard()
        expect(screen.getByText('full-time')).toBeInTheDocument()
    })

    test('renders view job link', () => {
        renderJobCard()
        expect(screen.getByText(/view job/i)).toBeInTheDocument()
    })

    test('renders save button', () => {
        renderJobCard()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RegisterPage from '../pages/RegisterPage'

// mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: vi.fn(),
        user: null,
    })
}))

const renderRegister = () => render(
    <MemoryRouter>
        <RegisterPage />
    </MemoryRouter>
)

describe('Register Page', () => {
    test('renders the create account heading', () => {
        renderRegister()
        expect(screen.getByRole('heading', {name: 'Create Account'})).toBeInTheDocument()
    })

    test('renders full name input', () => {
        renderRegister()
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    })

    test('renders email input', () => {
        renderRegister()
        expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
    })

    test('renders password input', () => {
        renderRegister()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })

    test('renders profile picture file input', () => {
        renderRegister()
        expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument()
    })

    test('renders role selector', () => {
        renderRegister()
        expect(screen.getByLabelText(/i am a/i)).toBeInTheDocument()
    })

    test('renders create account button', () => {
        renderRegister()
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    test('renders link to login page', () => {
        renderRegister()
        expect(screen.getByText(/login/i)).toBeInTheDocument()
    })
})

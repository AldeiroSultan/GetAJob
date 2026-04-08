import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginPage from '../pages/LoginPage'

// mock AuthContext so LoginPage doesn't crash without a real provider
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: vi.fn(),
        user: null,
    })
}))

const renderLogin = () => render(
    <MemoryRouter>
        <LoginPage />
    </MemoryRouter>
)

describe('Login Page', () => {
    test('renders the welcome heading', () => {
        renderLogin()
        expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    })

    test('renders email input', () => {
        renderLogin()
        expect(screen.getByPlaceholderText('john@email.com')).toBeInTheDocument()
    })

    test('renders password input', () => {
        renderLogin()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })

    test('renders login button', () => {
        renderLogin()
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    test('renders link to register page', () => {
        renderLogin()
        expect(screen.getByText(/register/i)).toBeInTheDocument()
    })
})

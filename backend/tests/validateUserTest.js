const validateUser = require('../utils/validateUser')

describe('User Validation', () => {
    test('returns error if fields are missing', () => {
        const result = validateUser({ name: 'John' })
        expect(result).toBe('All fields are required')
    })

    test('returns error if password is too short', () => {
        const result = validateUser({ name: 'John', email: 'john@test.com', password: '123' })
        expect(result).toBe('Password must be at least 6 characters')
    })

    test('returns error if email is invalid', () => {
        const result = validateUser({ name: 'John', email: 'notanemail', password: 'password123' })
        expect(result).toBe('Invalid email address')
    })

    test('returns null if all fields are valid', () => {
        const result = validateUser({ name: 'John', email: 'john@test.com', password: 'password123' })
        expect(result).toBeNull()
    })
})
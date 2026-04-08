const {
    validateRegisterInput,
    validateLoginInput,
    validateProfileInput,
    validateJobInput,
    validateContactInput,
} = require('../utils/validation');

describe('Validation Utils', () => {
    test('register validation rejects missing fields', () => {
        expect(validateRegisterInput({ name: 'John' })).toBe('All fields are required');
    });

    test('register validation rejects invalid email', () => {
        expect(
            validateRegisterInput({ name: 'John', email: 'bad-email', password: 'password123', confirmPassword: 'password123' })
        ).toBe('Invalid email address');
    });

    test('register validation rejects mismatched confirmation', () => {
        expect(
            validateRegisterInput({ name: 'John', email: 'john@test.com', password: 'password123', confirmPassword: 'password321' })
        ).toBe('Passwords do not match');
    });

    test('profile validation allows blank password but requires valid email', () => {
        expect(
            validateProfileInput({ name: 'John', email: 'john@test.com', password: '' })
        ).toBeNull();
    });

    test('login validation rejects invalid email', () => {
        expect(validateLoginInput({ email: 'bad-email', password: 'secret123' })).toBe('Invalid email address');
    });

    test('job validation enforces description length', () => {
        expect(
            validateJobInput({
                title: 'Frontend Developer',
                company: 'TechSoft',
                location: 'Vancouver',
                description: 'Too short',
            })
        ).toBe('Job description must be at least 20 characters');
    });

    test('contact validation enforces message length', () => {
        expect(
            validateContactInput({ name: 'John', email: 'john@test.com', message: 'short' })
        ).toBe('Message must be at least 10 characters');
    });
});

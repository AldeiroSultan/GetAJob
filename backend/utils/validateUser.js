function validateUser({ name, email, password }) {
    if (!name || !email || !password) {
        return 'All fields are required'
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters'
    }
    if (!email.includes('@')) {
        return 'Invalid email address'
    }
    return null
}

module.exports = validateUser
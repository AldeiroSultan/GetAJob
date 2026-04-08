const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const {
    normalizePayload,
    validateRegisterInput,
    validateLoginInput,
} = require('../utils/validation');

// Auth service - handles authentication business logic

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (userData, file) => {
    const { name, email, password, confirmPassword, role } = normalizePayload(userData);

    // Validate input
    const validationError = validateRegisterInput({ name, email, password, confirmPassword });
    if (validationError) {
        throw new Error(validationError);
    }

    // Check if user exists
    const userExists = await userRepository.findUserByEmail(email);
    if (userExists) {
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile image
    const profileImage = file ? `/uploads/${file.filename}` : '';

    // Create user
    const user = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        role: role || 'applicant',
        profileImage,
    });

    // Return user data with token
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    };
};

const loginUser = async (credentials) => {
    const { email, password } = normalizePayload(credentials);

    // Validate input
    const validationError = validateLoginInput({ email, password });
    if (validationError) {
        throw new Error(validationError);
    }

    // Find user with password
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check if user is disabled
    if (user.isDisabled) {
        const error = new Error('Your account has been disabled');
        error.statusCode = 403;
        throw error;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Return user data with token
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    };
};

module.exports = {
    registerUser,
    loginUser,
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trimValue = (value) => (typeof value === 'string' ? value.trim() : value);

const normalizePayload = (payload = {}) =>
    Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [key, trimValue(value)])
    );

const validateRegisterInput = (payload = {}) => {
    const data = normalizePayload(payload);

    if (!data.name || !data.email || !data.password) {
        return 'All fields are required';
    }

    if (!EMAIL_REGEX.test(data.email)) {
        return 'Invalid email address';
    }

    if (data.password.length < 6) {
        return 'Password must be at least 6 characters';
    }

    return null;
};

const validateLoginInput = (payload = {}) => {
    const data = normalizePayload(payload);

    if (!data.email || !data.password) {
        return 'All fields are required';
    }

    if (!EMAIL_REGEX.test(data.email)) {
        return 'Invalid email address';
    }

    return null;
};

const validateProfileInput = (payload = {}) => {
    const data = normalizePayload(payload);

    if (!data.name || !data.email) {
        return 'Name and email are required';
    }

    if (!EMAIL_REGEX.test(data.email)) {
        return 'Invalid email address';
    }

    if (data.password && data.password.length < 6) {
        return 'Password must be at least 6 characters';
    }

    return null;
};

const validateJobInput = (payload = {}) => {
    const data = normalizePayload(payload);

    if (!data.title || !data.company || !data.location || !data.description) {
        return 'Please fill in all required fields';
    }

    if (data.description.length < 20) {
        return 'Job description must be at least 20 characters';
    }

    if (data.requirements && data.requirements.length > 0 && data.requirements.length < 10) {
        return 'Requirements must be at least 10 characters or left blank';
    }

    return null;
};

const validateContactInput = (payload = {}) => {
    const data = normalizePayload(payload);

    if (!data.name || !data.email || !data.message) {
        return 'All fields are required';
    }

    if (!EMAIL_REGEX.test(data.email)) {
        return 'Invalid email address';
    }

    if (data.message.length < 10) {
        return 'Message must be at least 10 characters';
    }

    return null;
};

module.exports = {
    normalizePayload,
    validateRegisterInput,
    validateLoginInput,
    validateProfileInput,
    validateJobInput,
    validateContactInput,
};

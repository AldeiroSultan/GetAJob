export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function trimFormValues(formData) {
    return Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
            key,
            typeof value === 'string' ? value.trim() : value,
        ])
    );
}

export function validateRegisterForm(formData) {
    const errors = {};

    if (!formData.name.trim()) {
        errors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
        errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
}

export function validateLoginForm(formData) {
    const errors = {};

    if (!formData.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
        errors.password = 'Password is required.';
    }

    return errors;
}

export function validateProfileForm(formData) {
    const errors = {};

    if (!formData.name.trim()) {
        errors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (formData.password && formData.password.length < 6) {
        errors.password = 'New password must be at least 6 characters.';
    }

    return errors;
}

export function validateContactForm(formData) {
    const errors = {};

    if (!formData.name.trim()) {
        errors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (!formData.message.trim()) {
        errors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters.';
    }

    return errors;
}

export function validateJobForm(formData) {
    const errors = {};

    if (!formData.title.trim()) {
        errors.title = 'Job title is required.';
    }

    if (!formData.company.trim()) {
        errors.company = 'Company name is required.';
    }

    if (!formData.location.trim()) {
        errors.location = 'Location is required.';
    }

    if (!formData.description.trim()) {
        errors.description = 'Job description is required.';
    } else if (formData.description.trim().length < 20) {
        errors.description = 'Description must be at least 20 characters.';
    }

    if (formData.salary && formData.salary.trim().length < 2) {
        errors.salary = 'Enter a valid salary or leave it blank.';
    }

    if (formData.requirements && formData.requirements.trim().length > 0 && formData.requirements.trim().length < 10) {
        errors.requirements = 'Requirements should be at least 10 characters or left blank.';
    }

    return errors;
}

const { normalizePayload, validateContactInput } = require('../utils/validation');

// Contact service - handles contact form business logic

const submitContactForm = (formData) => {
    const { name, email, message } = normalizePayload(formData);

    // Validate input
    const validationError = validateContactInput({ name, email, message });
    if (validationError) {
        throw new Error(validationError);
    }

    // In a real application, this would send an email or save to database
    // For now, just return success message
    return `Thanks ${name} your message has been recieved`;
};

module.exports = {
    submitContactForm,
};
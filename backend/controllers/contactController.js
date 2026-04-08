const contactService = require('../services/contactService');

// Contact controller - handles HTTP request/response coordination

const SubmitContactForm = (req, res) => {
    try {
        const message = contactService.submitContactForm(req.body);
        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { SubmitContactForm };
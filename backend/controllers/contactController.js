const { normalizePayload, validateContactInput } = require('../utils/validation');

const SubmitContactForm = (req,res) => {
const {name,email,message} = normalizePayload(req.body)
const validationError = validateContactInput({ name, email, message })

if (validationError) {
    return res.status(400).json({message: validationError})
}

res.status(200).json({
    message: `Thanks ${name} your message has been recieved `
})
}
module.exports = {SubmitContactForm}

const express = require('express')
const router =express.Router()
const {SubmitContactForm} = require('../controllers/contactController')

router.post('/contact', SubmitContactForm)

module.exports = router 
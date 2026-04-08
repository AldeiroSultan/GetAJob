const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const dns = require('dns')

dns.setServers(['8.8.8.8', '8.8.4.4'])
dotenv.config({ path: '../.env' })

const User = require('../models/User')

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')

        const existing = await User.findOne({ email: 'admin@getajob.com' })
        if (existing) {
            console.log('Admin already exists')
            process.exit()
        }

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash('admin123', salt)

        await User.create({
            name: 'Admin',
            email: 'admin@getajob.com',
            password: hashed,
            role: 'admin',
            isDisabled: false,
        })

        console.log('Admin created: admin@getajob.com / admin123')
        process.exit()
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

seedAdmin()
const request = require('supertest')
const app = require('../server')

describe('Jobs Routes', () => {
    test('GET /api/jobs - returns an array of jobs', async () => {
        const res = await request(app).get('/api/jobs')

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    test('GET /api/jobs/:id - returns 404 for invalid job id', async () => {
        const res = await request(app).get('/api/jobs/000000000000000000000000')

        expect(res.statusCode).toBe(404)
    })

    test('POST /api/jobs - returns 401 if no token provided', async () => {
        const res = await request(app)
            .post('/api/jobs')
            .send({
                title: 'Test Job',
                company: 'Test Co',
                location: 'Vancouver, BC',
                description: 'A test job posting'
            })

        expect(res.statusCode).toBe(401)
    })
})

jest.mock('../config/db', () => jest.fn());
jest.mock('../models/Job', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
}));

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Job = require('../models/Job');
const jobs = require('../jobs.json');

describe('Jobs Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mongoose.connection.readyState = 0;
    });

    test('GET /api/jobs returns JSON fallback jobs when database is unavailable', async () => {
        const res = await request(app).get('/api/jobs');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(jobs.length);
        expect(res.body[0]._id).toBe(jobs[0]._id);
        expect(Job.find).not.toHaveBeenCalled();
    });

    test('GET /api/jobs filters JSON fallback jobs by search, location, and type', async () => {
        const res = await request(app)
            .get('/api/jobs')
            .query({ search: 'frontend', location: 'vancouver', type: 'full-time' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('Frontend Developer');
    });

    test('GET /api/jobs/:id returns JSON job for non-ObjectId fallback IDs', async () => {
        const res = await request(app).get('/api/jobs/1');

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe('1');
        expect(res.body.title).toBe('Frontend Developer');
    });

    test('GET /api/jobs/:id returns 404 for unknown fallback IDs', async () => {
        const res = await request(app).get('/api/jobs/not-a-real-id');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Job not found');
    });

    test('POST /api/jobs returns 401 if no token provided', async () => {
        const res = await request(app)
            .post('/api/jobs')
            .send({
                title: 'Test Job',
                company: 'Test Co',
                location: 'Vancouver, BC',
                description: 'A test job posting'
            });

        expect(res.statusCode).toBe(401);
    });
});

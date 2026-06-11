const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  test('POST /api/auth/register - success', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: `testauth${Date.now()}@test.com`,
      password: '123456',
      role: 'parent'
    });
  expect(res.statusCode).toBe(201);
});

  test('POST /api/auth/login - success', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'reem@test.com',
        password: 'Reem@123!'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'reem@test.com',
        password: 'wrongpass'
      });
    expect(res.statusCode).toBe(401);
  });
});

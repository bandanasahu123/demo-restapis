const request = require('supertest')
const app = require('../index.js')

describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/user-login')
      .send({
        username: "bandana.sahu@tarento.com",
        password: '123456',
      })
    expect(res.statusCode).toEqual(200)
    // expect(res.body).toHaveProperty('post')
  })
})
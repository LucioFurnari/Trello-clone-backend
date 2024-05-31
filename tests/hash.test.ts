import { server } from '..'
import request from 'supertest'

describe('Get user data', function() {
  it('Should return a 200 status and a message', async function() {
    const response = await request(server)
      .get('/api/user')
    
    expect(response.statusCode).toBe(200)
    expect(response.body.user).toBe('User data')
  });
});

afterAll(done => {
  server.close()
  done()
})

describe('Create user with form', function() {
  it('Should create a new user', async function() {
    const response = await request(server)
      .post('/api/user')
      .send({
        username: "john",
        email: "johnOG@gmail.com",
        password: "74116"
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('User created!')
  })
})
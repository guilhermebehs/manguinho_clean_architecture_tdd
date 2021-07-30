import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Guilherme Behs',
        email: 'guilhermebehs2013@hotmail.com',
        password: '',
        passwordConfirmation: ''
      })
      .expect(201)
  })
})

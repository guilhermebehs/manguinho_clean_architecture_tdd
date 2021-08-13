import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Login Routes', () => {
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoUrl)
  })
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Guilherme Behs',
          email: 'guilhermebehs2013@hotmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(201)
    })
  })
})

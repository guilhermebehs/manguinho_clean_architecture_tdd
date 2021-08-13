import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoUrl)
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /signup', () => {
    test('Should return 201 on signup', async () => {
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
    describe('POST /login', () => {
      test('Should return 201 on login', async () => {
        const password = await hash('123', 12)
        await accountCollection.insertOne({
          name: 'Guilherme Behs',
          email: 'guilhermebehs2013@hotmail.com',
          password
        })
        await request(app)
          .post('/api/login')
          .send({
            email: 'guilhermebehs2013@hotmail.com',
            password: '123'
          })
          .expect(201)
      })
    })
    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'guilhermebehs2013@hotmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})

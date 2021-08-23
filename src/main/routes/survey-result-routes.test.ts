
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import request from 'supertest'

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoUrl)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})

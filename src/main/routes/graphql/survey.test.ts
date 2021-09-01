import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { makeApolloServer } from './helpers'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'

let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Guilherme Behs',
    email: 'guilhermebehs2013@hotmail.com',
    password: '123',
    role
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: { accessToken }
  })
  return accessToken
}

describe('Surveys GraphQL', () => {
  let apolloServer: ApolloServer
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoUrl)
    apolloServer = makeApolloServer()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    surveyCollection = await MongoHelper.getCollection('surveys')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('Surveys Query', () => {
    const surveysQuery = gql`
      query surveys{
        surveys{
              id
              question
              answers{
                image
                answer
              }
              date
              didAnswer
          }
      }
    `
    test('Should return surveys', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()
      await surveyCollection.insertMany([{
        question: 'any question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ],
        date: now
      }])
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveysQuery)
      expect(res.data.surveys.length).toBe(1)
      expect(res.data.surveys[0].id).toBeTruthy()
      expect(res.data.surveys[0].question).toBe('any question')
      expect(res.data.surveys[0].date).toBe(now.toISOString())
      expect(res.data.surveys[0].didAnswer).toBe(false)
      expect(res.data.surveys[0].answers).toEqual([
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ])
    })
    test('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()
      await surveyCollection.insertMany([{
        question: 'any question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ],
        date: now
      }])
      const { query } = createTestClient({
        apolloServer
      })
      const res: any = await query(surveysQuery)
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })
})

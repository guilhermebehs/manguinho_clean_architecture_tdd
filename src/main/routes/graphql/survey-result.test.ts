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

describe('SurveyResult GraphQL', () => {
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
  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
      query surveyResultQuery($surveyId: String!){
        surveyResult(surveyId: $surveyId){
              question
              answers{
                answer
                count
                percent
                isCurrentAccountAnswer
              }
              date
          }
      }
    `
    test('Should return survey result', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()
      const surveyRes = await surveyCollection.insertMany([{
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
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyRes.ops[0]._id.toString()
        }
      })
      expect(res.data.surveyResult.question).toBe('any question')
      expect(res.data.surveyResult.date).toBe(now.toISOString())
      expect(res.data.surveyResult.answers).toEqual([
        {
          answer: 'any_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })
    test('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()
      const surveyRes = await surveyCollection.insertMany([{
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
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyRes.ops[0]._id.toString()
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })
})

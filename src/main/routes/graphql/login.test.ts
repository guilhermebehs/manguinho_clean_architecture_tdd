import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { makeApolloServer } from './helpers'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'

describe('Login GraphQL', () => {
  let accountCollection: Collection
  let apolloServer: ApolloServer
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoUrl)
    apolloServer = makeApolloServer()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('Login Query', () => {
    const loginQuery = gql`
      query login($email: String!, $password: String!){
          login(email: $email, password: $password){
              accessToken
              name
          }
      }
    `
    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Guilherme Behs',
        email: 'guilhermebehs2013@hotmail.com',
        password
      })
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'guilhermebehs2013@hotmail.com',
          password: '123'
        }
      })
      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe('Guilherme Behs')
    })
  })
})

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
    test('Should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'guilhermebehs2013@hotmail.com',
          password: '123'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized')
    })
  })
  describe('SignUp Mutation', () => {
    const signupMutation = gql`
      mutation signup($email: String!, $name: String!,$password: String!, $passwordConfirmation: String!){
        signUp(email: $email,name:$name ,password: $password, passwordConfirmation: $passwordConfirmation){
              accessToken
              name
          }
      }
    `
    test('Should return an Account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signupMutation, {
        variables: {
          name: 'Guilherme Behs',
          email: 'guilhermebehs2013@hotmail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })
      expect(res.data.signUp.accessToken).toBeTruthy()
      expect(res.data.signUp.name).toBe('Guilherme Behs')
    })
    test('Should return EmailInUseError on email in use', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Guilherme Behs',
        email: 'guilhermebehs2013@hotmail.com',
        password
      })
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signupMutation, {
        variables: {
          name: 'Guilherme Behs',
          email: 'guilhermebehs2013@hotmail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Received email already in use')
    })
  })
})

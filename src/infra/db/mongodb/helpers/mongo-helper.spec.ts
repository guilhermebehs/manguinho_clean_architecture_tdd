import { MongoHelper as sut } from './mongo-helper'

describe('MongoHelper', () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URL ?? ''
    await sut.connect(url)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('Should reconnect of mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})

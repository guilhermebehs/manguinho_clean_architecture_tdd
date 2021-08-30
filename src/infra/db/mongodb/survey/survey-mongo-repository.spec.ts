import { mockAddSurveyParams } from '@/domain/tests/mock-survey'
import { mockAccountModel } from '@/domain/tests/mock-account'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from './../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection
  let surveyResultCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL ?? ''
    await MongoHelper.connect(mongoUrl)
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const account = mockAccountModel()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = result.ops[0]
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey._id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })
    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll('61297c80a916f6f81cd61f75')
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ],
        date: new Date()
      })
      const id = res.ops[0]._id
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
    })
    test('Should not load survey on empty list', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('612d20c9bc6177492e26f7e1')
      expect(survey).toBeFalsy()
    })
  })
  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ],
        date: new Date()
      })
      const id = res.ops[0]._id
      const sut = makeSut()
      const surveyExists = await sut.checkById(id)
      expect(surveyExists).toBe(true)
    })
    test('Should return false on empty list', async () => {
      const sut = makeSut()
      const surveyExists = await sut.checkById('612d20c9bc6177492e26f7e1')
      expect(surveyExists).toBe(false)
    })
  })
})

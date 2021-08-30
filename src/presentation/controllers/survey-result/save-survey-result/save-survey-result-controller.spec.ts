import { mockLoadAnswersBySurvey, mockSaveSurveyResult } from '@/presentation/tests'
import { mockSurveyResultModel } from '@/domain/tests'
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import {
  LoadAnswersBySurvey,
  SaveSurveyResult
} from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import Mockdate from 'mockdate'

type SutTypes ={
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const mockRequest = (): SaveSurveyResultController.Request => (
  {
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    accountId: 'any_account_id'
  }
)

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)
  return { sut, loadAnswersBySurveyStub, saveSurveyResultStub }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')
    await sut.handle(mockRequest())
    expect(loadAnswersSpy).toHaveBeenCalledWith('any_survey_id')
  })
  test('Should return 403 with LoadSurveyById return an empty list', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle({
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      accountId: 'any_id'
    })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 403 with an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      surveyId: 'any_survey_id',
      answer: 'wrong_answer',
      accountId: 'any_id'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: 'any_answer'
    })
  })
  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(
      {
        surveyId: 'any_survey_id',
        answer: 'any_answer',
        accountId: 'any_id'
      }
    )
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 on on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})

import { mockSurveyResultModel } from '@/domain/tests/mock-survey-result'
import { throwError } from '@/domain/tests'
import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyResult } from '@/presentation/tests/mock-survey-result'
import { mockLoadSurveyById, LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: 'any_id',
  surveyId: 'any_survey_id'
})

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return { sut, loadSurveyByIdStub, loadSurveyResultStub }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const promise = await sut.handle(mockRequest())
    expect(promise).toEqual(serverError(new Error()))
  })
  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id', mockRequest().accountId)
  })
  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const promise = await sut.handle(mockRequest())
    expect(promise).toEqual(serverError(new Error()))
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})

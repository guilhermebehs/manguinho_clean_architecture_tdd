import { mockSurveyResultModel } from '@/domain/tests/mock-survey-result'
import { throwError } from '@/domain/tests'
import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyResult } from '@/presentation/tests/mock-survey-result'
import { mockCheckSurveyById, CheckSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: 'any_id',
  surveyId: 'any_survey_id'
})

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockCheckSurveyById()
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
  test('Should call CheckSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const checkByIdSpy = jest.spyOn(loadSurveyByIdStub, 'checkById')
    await sut.handle(mockRequest())
    expect(checkByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
  test('Should return 403 if CheckSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Should return 500 if CheckSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'checkById').mockImplementationOnce(throwError)
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

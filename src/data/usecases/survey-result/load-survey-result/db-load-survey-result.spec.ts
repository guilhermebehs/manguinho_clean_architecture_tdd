import { mockSurveyResultModel } from '@/domain/tests/mock-survey-result'
import { throwError } from '@/domain/tests'
import { mockLoadSurveyResultRepository, mockLoadSurveyByIdRepository } from '@/data/tests'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import Mockdate from 'mockdate'

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyIdAndAccountId')
    await sut.load('any_survey_id', 'any_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_id')
  })
  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyIdAndAccountId').mockImplementationOnce(throwError)
    const promise = sut.load('any_survey_id', 'any_id')
    await expect(promise).rejects.toThrow()
  })
  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyIdAndAccountId').mockReturnValueOnce(Promise.resolve(null))
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load('any_survey_id', 'any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
  test('Should return survey result with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyIdAndAccountId').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.load('any_survey_id', 'any_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
  test('Should return survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id', 'any_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})

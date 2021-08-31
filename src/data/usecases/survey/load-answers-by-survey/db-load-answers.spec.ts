import { throwError, mockSurveyModel } from '@/domain/tests'
import { mockLoadAnswersBySurveyRepository } from '@/data/tests'
import { LoadAnswersBySurveyRepository } from './db-load-answers-by-survey-protocols'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)
  return { sut, loadAnswersBySurveyRepositoryStub }
}

describe('DbLoadAnswersBySurvey Usecase', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Should call LoadAnswersBySurveyRepository with correct id', async () => {
    const { loadAnswersBySurveyRepositoryStub, sut } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
    await sut.loadAnswers('any_id')
    expect(loadAnswersSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return answers on success', async () => {
    const { sut } = makeSut()
    const expectedAnswers = [mockSurveyModel().answers[0].answer, mockSurveyModel().answers[1].answer]
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual(expectedAnswers)
  })
  test('Should return empty array if LoadAnswersBySurveyRepository returns an empty', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockReturnValueOnce(Promise.resolve([]))
    const answers = await sut.loadAnswers('any_id')
    expect(answers.length).toBe(0)
  })
  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers('any')
    await expect(promise).rejects.toThrow()
  })
})

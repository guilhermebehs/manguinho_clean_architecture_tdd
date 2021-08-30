import { throwError, mockSurveyModel } from '@/domain/tests'
import { mockLoadSurveyByIdRepository } from '@/data/tests'
import { LoadSurveyByIdRepository } from './db-load-answers-by-survey-protocols'
import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}

describe('DbLoadAnswersBySurvey Usecase', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadAnswers('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return answers on success', async () => {
    const { sut } = makeSut()
    const expectedAnswers = [mockSurveyModel().answers[0].answer, mockSurveyModel().answers[1].answer]
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual(expectedAnswers)
  })
  test('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const answers = await sut.loadAnswers('any_id')
    expect(answers.length).toBe(0)
  })
  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers('any')
    await expect(promise).rejects.toThrow()
  })
})

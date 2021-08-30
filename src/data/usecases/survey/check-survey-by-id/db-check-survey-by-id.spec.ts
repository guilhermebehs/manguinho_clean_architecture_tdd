import { throwError } from '@/domain/tests'
import { mockCheckSurveyByIdRepository } from '@/data/tests'
import { CheckSurveyByIdRepository } from './db-check-survey-by-id-protocols'
import { DbCheckSurveyById } from './db-check-survey-by-id'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)
  return { sut, checkSurveyByIdRepositoryStub }
}

describe('DbCheckSurveyById Usecase', () => {
  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { checkSurveyByIdRepositoryStub, sut } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('any_id')
    expect(checkByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const surveyExists = await sut.checkById('any_id')
    expect(surveyExists).toEqual(true)
  })
  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const surveyExists = await sut.checkById('any_id')
    expect(surveyExists).toEqual(false)
  })
  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockImplementationOnce(throwError)
    const promise = sut.checkById('any')
    await expect(promise).rejects.toThrow()
  })
})

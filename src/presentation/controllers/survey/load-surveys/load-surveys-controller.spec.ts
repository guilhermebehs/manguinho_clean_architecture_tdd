import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveys } from '@/presentation/tests/mock-survey'
import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import Mockdate from 'mockdate'

type SutTypes ={
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeFakeSurveys = (): SurveyModel[] => ([
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ],
    date: new Date()
  }
])

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return { sut, loadSurveysStub }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { loadSurveysStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })
  test('Should return 204 with LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })
  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAddSurvey } from '@/presentation/tests'
import { mockValidation } from '@/validation/tests'
import { Validation, AddSurvey } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const mockRequest = (): AddSurveyController.Request => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return { sut, validationStub, addSurveyStub }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const request = mockRequest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const request = mockRequest()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({ ...request, date: new Date() })
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(noContent())
  })
})

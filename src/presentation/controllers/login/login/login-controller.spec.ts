import { mockAuthentication } from '@/presentation/tests'
import { badRequest, created, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { mockValidation } from '@/validation/tests'

import { Authentication } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { Validation } from '../signup/signup-controller-protocols'

type SutTypes ={
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}
const mockRequest = (): LoginController.Request => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(validationStub, authenticationStub)
  return { sut, validationStub, authenticationStub }
}

describe('Login Controller', () => {
  test('Should return same error as Validation if validate fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = await sut.handle(mockRequest())
    expect(httpRequest).toEqual(badRequest(new Error()))
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })
  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 201 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(created({ accessToken: 'any_token', name: 'any_name' }))
  })
  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest)
  })
})

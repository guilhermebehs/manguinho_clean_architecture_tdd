import { HttpRequest } from '@/presentation/protocols/http'
import { mockAuthentication, mockAddAccount } from '@/presentation/tests'
import { mockValidation } from '@/validation/tests'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { badRequest, created, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { SignUpController } from './signup-controller'
import {
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols'

type SutTypes ={
  sut: SignUpController
  addAccountStub: AddAccount
  authenticationStub: Authentication
  validationStub: Validation
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const sut = new SignUpController(addAccountStub, authenticationStub, validationStub)
  return { sut, addAccountStub, validationStub, authenticationStub }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { addAccountStub, sut } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 403 if AddAccount retuns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(created({ accessToken: 'any_token', name: 'any_name' }))
  })
  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})

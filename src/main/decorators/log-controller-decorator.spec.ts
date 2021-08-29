import { mockAccountModel } from '@/domain/tests/mock-account'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/data/tests'
import { created, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

type SutTypes ={
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return Promise.resolve(created(mockAccountModel()))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = mockLogErrorRepository()
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('LogController Decorator', () => {
  test('Should call controller.handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = 'any_data'
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = 'any_data'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created(mockAccountModel()))
  })
  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError()))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    await sut.handle('any_data')
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})

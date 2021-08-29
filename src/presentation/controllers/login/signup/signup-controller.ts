import { Authentication } from '@/domain/usecases/account/authentication'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import { forbidden, badRequest, created, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, AddAccount, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication,
    private readonly validation: Validation) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const isValid = await this.addAccount.add({ name, email, password })
      if (!isValid) {
        return forbidden(new EmailInUseError())
      }
      const authenticatioModel = await this.authentication.auth({ email, password })
      return created(authenticatioModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController{
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}

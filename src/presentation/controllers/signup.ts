import { AddAccount } from './../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from './../errors'
import { EmailValidator, Controller, HttpRequest, HttpResponse } from './../protocols'
import { badRequest, serverError } from './../helpers/http-helper'
export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) { return badRequest(new MissingParamError(field)) }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) { return badRequest(new InvalidParamError('passwordConfirmation')) }

      if (!this.emailIsValid(email)) { return badRequest(new InvalidParamError('email')) }

      this.addAccount.add({ name, email, password })
      return { statusCode: 0, body: null }
    } catch (e) {
      return serverError()
    }
  }

  private emailIsValid (email: string): boolean {
    return this.emailValidator.isValid(email)
  }
}

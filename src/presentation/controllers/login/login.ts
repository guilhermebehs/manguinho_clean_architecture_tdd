import { EmailValidator } from './../../protocols/email-validator'
import { badRequest } from './../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }
    if (!this.emailIsValid(email)) {
      return badRequest(new InvalidParamError('email'))
    }
    return new Promise(resolve => resolve({
      body: null,
      statusCode: 201
    }))
  }

  private emailIsValid (email: string): boolean {
    return this.emailValidator.isValid(email)
  }
}

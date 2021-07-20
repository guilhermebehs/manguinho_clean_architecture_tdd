import { InvalidParamError } from './../errors/invalid-param-error'
import { EmailValidator } from './../protocols/email-validator'
import { badRequest } from './../helpers/http-helper'
import { MissingParamError } from './../errors/missing-param-error'
import { HttpRequest, HttpResponse } from './../protocols/http'
import { Controller } from '../protocols/controller'
export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) { return badRequest(new MissingParamError(field)) }
    }
    const { email } = httpRequest.body
    if (!this.emailIsValid(email)) { return badRequest(new InvalidParamError('email')) }

    return { statusCode: 0, body: null }
  }

  private emailIsValid (email: string): boolean {
    return this.emailValidator.isValid(email)
  }
}

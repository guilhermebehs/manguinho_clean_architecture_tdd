import { EmailValidator } from './../../protocols/email-validator'
import { badRequest } from './../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    if (!body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }
    const isValid = this.emailValidator.isValid(body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return new Promise(resolve => resolve({
      body: null,
      statusCode: 201
    }))
  }
}

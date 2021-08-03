import { EmailValidator } from './../../protocols/email-validator'
import { badRequest, serverError, unauthorized } from './../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      if (!this.emailIsValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return new Promise(resolve => resolve({
        body: null,
        statusCode: 201
      }))
    } catch (e) {
      return serverError(e)
    }
  }

  private emailIsValid (email: string): boolean {
    return this.emailValidator.isValid(email)
  }
}

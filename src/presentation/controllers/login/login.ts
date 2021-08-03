import { badRequest } from './../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    if (!body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }
    return new Promise(resolve => resolve({
      body: null,
      statusCode: 201
    }))
  }
}

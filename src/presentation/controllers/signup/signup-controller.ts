import { Validation } from '../../protocols/validation'
import { Controller, HttpRequest, HttpResponse, AddAccount } from './signup-controller-protocols'
import { badRequest, created, serverError } from '../../helpers/http/http-helper'
import { Authentication } from '../login/login-controller-protocols'
export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication,
    private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({ name, email, password })
      const accessToken = await this.authentication.auth({ email, password })
      return created({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

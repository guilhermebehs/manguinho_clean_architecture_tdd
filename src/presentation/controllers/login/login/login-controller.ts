import { Validation } from '@/presentation/protocols/validation'
import { Controller, HttpRequest, HttpResponse, Authentication } from './login-controller-protocols'
import { badRequest, created, serverError, unauthorized } from '../../../helpers/http/http-helper'
export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const authenticationModel = await this.authentication.auth({ email, password })
      if (!authenticationModel) {
        return unauthorized()
      }
      return created(authenticationModel)
    } catch (e) {
      return serverError(e)
    }
  }
}

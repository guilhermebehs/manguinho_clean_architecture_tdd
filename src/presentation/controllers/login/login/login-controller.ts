import { Controller, HttpResponse, Authentication, Validation } from './login-controller-protocols'
import { badRequest, created, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
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

export namespace LoginController{
  export type Request = {
    email: string
    password: string
  }
}

import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from './../../usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(loginController)
}

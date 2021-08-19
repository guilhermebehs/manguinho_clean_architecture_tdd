import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation'
import { Controller } from '../../../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(loginController)
}

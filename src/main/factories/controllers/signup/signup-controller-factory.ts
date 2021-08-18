import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from './../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from './../../usecases/authentication/db-authentication-factory'
import { Controller } from '../../../../presentation/protocols/controller'
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeDbAuthentication(), makeSignUpValidation())
  return makeLogControllerDecorator(signUpController)
}

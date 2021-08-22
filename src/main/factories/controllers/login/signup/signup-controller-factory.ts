import { Controller } from '@/presentation/protocols/controller'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { makeLogControllerDecorator } from './../../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../../usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from './../../../usecases/authentication/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeDbAuthentication(), makeSignUpValidation())
  return makeLogControllerDecorator(signUpController)
}

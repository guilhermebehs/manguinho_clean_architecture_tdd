import { Controller } from './../../presentation/protocols/controller'
import { AccountMongoRepository } from './../../infra/db/mongodb/account-repository/account'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { SignUpController } from './../../presentation/controllers/signup/signup'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidator, addAccount)
  return new LogControllerDecorator(signUpController)
}

import { AccountMongoRepository } from './../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from './../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { makeLoginValidation } from './login-validation'
import { DbAuthentication } from './../../../data/usecases/authentication/db-authentication'
import { LogMongoRepository } from './../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from './../../../presentation/controllers/login/login-controller'
import { LogControllerDecorator } from './../../decorators/log-controller-decorator'
import { Controller } from './../../../presentation/protocols'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../config/env'
export const makeLoginController = (): Controller => {
  const salt = 12
  const logErrorRepository = new LogMongoRepository()
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(makeLoginValidation(), authentication)
  return new LogControllerDecorator(loginController, logErrorRepository)
}

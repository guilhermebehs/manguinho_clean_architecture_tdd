import { TokenGenerator } from './../../protocols/criptography/token-generator'
import { HashComparer } from './../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from './../../protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGeneratorStub: TokenGenerator
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      await this.hashComparer.compare(password, account.password)
      await this.tokenGeneratorStub.generate(account.id)
    }
    return null
  }
}

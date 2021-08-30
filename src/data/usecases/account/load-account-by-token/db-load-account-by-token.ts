import {
  LoadAccountByToken,
  Decrypter,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    let decryptedToken: string | null
    try {
      decryptedToken = await this.decrypter.decrypt(accessToken)
    } catch (e) {
      return null
    }
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}

import { AddAccount } from '@/domain/usecases/account/add-account'
import { Hasher, AddAccountRepository, CheckAccountByEmailRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const { email, password } = accountData
    const accountExists = await this.checkAccountByEmailRepository.checkByEmail(email)
    let isValid = false
    if (!accountExists) {
      const hashedPassword = await this.hasher.hash(password)
      isValid = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return isValid
  }
}

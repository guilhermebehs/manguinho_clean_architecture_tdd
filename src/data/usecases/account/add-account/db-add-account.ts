import { AccountModel } from '@/domain/models/account'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const { email, password } = accountData
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    let newAccount: AccountModel | null = null
    if (!account) {
      const hashedPassword = await this.hasher.hash(password)
      newAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return newAccount !== null
  }
}

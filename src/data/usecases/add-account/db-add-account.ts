import { AddAccount } from './../../../domain/usecases/add-account'
import { AccountModel, AddAccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { email, password } = account
    await this.loadAccountByEmailRepository.loadByEmail(email)
    const hashedPassword = await this.hasher.hash(password)
    const newAccount = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return newAccount
  }
}

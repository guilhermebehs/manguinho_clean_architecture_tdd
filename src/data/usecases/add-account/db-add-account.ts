import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'
export class DbAddAccount implements DbAddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    const hashedPassword = await this.hasher.hash(password)
    const newAccount = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return newAccount
  }
}

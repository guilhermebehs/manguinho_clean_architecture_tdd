import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'
export class DbAddAccount implements DbAddAccount {
  constructor (private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    const hashedPassword = await this.encrypter.encrypt(password)
    await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return new Promise(resolve => resolve({ name: '', email: '', id: '0', password: '' }))
  }
}

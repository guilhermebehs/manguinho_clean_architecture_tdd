import { AccountModel, AddAccountModel, Encrypter } from './db-add-account-protocols'
export class DbAddAccount implements DbAddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    await this.encrypter.encrypt(password)
    return new Promise(resolve => resolve({ name: '', email: '', id: '0', password: '' }))
  }
}

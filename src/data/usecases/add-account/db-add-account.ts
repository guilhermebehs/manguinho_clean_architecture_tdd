import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAccount, AddAccountModel } from './../../../domain/usecases/add-account'
export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async add (account: AddAccountModel): Promise<AccountModel> {
    const { password } = account
    await this.encrypter.encrypt(password)
    return new Promise(resolve => resolve({ name: '', email: '', id: '0', password: '' }))
  }
}

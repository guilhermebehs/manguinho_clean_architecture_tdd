import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/tests'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}

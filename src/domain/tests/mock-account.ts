import { Authentication } from '@/domain/usecases/account/authentication'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'

export const mockAccountModel = (): AccountModel => (
  {
    id: '61297c80a916f6f81cd61f75',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAccountModel = (): AccountModel => (
  {
    id: '61297c80a916f6f81cd61f75',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

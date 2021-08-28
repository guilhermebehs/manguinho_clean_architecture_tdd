import { AuthenticationModel } from '@/domain/models/authentication'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel | null> {
      return Promise.resolve({ accessToken: 'any_token', name: 'any_name' })
    }
  }
  return new AuthenticationStub()
}

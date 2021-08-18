import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from './../../protocols/criptography/decrypter'
describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('any_value'))
      }
    }
    const decrypter = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypter, 'decrypt')
    const sut = new DbLoadAccountByToken(decrypter)
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})

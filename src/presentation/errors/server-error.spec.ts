import { ServerError } from './server-error'

describe('ServerError', () => {
  test('Should return empty stack if no stack is provided', () => {
    const serverError = new ServerError()
    expect(serverError.stack).toBe('')
  })
  test('Should return same stack as provided', () => {
    const serverError = new ServerError('any stack')
    expect(serverError.stack).toBe('any stack')
  })
})

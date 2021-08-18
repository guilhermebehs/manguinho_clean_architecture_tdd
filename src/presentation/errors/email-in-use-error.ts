export class EmailInUseError extends Error {
  constructor () {
    super('Received email already in use')
    this.name = 'EmailInUseError'
  }
}

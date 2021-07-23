import { EmailValidator } from './../protocols/email-validator'
export class EMailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}

import { EmailValidator } from './../protocols/email-validator'
import validator from 'validator'

export class EMailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}

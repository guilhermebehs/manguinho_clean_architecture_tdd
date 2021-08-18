import { badRequest } from './../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const error = this.validation.validate(body)
    if (error) {
      return badRequest(error)
    }
    return new Promise(resolve => resolve({ statusCode: 500, body: null }))
  }
}

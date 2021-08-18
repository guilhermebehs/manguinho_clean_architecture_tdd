import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    this.validation.validate(body)
    return new Promise(resolve => resolve({ statusCode: 500, body: null }))
  }
}

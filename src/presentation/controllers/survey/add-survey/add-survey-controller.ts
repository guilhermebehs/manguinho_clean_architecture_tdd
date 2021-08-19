import { badRequest, serverError, noContent } from './../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation, AddSurvey } from './add-survey-controller-protocols'
export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers, date } = body
      await this.addSurvey.add({
        question,
        answers,
        date
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

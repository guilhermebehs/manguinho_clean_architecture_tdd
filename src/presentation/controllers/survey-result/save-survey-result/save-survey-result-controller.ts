import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answerWasFound = survey.answers.find((a) => a.answer === answer)
        if (!answerWasFound) {
          return forbidden(new InvalidParamError('answer'))
        }
        await this.saveSurveyResult.save(
          {
            accountId: httpRequest.accountId ?? '',
            answer,
            surveyId,
            date: new Date()
          }
        )
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }
}

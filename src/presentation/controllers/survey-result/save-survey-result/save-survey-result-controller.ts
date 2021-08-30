import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, LoadAnswersBySurvey, SaveSurveyResult } from './save-survey-result-controller-protocols'
export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request

      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId)
      if (!answers.length) {
        return forbidden(new InvalidParamError('surveyId'))
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.save(
        {
          accountId: accountId,
          answer,
          surveyId,
          date: new Date()
        }
      )
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController{
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}

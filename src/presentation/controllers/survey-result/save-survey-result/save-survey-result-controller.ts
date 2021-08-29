import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answerWasFound = survey.answers.find((a) => a.answer === answer)
        if (!answerWasFound) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
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

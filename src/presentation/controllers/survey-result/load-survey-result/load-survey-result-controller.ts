import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, CheckSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request
      const surveyExists = await this.checkSurveyById.checkById(surveyId)
      if (!surveyExists) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyResultController{
  export type Request = {
    surveyId: string
    accountId: string
  }
}

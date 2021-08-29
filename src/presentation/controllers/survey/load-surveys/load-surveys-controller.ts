import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import { Controller } from '@/presentation/protocols/controller'
import { HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'
export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request
      const surveys = await this.loadSurveys.load(accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController{
  export type Request = {
    accountId: string
  }
}

import { HttpRequest, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'
import { Controller } from '../../../protocols/controller'
export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return { statusCode: 200, body: [] }
  }
}

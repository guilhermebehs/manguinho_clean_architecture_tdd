import { SurveyModel } from '@/domain/models/survey'
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
  LoadSurveyResult
} from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result > {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyIdAndAccountId(surveyId, accountId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId) as SurveyModel
      surveyResult = {
        surveyId,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => Object.assign({}, answer,
          {
            count: 0,
            percent: 0,
            isCurrentAccountAnswer: false
          }))
      }
    }

    return surveyResult
  }
}

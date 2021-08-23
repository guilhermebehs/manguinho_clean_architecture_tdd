import {
  SaveSurveyResult,
  SaveSurveyResultRepository,
  SurveyResultModel, SaveSurveyResultModel
} from './db-save-survey-result-protocols'
export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return { accountId: '', answer: '', date: new Date(), id: '', surveyId: '' }
  }
}

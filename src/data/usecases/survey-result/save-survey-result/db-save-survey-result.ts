import {
  SaveSurveyResult,
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
  SurveyResultModel, SaveSurveyResultParams
} from './db-save-survey-result-protocols'
export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyIdAndAccountId(data.surveyId, data.accountId)
    return surveyResult as SurveyResultModel
  }
}

import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository{
  loadBySurveyIdAndAccountId: (surveyID: string, accountId: string) => Promise<SurveyResultModel | null>
}

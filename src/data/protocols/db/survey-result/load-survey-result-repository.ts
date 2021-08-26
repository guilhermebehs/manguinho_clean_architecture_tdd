import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository{
  loadBySurveyId: (surveyID: string) => Promise<SurveyResultModel | null>
}

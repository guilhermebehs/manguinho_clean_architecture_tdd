import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepository{
  loadBySurveyIdAndAccountId: (surveyID: string, accountId: string) => Promise<LoadSurveyResultRepository.Result>
}

export namespace LoadSurveyResultRepository{
  export type Result = SurveyResultModel | null
}

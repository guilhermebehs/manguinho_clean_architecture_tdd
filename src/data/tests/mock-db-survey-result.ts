import { mockSurveyResultModel } from '@/domain/tests/mock-survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyIdAndAccountId (surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

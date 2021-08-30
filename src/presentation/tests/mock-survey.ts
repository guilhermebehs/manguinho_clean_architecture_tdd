import { CheckSurveyById } from './../../domain/usecases/survey/check-survey-by-id'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { mockSurveyModels, mockSurveyModel } from '@/domain/tests'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels())
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
    async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
      return Promise.resolve(mockSurveyModel().answers.map(a => a.answer))
    }
  }
  return new LoadAnswersBySurveyStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (id: string): Promise<CheckSurveyById.Result> {
      return Promise.resolve(true)
    }
  }
  return new CheckSurveyByIdStub()
}

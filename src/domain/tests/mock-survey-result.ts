import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel =>
  ({
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        count: 4,
        percent: 40
      },
      {
        answer: 'other_answer',
        image: 'any_image',
        count: 6,
        percent: 60
      }
    ],
    date: new Date()
  })

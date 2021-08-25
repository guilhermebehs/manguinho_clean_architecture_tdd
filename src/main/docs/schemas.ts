import {
  signupParamsSchema,
  errorSchema,
  loginParamsSchema,
  accountSchema,
  surveyAnswerSchema,
  surveysSchema,
  surveySchema,
  addSurveyParamsSchema,
  surveyResultSchema,
  saveSurveyResultParamsSchema,
  surveyResultAnswerSchema
} from './schemas/'

export default {
  account: accountSchema,
  signupParams: signupParamsSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  surveyAnswer: surveyAnswerSchema,
  addSurveyParams: addSurveyParamsSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema
}

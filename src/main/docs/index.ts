import {
  signupParamsSchema,
  errorSchema,
  loginParamsSchema,
  accountSchema,
  surveyAnswerSchema,
  surveysSchema,
  surveySchema,
  apiKeAuthSchema,
  addSurveyParamsSchema,
  surveyResultSchema,
  saveSurveyResultParamsSchema
} from './schemas'
import { loginPath, signupPath, surveysPath, surveyResultPath } from './paths'
import { badRequest, serverError, unauthorized, notFound, forbidden } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Api do curso do Mango para realizer enquetes entre desenvolvedores',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signupPath,
    '/surveys': surveysPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    signupParams: signupParamsSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveyAnswer: surveyAnswerSchema,
    addSurveyParams: addSurveyParamsSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    saveSurveyResultParams: saveSurveyResultParamsSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden
  }
}

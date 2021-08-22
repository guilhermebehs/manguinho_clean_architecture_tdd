import { auth } from './../middlewares/auth'
import { adminAuth } from './../middlewares/admin-auth'
import { makeLoadSurveysController } from './../factories/controllers/survey/load-surveys/add-survey-controller-factory'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}

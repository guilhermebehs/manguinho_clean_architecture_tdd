import { makeDbLoadSurveyResultFactory } from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result-factory'
import { makeDbCheckSurveyByIdFactory } from '@/main/factories/usecases/survey/check-survey-by-id/db-check-survey-by-id-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const saveSurveyResultController = new LoadSurveyResultController(
    makeDbCheckSurveyByIdFactory(),
    makeDbLoadSurveyResultFactory()
  )
  return makeLogControllerDecorator(saveSurveyResultController)
}

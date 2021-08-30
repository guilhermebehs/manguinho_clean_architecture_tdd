import { makeDbLoadAnswersBySurveyFactory } from '@/main/factories/usecases/survey/load-answers-by-survey/db-load-survey-by-id-factory'
import { makeDbSaveSurveyResultFactory } from '@/main/factories/usecases/survey-result/save-survey-result/db-save-survey-result-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(
    makeDbLoadAnswersBySurveyFactory(),
    makeDbSaveSurveyResultFactory()
  )
  return makeLogControllerDecorator(saveSurveyResultController)
}

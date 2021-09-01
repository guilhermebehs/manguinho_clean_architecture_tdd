import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'
import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'

export default {
  Query: {
    surveyResult: async (parent: any, args: any) =>
      adaptResolver(makeLoadSurveyResultController(), args)
  },
  Mutation: {
    saveSurveyResult: async (parent: any, args: any) =>
      adaptResolver(makeSaveSurveyResultController(), args)
  }

}

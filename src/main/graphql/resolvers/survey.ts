import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'

export default {
  Query: {
    surveys: async (parent: any, args: any, context: any) =>
      adaptResolver(makeLoadSurveysController(), args, context)
  }

}

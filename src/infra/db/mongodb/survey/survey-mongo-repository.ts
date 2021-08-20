import { LoadSurveysRepository } from './../../../../data/protocols/db/survey/load-surveys-repository'
import { MongoHelper } from './../helpers/mongo-helper'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { SurveyModel } from '../../../../domain/models/survey'
export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}

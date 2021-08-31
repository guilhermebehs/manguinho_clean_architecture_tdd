import { gql } from 'apollo-server-express'

export default gql`
  extend type Query{
      surveys: [Survey!]!
  }
  type Survey{
      id: ID!
      question: String!
      date: DateTime!
      didAnswer: Boolean
      answers: [SurveyAnswer!]!
  }

  type SurveyAnswer {
     image: String
     answer: String!
  }
 `

import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { GraphQLError } from 'graphql'
const handleErrors = (response: any, errors: readonly GraphQLError[] | undefined): void => {
  errors?.forEach(error => {
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400
      response.data = undefined
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
      response.data = undefined
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
      response.data = undefined
    } else {
      response.http.status = 500
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].includes(errorName)
}
export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [
      {
        requestDidStart: async () => ({

          willSendResponse: async ({ response, errors }) => handleErrors(response, errors)

        })
      }
    ]
  })
  await server.start()
  server.applyMiddleware({ app })
}

import { apiKeAuthSchema } from './schemas/api-key-auth-schema'
import { badRequest, serverError, unauthorized, notFound, forbidden } from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeAuthSchema
  },
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden

}

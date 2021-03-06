import express from 'express'
import setupMiddlewares from './middlewares'
import setupStaticFiles from './static-files'
import setupRoutes from './routes'
import setupSwagger from './swagger'
import setupApolloServer from './apollo-server'

const app = express()
setupApolloServer(app)
setupSwagger(app)
setupStaticFiles(app)
setupMiddlewares(app)
setupRoutes(app)
export default app

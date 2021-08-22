import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'
import 'module-alias/register'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log(`Server running in port ${env.port}`))
  })
  .catch(console.error)

import dotenv from 'dotenv'
dotenv.config()

export default {
  mongoUrl: process.env.MONGO_URL ?? '',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.SECRET ?? '1s2r3afg6'
}

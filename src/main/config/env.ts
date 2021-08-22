import dotenv from 'dotenv'
dotenv.config()

export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://root:150158@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.SECRET ?? '1s2r3afg6'
}

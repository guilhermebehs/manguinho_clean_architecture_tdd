import { Middleware } from '@/presentation/protocols'
import { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: any = {
      ...(req.headers || {}),
      accessToken: req.headers?.['x-access-token']
    }
    const response = await middleware.handle(request)
    if (response.statusCode === 200) {
      Object.assign(req, response.body)
      next()
    } else {
      res.status(response.statusCode).json({ error: response.body.message })
    }
  }
}

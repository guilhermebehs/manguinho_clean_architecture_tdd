import { HttpRequest } from '../../../presentation/protocols/http'
import { Request, Response } from 'express'
import { Controller } from '../../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 400 && httpResponse.statusCode <= 500) {
      res.status(httpResponse.statusCode).send({ error: httpResponse.body.message })
    } else {
      res.status(httpResponse.statusCode).send(httpResponse.body)
    }
  }
}

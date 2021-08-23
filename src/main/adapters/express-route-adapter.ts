import { HttpRequest } from '@/presentation/protocols/http'
import { Controller } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 400 && httpResponse.statusCode <= 500) {
      res.status(httpResponse.statusCode).send({ error: httpResponse.body.message })
    } else {
      res.status(httpResponse.statusCode).send(httpResponse.body)
    }
  }
}

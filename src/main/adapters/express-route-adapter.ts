import { Controller } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: any = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    }
    const response = await controller.handle(request)
    if (response.statusCode >= 400 && response.statusCode <= 500) {
      res.status(response.statusCode).send({ error: response.body.message })
    } else {
      res.status(response.statusCode).send(response.body)
    }
  }
}

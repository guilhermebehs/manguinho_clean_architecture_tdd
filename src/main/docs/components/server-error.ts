export const serverError = {
  description: 'Erro interno',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

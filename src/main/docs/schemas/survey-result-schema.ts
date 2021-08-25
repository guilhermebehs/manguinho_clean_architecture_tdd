export const surveyResultSchema = {
  type: 'object',
  properties: {
    questionId: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    date: {
      type: 'string'
    }
  },
  required: ['questionId', 'answers', 'date']
}

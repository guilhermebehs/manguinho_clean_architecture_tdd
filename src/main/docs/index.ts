import schemas from '.'
import paths from './paths'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Api do curso do Mango para realizer enquetes entre desenvolvedores',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths,
  schemas,
  components
}

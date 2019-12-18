const supertest = require('supertest')
const app = require('../index')

describe('Test the root path', () => {
  test('It should respond to the GET method', () => {
    return supertest(app).get('/').expect(200, 'Hello World!')
  })
})

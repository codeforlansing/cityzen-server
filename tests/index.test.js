const supertest = require('supertest')
const app = require('../src/app')
const { TestTasksBackend } = require('./test_utilities')

const DEFAULT_TEST_CONFIG = {
  tasks: {
    backend: new TestTasksBackend([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])
  }
}

describe('Test that the basic routes return dummy data', () => {
  test('GET /tasks/backend/test', async () => {
    const { body } = await supertest(await app(DEFAULT_TEST_CONFIG))
      .get('/tasks/backend/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(body).toEqual({ msg: 'testing backend ok' })
  })

  test('GET /tasks/', async () => {
    const { body } = await supertest(await app(DEFAULT_TEST_CONFIG))
      .get('/tasks/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(body).toEqual([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])
  })

  test('POST /tasks/volunteer', async () => {
    return supertest(await app(DEFAULT_TEST_CONFIG))
      .post('/tasks/volunteer')
      .send({
        email: 'example@example.com',
        taskIds: ['uuid']
      })
      .expect(201)
  })

  test.todo('POST /user/report')
})

describe('Test various utility functions', () => {
  const { merge } = require('../src/utilities')

  test('utilities.merge', () => {
    expect(merge({}, {})).toEqual({})

    expect(merge({}, { hello: 'world' })).toEqual({ hello: 'world' })

    expect(merge(
      { foo: 'bar' }, { hello: 'world' }
    )).toEqual({ hello: 'world', foo: 'bar' })

    expect(merge(
      { foo: 'bar', hello: 'friend' }, { hello: 'world' })
    ).toEqual({ hello: 'friend', foo: 'bar' })

    expect(merge(
      { foo: 'bar', hello: 'friend' }, { hello: 'world', baz: { box: 'bop' } })
    ).toEqual({ hello: 'friend', foo: 'bar', baz: { box: 'bop' } })

    expect(merge(
      { foo: 'bar', hello: 'friend', baz: { fox: 'locks' } }, { hello: 'world', baz: { box: 'bop' } })
    ).toEqual({ hello: 'friend', foo: 'bar', baz: { box: 'bop', fox: 'locks' } })
    expect(merge(
      { foo: 'bar', hello: 'friend', baz: { box: 'pop', fox: 'locks' } }, { hello: 'world', baz: { box: 'bop' } })
    ).toEqual({ hello: 'friend', foo: 'bar', baz: { box: 'pop', fox: 'locks' } })
  })
})

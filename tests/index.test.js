const supertest = require('supertest')
const app = require('../src/app')
const { loadConfig } = require('../src/config')
const MemoryTasksBackend = require('../src/memory_tasks_backend')
const MemoryUserProvider = require('../src/users/memory_provider')

describe('Test that the basic routes return dummy data', () => {
  // Jest doesn't pass command line arguments through to tests:
  // https://github.com/facebook/jest/issues/5089
  // For now, override the backend config manually.

  test('PUT /tasks/backend/', async () => {
    const backend = new MemoryTasksBackend()
    const config = loadConfig()
    config.tasks.backend.backend = backend

    const { body } = await supertest(await app(config))
      .put('/tasks/backend/')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send([{
        taskId: 'taskid',
        name: 'Task Name',
        description: 'Task description',
        status: 'todo'
      }])
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(body).toEqual([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])
  })

  test('GET /tasks/', async () => {
    const backend = new MemoryTasksBackend()
    const config = loadConfig()
    config.tasks.backend.backend = backend

    // TODO: this may cause problems in the future, because this will change what's in
    // the tasks list for subsequent tests
    await backend.setTasks([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])

    const { body } = await supertest(await app(config))
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

  test('POST /users/id/tasks/claim', async () => {
    const config = loadConfig()
    const provider = new MemoryUserProvider()
    config.users.provider.provider = provider

    await supertest(await app(config))
      .post('/users/example@example.com/tasks/unclaim')
      .send({
        tasks: ['uuid']
      })
      .expect(404)

    const user = provider.addUser('example@example.com')

    await supertest(await app(config))
      .post('/users/example@example.com/tasks/claim')
      .send({
        tasks: ['uuid']
      })
      .expect(201)

    expect(user.doesClaimTask('uuid')).toBeTruthy()
  })

  test('POST /users/id/tasks/unclaim', async () => {
    const config = loadConfig()
    const provider = new MemoryUserProvider()
    config.users.provider.provider = provider

    await supertest(await app(config))
      .post('/users/example@example.com/tasks/unclaim')
      .send({
        tasks: ['uuid']
      })
      .expect(404)

    const user = provider.addUser('example@example.com')
    user.claimTasks(['uuid'])

    expect(user.doesClaimTask('uuid')).toBeTruthy()

    await supertest(await app(config))
      .post('/users/example@example.com/tasks/unclaim')
      .send({
        tasks: ['uuid']
      })
      .expect(201)

    expect(user.doesClaimTask('uuid')).toBeFalsy()
  })

  test('GET /users/id/ missing user', async () => {
    const config = loadConfig()
    const provider = new MemoryUserProvider()
    config.users.provider.provider = provider

    await supertest(await app(config))
      .get('/users/example@example.com/tasks/unclaim')
      .expect(404)
  })

  test.todo('POST /user/report')
})

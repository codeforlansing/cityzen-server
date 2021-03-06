const supertest = require('supertest')
const app = require('../src/app')
const { loadConfig } = require('../src/config')
const MemoryTaskProvider = require('../src/tasks/memory_provider')
const MemoryUserProvider = require('../src/users/memory_provider')
const MemoryMessageProvider = require('../src/messages/memory_provider')

describe('Test that the basic routes return dummy data', () => {
  // Jest doesn't pass command line arguments through to tests:
  // https://github.com/facebook/jest/issues/5089
  // For now, override the provider config manually.

  test('PUT /tasks/provider/', async () => {
    const provider = new MemoryTaskProvider()
    const config = loadConfig()
    config.tasks.provider.provider = provider

    const { body } = await supertest(await app(config))
      .put('/tasks/provider/')
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
    const provider = new MemoryTaskProvider()
    const config = loadConfig()
    config.tasks.provider.provider = provider

    await provider.setTasks([{
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

  test('GET /users/id/ missing user', async () => {
    const config = loadConfig()
    const provider = new MemoryUserProvider()
    config.users.provider.provider = provider

    await supertest(await app(config))
      .get('/users/example@example.com/tasks/unclaim')
      .expect(404)
  })

  test('POST /user/report', async () => {
    const config = loadConfig()

    const taskProvider = new MemoryTaskProvider()
    config.tasks.provider.provider = taskProvider
    const task = {
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }

    await taskProvider.setTasks([task])

    const userProvider = new MemoryUserProvider()
    config.users.provider.provider = userProvider
    await userProvider.addUser('example@example.com')
    await supertest(await app(config))
      .post('/users/example@example.com/tasks/claim')
      .send({
        tasks: ['taskid']
      })
      .expect(201)

    const messageProvider = new MemoryMessageProvider()
    config.messages.provider.provider = messageProvider

    await supertest(await app(config))
      .post('/users/example@example.com/report')
      .expect(201)

    expect(messageProvider.messages).toEqual({
      'example@example.com': [{
        title: 'report for user example@example.com',
        message: JSON.stringify(['taskid'])
      }]
    })
  })
})

require('dotenv').config()
const convict = require('convict')

const rootRelativePathFormat = require('./root_relative_path_format')
const tasksBackendFormat = require('./tasks_backend_format')

convict.addFormat(rootRelativePathFormat)
convict.addFormat(tasksBackendFormat)

const config = convict({
  env: {
    format: ['prod', 'dev', 'test'],
    default: 'dev',
    env: 'NODE_ENV'
  },
  config: {
    doc: `
      The name of a config file in the 'config' directory.
      e.g. 'default.json'
    `,
    format: String,
    default: 'default.json',
    arg: 'config'
  },
  server: {
    port: {
      doc: `
        The port to be used when the server starts running.
      `,
      format: 'port',
      default: 3000,
      env: 'PORT'
    }
  },
  tasks: {
    prefix: {
      doc: `
        The API path used to get tasks, so for example if you wanted
        to get a listing of all the tasks the application knows about,
        it would be at /tasks.
      `,
      format: 'root-relative-path',
      default: '/tasks'
    },
    backendPrefix: {
      doc: `
        The prefix where additional backend endpoints will be mounted.
        If backend.init() returns an express.Router(), then it will be
        mounted at /tasks/backend. This may be used for setting up
        backend specific endpoints or Oauth callbacks, etc.
      `,
      format: 'root-relative-path',
      default: '/tasks/backend'
    },
    backend: {
      doc: `
        The name of the task backend service to be used for the API.
        Use one of: ${tasksBackendFormat.values.join(', ')}
      `,
      format: 'tasks-backend',
      default: 'none'
    }
  }
})

const configFile = config.get('config')
config.loadFile(`./config/${configFile}`)
config.validate({ allowed: 'strict' })

module.exports = config.getProperties()

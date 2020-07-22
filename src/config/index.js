require('dotenv').config()
const convict = require('convict')
const TaskProvider = require('../tasks')
const UserProvider = require('../users')
const MessageProvider = require('../messages')
const path = require('path')

const rootRelativePathFormat = require('./root_relative_path_format')
const taskProviderFormat = require('./task_provider_format')
const userProviderFormat = require('./user_provider_format')
const messageProviderFormat = require('./message_provider_format.js')

convict.addFormat(rootRelativePathFormat)
convict.addFormat(taskProviderFormat)
convict.addFormat(userProviderFormat)
convict.addFormat(messageProviderFormat)

function createConfig () {
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
      },
      prefix: {
        doc: `
          The API path used to get tasks, so for example if you wanted
          to get a listing of all the tasks the application knows about,
          it would be at /tasks.
        `,
        format: 'root-relative-path',
        default: '/'
      }
    },
    users: {
      provider: {
        prefix: {
          doc: `
            The prefix where additional endpoints for a user provider will be mounted.
            If userProvider.init() returns an express.Router(), then it will be
            mounted at /users/provider. This may be used for setting up
            provider specific endpoints or Oauth callbacks, etc.
          `,
          format: 'root-relative-path',
          default: '/provider'
        },
        provider: {
          doc: `
            The name of the user provider to be used for this service. 
            Use one of: ${userProviderFormat.values.join(', ')}
          `,
          format: 'user-provider',
          default: new UserProvider()
        },
        config: {
          doc: `
            The configuration data specific to the userProvider. 
            For example, this may be used to configure API keys
          `,
          format: '*',
          default: {}
        }
      }
    },
    tasks: {
      provider: {
        provider: {
          doc: `
            The name of the task provider service to be used for the API.
            Use one of: ${taskProviderFormat.values.join(', ')}
          `,
          format: 'tasks-provider',
          default: new TaskProvider()
        },
        prefix: {
          doc: `
            The prefix where additional provider endpoints will be mounted.
            If provider.init() returns an express.Router(), then it will be
            mounted at /tasks/provider. This may be used for setting up
            provider specific endpoints or Oauth callbacks, etc.
          `,
          format: 'root-relative-path',
          default: '/provider'
        },
        config: {
          doc: `
            The configuration data specific to the TaskProvider. 
            For example, this may be used to configure API keys
          `,
          format: '*',
          default: {}
        }
      }
    },
    messages: {
      provider: {
        provider: {
          doc: `
            The name of the task provider service to be used for the API.
            Use one of: ${messageProviderFormat.values.join(', ')}
          `,
          format: 'message-provider',
          default: new MessageProvider()
        },
        prefix: {
          doc: `
            The prefix where additional provider endpoints will be mounted.
            If provider.init() returns an express.Router(), then it will be
            mounted at /messages/provider. This may be used for setting up
            provider specific endpoints or Oauth callbacks, etc.
          `,
          format: 'root-relative-path',
          default: '/messages/provider'
        },
        config: {
          doc: `
            The configuration data specific to the MessageProvider. 
            For example, this may be used to configure API keys
          `,
          format: '*',
          default: {}
        }
      }
    }
  })

  return config
}

function defaultConfigFileLocation (name) {
  name = name || 'default.json'
  return path.resolve(__dirname, '..', '..', 'config', name)
}

/**
 * @typedef { ReturnType<ReturnType<typeof createConfig>["getProperties"]> } Config A configuration object
 */

/**
 * Load the application configuration, optionally from the given path
 * @param { string= } configFile An optional path to load a configuration file from
 * @returns { Config }
 */
function loadConfig (configFile) {
  const config = createConfig()

  configFile = configFile || defaultConfigFileLocation(config.get('config'))
  config.loadFile(configFile)
  config.validate({ allowed: 'strict' })

  return config.getProperties()
}

module.exports = {
  createConfig,
  loadConfig,
  defaultConfigFileLocation
}

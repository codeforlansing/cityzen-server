#!/usr/bin/env node

const { loadConfig, defaultConfigFileLocation } = require('./src/config')
const app = require('./src/app')

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .env('CITYZEN')
  .options({
    config: {
      short: 'c',
      alias: 'settings',
      description: 'the path to a settings file',
      default: defaultConfigFileLocation()
    }
  })
  .argv

const config = loadConfig(argv.config)

// Start the server listening at configured port on our local IP address.
app(config).then(server => {
  server.listen(
    config.server.port,
    () => console.log(`Listening on port ${config.server.port}.`)
  )
})

#!/usr/bin/env node

const { loadConfig } = require('./src/config')
const app = require('./src/app')

const config = loadConfig()

// Start the server listening at configured port on our local IP address.
app(config).then(server => {
  server.listen(
    config.server.port,
    () => console.log(`Listening on port ${config.server.port}.`)
  )
})

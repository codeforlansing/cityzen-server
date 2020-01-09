const express = require('express')
const helmet = require('helmet')

const app = express()

// Apply the helmet middleware to our express application.
// Helmet makes sure that our HTTP headers are correctly
// configure for security and best practices
app.use(helmet())

// set the port our application will run on.
// Currently we are hard coding this, but eventually we will want
// to be loading information like this from a settings file for an environment variable
const port = 3000

// Setup the routes (otherwise known as API endpoints, REST URLS, etc) for our server.

// Currently, we just have the / route, which handles requests to the applications root url, eg "example.com/" but not "example.com/api"
app.get('/', (req, res) => res.send('Hello World!'))

// this if statement checks that we are actually the main module, ie, that we haven't been loaded by any parent module
// If this is the case, then we want to start the server.
// Otherwise, we just export the app object, so it can be composed with tools and frameworks, or used for testing
if (!module.parent) {
  // This actually starts the server listening at port on our local ip address.
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

module.exports = app

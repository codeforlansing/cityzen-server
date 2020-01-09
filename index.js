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

// Add a route to handle the GET /tasks route
// This route responds with a json array containing a list of all the tasks
// that volunteers can work on
app.get('/tasks', (req, res) => {
  // For now, this is just a dummy message.
  // Eventually, we will want to be pulling information from
  // Trello and/or our database backend
  res.json([{
    taskId: 'taskid',
    name: 'Task Name',
    description: 'Task description',
    status: 'todo'
  }])
})

// Route to handle POST /tasks/volunteer
// This route is called when a user wants to volunteer for a task
// It does not return any data, but should send a 201 HTTP status code
// to indicate that everything went ok
app.post('/tasks/volunteer', (req, res) => {
  // Currently, the application does not have any logic for handling the
  // request data, but eventually we will want to add that in

  // Everything is ok
  res.status(201).end()
})

// this if statement checks that we are actually the main module, ie, that we haven't been loaded by any parent module
// If this is the case, then we want to start the server.
// Otherwise, we just export the app object, so it can be composed with tools and frameworks, or used for testing
if (!module.parent) {
  // This actually starts the server listening at port on our local ip address.
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

module.exports = app

const express = require('express')
const helmet = require('helmet')

async function app (config) {
  // Instantiate an express server
  const app = express()

  // Apply the 'helmet' middleware to our express application.  Helmet makes
  // sure that our HTTP headers are correctly configure for security and best
  // practices
  app.use(helmet())

  const tasksBackend = config.tasks.backend

  // Setup the routes (otherwise known as API endpoints, REST URLS, etc) for
  // our server.  Currently, we just have the `/` route, which handles
  // requests to the applications root URL, e.g. "example.com/" but not
  // "example.com/api".
  app.get('/', (req, res) => res.send('Hello World!'))

  // Add a route to handle the `GET /tasks` route.  This route responds with a
  // JSON array containing all the tasks that volunteers can work on.

  app.get(config.tasks.prefix, async (req, res) => {
    const tasksJson = []
    for await (const task of tasksBackend.getTasks()) {
      tasksJson.push(task)
    }
    res.json(tasksJson)
  })

  // Route to handle `POST /tasks/volunteer`.  This route is called when a
  // user wants to volunteer for a task.  It does not return any data, but
  // should send a 201 HTTP status code to indicate that everything went OK.
  app.post('/tasks/volunteer', (req, res) => {
    // Currently, the application does not have any logic for handling the
    // request data, but eventually we will want to add that in.

    // Everything is OK.
    res.status(201).end()
  })

  if (tasksBackend) {
    const tasksRoute = await tasksBackend.init(config)
    if (tasksRoute) {
      app.use(config.tasks.backendPrefix, tasksRoute)
    }
  }

  return app
}

module.exports = app

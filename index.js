const app = require('./src/app')

// Set the port our application will run on.  Currently we are hard coding
// this, but eventually we will want to be loading information like this from
// a settings file for an environment variable.
const port = 3000

// This actually starts the server listening at port on our local IP address.
app({
  // pass the application configuration here
}).listen(port, () => console.log(`Example app listening on port ${port}!`))

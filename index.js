const app = require('./src/app')

// This actually starts the server listening at port on our local ip address.
app({
  // pass the application configuration here
}).listen(3000, () => console.log(`Example app listening on port ${3000}!`))

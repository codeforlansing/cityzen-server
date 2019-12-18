const express = require('express')
const helmet = require('helmet')

const app = express()
app.use(helmet())

const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

if (!module.parent) {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

module.exports = app

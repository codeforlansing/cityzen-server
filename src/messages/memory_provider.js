const MessageProvider = require('.')

class MemoryProvider extends MessageProvider {
  constructor () {
    super()
    this.messages = {}
  }

  * send ({ to, ...content }) {
    for (const user of to) {
      if (user in this.messages) {
        this.messages[user].push(content)
      } else {
        this.messages[user] = [content]
      }
      yield user
    }
  }
}

module.exports = MemoryProvider

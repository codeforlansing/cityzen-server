const MessageProvider = require('../messages')

const MessageProviders = {
  none: '../messages'
}

const values = Object.keys(MessageProviders)

module.exports = {
  name: 'message-provider',
  values,
  validate (val) {
    if (!(val instanceof MessageProvider)) {
      throw new Error('must be an instance of a MessageProvider class')
    }
  },
  coerce (val) {
    if (!val) {
      return new MessageProvider()
    }

    // See https://stackoverflow.com/questions/18939192/how-to-test-if-b-is-a-subclass-of-a-in-javascript-node
    if (val.prototype instanceof MessageProvider || val === MessageProvider) {
      return val
    }

    if (typeof val !== 'string' || !values.includes(val)) {
      throw new Error(
        `${JSON.stringify(val, undefined, 2)} is not a valid message-provider format. ` +
        `Must be one of: ${values.join(', ')}`
      )
    }

    const MessageProviderClass = require(MessageProviders[val])
    if (!(MessageProviderClass.prototype instanceof MessageProvider) && MessageProviderClass !== MessageProvider) {
      throw new Error(`${JSON.stringify(MessageProviderClass, undefined, 2)} loaded from ${MessageProviders[val]} (${val}) is not a valid message provider constructor`)
    }

    return new MessageProviderClass()
  }
}

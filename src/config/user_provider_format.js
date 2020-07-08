const UserProvider = require('../users')

const UserProviders = {
  none: () => require('../users'),
  memory: () => require('../users/memory_provider')
}

const values = Object.keys(UserProviders)

module.exports = {
  name: 'user-provider',
  values,
  validate (val) {
    if (!(val instanceof UserProvider)) {
      throw new Error('must be an instance of a userProvider class')
    }
  },
  coerce (val) {
    if (!val) {
      return new UserProvider()
    }

    // See https://stackoverflow.com/questions/18939192/how-to-test-if-b-is-a-subclass-of-a-in-javascript-node
    if (val.prototype instanceof UserProvider || val === UserProvider) {
      return val
    }

    if (typeof val !== 'string' || !values.includes(val)) {
      throw new Error(
        `${JSON.stringify(val, undefined, 2)} is not a valid user-provider format. ` +
        `Must be one of: ${values.join(', ')}`
      )
    }

    const UserProviderClass = UserProviders[val]()
    return new UserProviderClass()
  }
}

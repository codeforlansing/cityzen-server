const TaskProvider = require('../tasks')

const TaskProviders = {
  none: () => require('../tasks'),
  memory: () => require('../tasks/memory_provider'),
  trello: () => require('../tasks/trello_provider')
}

const values = Object.keys(TaskProviders)

module.exports = {
  name: 'tasks-provider',
  values,
  validate (val) {
    if (!(val instanceof TaskProvider)) {
      throw new Error('must be an instance of a TaskProvider class')
    }
  },
  coerce (val) {
    if (!val) {
      return new TaskProvider()
    }

    // See https://stackoverflow.com/questions/18939192/how-to-test-if-b-is-a-subclass-of-a-in-javascript-node
    if (val.prototype instanceof TaskProvider || val === TaskProvider) {
      return val
    }

    if (typeof val !== 'string' || !values.includes(val)) {
      throw new Error(
        `${JSON.stringify(val, undefined, 2)} is not a valid tasks-provider format. ` +
        `Must be one of: ${values.join(', ')}`
      )
    }

    const TaskProviderClass = TaskProviders[val]()
    if (!(TaskProviderClass.prototype instanceof TaskProvider) && TaskProviderClass !== TaskProvider) {
      throw new Error(`${JSON.stringify(TaskProviderClass, undefined, 2)} loaded from ${TaskProviders[val]} (${val}) is not a valid tasks constructor`)
    }

    return new TaskProviderClass()
  }
}

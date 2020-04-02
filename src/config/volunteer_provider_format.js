const VolunteerProvider = require('../volunteer')

const volunteerProvider = {
  none: '../volunteer',
  memory: '../volunteer/memory_provider'
}

const values = Object.keys(volunteerProvider)

module.exports = {
  name: 'volunteer-provider',
  values,
  validate (val) {
    if (!(val instanceof VolunteerProvider)) {
      throw new Error('must be an instance of a VolunteerProvider class')
    }
  },
  coerce (val) {
    if (!val) {
      return new VolunteerProvider()
    }

    // See https://stackoverflow.com/questions/18939192/how-to-test-if-b-is-a-subclass-of-a-in-javascript-node
    if (val.prototype instanceof VolunteerProvider || val === VolunteerProvider) {
      return val
    }

    if (typeof val !== 'string' || !values.includes(val)) {
      throw new Error(
        `${JSON.stringify(val, undefined, 2)} is not a valid volunteer-provider format. ` +
        `Must be one of: ${values.join(', ')}`
      )
    }

    const VolunteerProviderClass = require(volunteerProvider[val])
    return new VolunteerProviderClass()
  }
}

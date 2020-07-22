
module.exports = {
  name: 'string-list',
  validate (val) {
    if (!(val instanceof Array)) {
      throw new Error('must be an Array')
    }
    val.forEach(item => {
      if (typeof item !== 'string') {
        throw new Error('every value in list must be a string')
      }
    })
  },
  coerce (val) {
    return val ? val.split(',') : []
  }
}

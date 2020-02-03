module.exports = {
  name: 'root-relative-path',
  validate (val) {
    if (!/^([/][^/?&]*)+$/.test(val)) {
      throw new Error('must be a root-relative path')
    }
  }
}

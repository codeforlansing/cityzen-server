const uuidv4 = require('uuid').v4

module.exports = class LoggedError extends Error {
  constructor (message, originalError) {
    super(message)
    this.name = 'LoggedError'
    /** @type {Error} */
    this._originalError = originalError
    /** @type {string} */
    this._correlationId = uuidv4()
  }

  get originalError () {
    return this.originalError
  }

  get correlationId () {
    return this._correlationId
  }

  toJSON () {
    return {
      message: this.message,
      correlationId: this._correlationId
    }
  }
}

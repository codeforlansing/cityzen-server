const uuidv4 = require('uuid').v4

/**
 * An error that connects a message and originating error with a
 * unique correlation identifier so errors on the server can be
 * more easily associated with errors sent to clients.
 */
class ServerError extends Error {
  /**
   * @param {string} message a human-readable message to be logged
   * @param {Error} originalError the originating cause for this error
   */
  constructor (message, originalError) {
    super(message)
    this.name = 'ServerError'
    this._originalError = originalError
    this._correlationId = uuidv4()
  }

  /** @type {Error} */
  get originalError () {
    return this.originalError
  }

  /** @type {string} */
  get correlationId () {
    return this._correlationId
  }

  /**
   * @returns {{ message: string, correlationId: string }}
   */
  toJSON () {
    return {
      message: this.message,
      correlationId: this._correlationId
    }
  }
}

module.exports = ServerError

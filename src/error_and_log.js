const isProduction = require('./is_production')
const LoggedError = require('./logged_error')

/**
 * Create a LoggedError, log it, and return it.
 * The log output will look like this:
 *
 * ``` text
 * 2020-03-05T03:28:45.721Z 138edc1d-9a4e-49ab-9850-620489903565
 *   Unable to reach Trello. Application is likely misconfigured.
 *   Error: 404 - Not Found
 *       at repl:1:86
 *       at Script.runInThisContext (vm.js:120:20)
 *       at REPLServer.defaultEval (repl.js:430:29)
 *       at bound (domain.js:426:14)
 *       at REPLServer.runBound [as eval] (domain.js:439:12)
 * ```
 *
 * The first line of log output is a formatted date and unique identifier
 * (correlation ID). The second line is the message, and the third and
 * subsequent lines are the original error and stack trace.
 *
 * @param {string} message a human-readable message to be logged
 * @param {Error} error the original error to be logged
 * @returns {LoggedError}
 */
module.exports = (message, error) => {
  const loggedError = new LoggedError(message, error)
  if (isProduction()) {
    console.group(new Date(), loggedError.correlationId)
    console.error(message)
    console.error(error)
    console.groupEnd()
  }
  return loggedError
}

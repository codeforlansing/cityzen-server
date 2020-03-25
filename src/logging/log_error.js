const isLoggingEnabled = require('./is_logging_enabled')
const ServerError = require('../server_error')
const uuidv4 = require('uuid').v4

/**
 * Logs an error with a timestamp, unique identifier (collected from the
 * error's correlationId property if available, or generated if not), an
 * optional error message, and error.
 *
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
 * @param {ServerError | Error} error the error to log
 * @param {string=} message an optional message to log
 */
module.exports = (error, message) => {
  if (!isLoggingEnabled()) return

  const correlationId = error instanceof ServerError
    ? error.correlationId
    : uuidv4()

  console.group(new Date().toISOString(), correlationId)
  if (message) {
    console.error(message)
  }
  console.error(error)
  console.groupEnd()
}

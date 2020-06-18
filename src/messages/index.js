const express = require('express')
// const logError = require('../logging/log_error')

/**
 * An abstract class which describes a way to send messages to users. For example, this might be used to configure a email sender, or to connect to a twillio API for sending SMS messages
 *
 * @template C a type describing the configuration object this message provider will create from its `convictConfig` function
 */
class MessageProvider {
  /**
   * This function will be called inside ./src/config/message_provider_format.js
   * to provide configuration for the provider
   *
   * @returns { import("convict").Config<C> }
   */
  convictConfig () { return undefined }

  /**
   * Initialize to the provider service.
   * This function may not need to do anything, but it can be used to setup one time authentication
   * or to setup webhooks.
   *
   * Note that this function is marked as async, which means that you may use async calls when
   * performing the authentication flow.
   *
   * @param { C } config the provider configuration, as defined by convictConfig
   * @param { import("../config/index").Config } appConfig the application configuration. See config/index.js for full schema
   * @returns { void | import("express").Router | PromiseLike<void | import("express").Router> } An express router which may be used to create provider specific endpoints for the api
   */
  init (config, appConfig) { }

  /**
   * Send a message to some users.
   *
   * This function attempts to send a message to the users in the `to` parameter. If the provider is not able to send the message
   * to a user for any reason, it may throw an error, but it is not required to. The provider may also return any number of users
   * to whom the message has been sent successfully. Note that the returned set of users may include users who were never
   * included in the `to` parameter. Examples of such users might be administrators or supervisors who wish to be notified when
   * a message has been sent to a particular user.
   *
   * This provider will use the options.message and options.title parameters to construct a message for each user. The message will include
   * at least the text in options.message and options.title but may also include additional information and formatting at the discression of
   * the provider implementations.
   *
   * @param { string[] } options.to      the ids of the users who the message will be sent to.
   * @param { string =}  options.title   the title of the message that will be sent to the users
   * @param { string =}  options.message the message to send to the user
   * @returns { AsyncGenerator<string> | Generator<string> | AsyncIterable<string> | Iterable<string> } the user ids to which the message was successfully
   * sent. If an id is present in this list, then the message has been sent. However, if an id is not present in this list, the message may or may not have
   * been sent. Also note that a message being sent does not mean that the user has actually read the message yet.
   **/
  send (options) { }
}

module.exports = MessageProvider

/**
*
* @param {MessageProvider<any>} messageProvider a user provider
* @param { import("../config/index").Config["message"] } providerConfig the user provider configuration. See config/index.js for full schema
* @param { import("../config/index").Config } config the application configuration. See config/index.js for full schema
* @returns {Promise<express.Router>}
*/
async function mount (messageProvider, providerConfig, config) {
  const router = express.Router()
  router.use(express.json())

  if (messageProvider) {
    const messageProviderConfig = messageProvider.convictConfig()
    if (messageProviderConfig) {
      messageProviderConfig.load(providerConfig.provider.config)
    }

    const messageProviderRoute = await messageProvider.init(messageProviderConfig && messageProviderConfig.getProperties(), config)
    if (messageProviderRoute) {
      router.use(providerConfig.provider.prefix, messageProviderRoute)
    }
  }

  return router
}

module.exports.mount = mount

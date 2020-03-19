/**
 * @returns {boolean} true if NODE_ENV is 'production', false otherwise
 */
module.exports = () => process.env.NODE_ENV === 'production'

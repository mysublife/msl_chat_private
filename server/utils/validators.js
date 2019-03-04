const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,63})+$/;
const sessionKeyRegex = /^[a-zA-Z0-9]{128}$/;
module.exports.MESSAGE_LENGTH_MAX = 10000;

module.exports.validateEmail = function(email) {
  return emailRegex.test(email);
};

module.exports.validateSessionKey = function(sessionKey) {
  return sessionKeyRegex.test(sessionKey);
};

module.exports.validateMessage = function(message) {
  return (message !== null && message.length > 0 && message.length <= this.MESSAGE_LENGTH_MAX);
};

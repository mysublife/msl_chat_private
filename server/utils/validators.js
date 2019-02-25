const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,63})+$/;
const sessionKeyRegex = /^[a-zA-Z0-9]{128}$/;

module.exports.validateEmail = function(email) {
  return emailRegex.test(email);
};

module.exports.validateSessionKey = function(sessionKey) {
  return sessionKeyRegex.test(sessionKey);
};

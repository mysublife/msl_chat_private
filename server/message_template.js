const messageTemplates = {
  "auth_invalid_credentials":{"type":"auth", "payload":{"key":"invalid_credentials", "data":null}},
  "auth_missing_credentials":{"type":"auth", "payload":{"key":"missing_credentials", "data":null}},
  "signaling_connection_ack":{"type":"signaling", "payload":{"key":"connection_ack", "data":"Greetings my geeky friend, you should give me some credentials now :)"}}
};

module.exports.get = function(key) {
  return JSON.parse(JSON.stringify(messageTemplates[key]));
}

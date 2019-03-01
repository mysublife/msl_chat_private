const messageTemplates = {
  "auth_invalid_credentials":{"type":"auth", "payload":{"key":"invalid_credentials", "data":null}},
  "auth_missing_credentials":{"type":"auth", "payload":{"key":"missing_credentials", "data":null}},
  "messaging_invalid_message":{"type":"messaging", "payload":{"key":"invalid_message", "data":null}},
  "signaling_connection_ack":{"type":"signaling", "payload":{"key":"connection_ack", "data":"Greetings my geeky friend, how is life treating you today?"}},
  "status_contact_list":{"type":"status", "payload":{"key":"contact_list", "data":null}},
};

module.exports.get = function(key) {
  return JSON.parse(JSON.stringify(messageTemplates[key])); // Clone object since it is passed by reference
}

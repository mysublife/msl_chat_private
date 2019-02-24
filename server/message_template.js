const messageTemplates = {
  "signaling_connection_ack":{"type":"signaling", "payload":{"key":"connection_ack", "data":"Greetings my geeky friend, you should give me some credentials now :)"}}
};

module.exports.get = function(key) {
  return JSON.parse(JSON.stringify(messageTemplates[key]));
}

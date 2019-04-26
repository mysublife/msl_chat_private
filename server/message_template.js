const messageTemplates = {
  "auth_error_invalid_credentials":{"type":"auth", "payload":{"key":"error_invalid_credentials", "data":null}},
  "auth_error_missing_credentials":{"type":"auth", "payload":{"key":"error_missing_credentials", "data":null}},
  "signaling_message_read":{"type":"signaling", "payload":{"key":"message_read", "data":{"last_message_id":null, "user_origin_id":null}}},
  "signaling_error_invalid_last_message_id":{"type":"signaling", "payload":{"key":"error_invalid_last_message_id", "data":null}},
  "messaging_error_invalid_get_conversation":{"type":"messaging", "payload":{"key":"error_invalid_get_conversation", "data":null}},
  "messaging_error_invalid_message":{"type":"messaging", "payload":{"key":"error_invalid_message", "data":null}},
  "messaging_error_invalid_contact":{"type":"messaging", "payload":{"key":"error_invalid_contact", "data":null}},
  "messaging_message":{"type":"messaging", "payload":{"key":"message", "data":{"id":null, "user_origin_id":null, "user_target_id":null, "message":null, "date_sent_utc":null}}},
  "messaging_conversation":{"type":"messaging", "payload":{"key":"conversation", "data":{"user_target_id":null, "messages":[]}}},
  "signaling_connection_ack":{"type":"signaling", "payload":{"key":"connection_ack", "data":"Greetings my geeky friend, how is life treating you today?"}},
  "signaling_signin_success":{"type":"signaling", "payload":{"key":"signin_success", "data":null}},
  "status_contact_list":{"type":"status", "payload":{"key":"contact_list", "data":null}},
};

module.exports.get = function(key) {
  return JSON.parse(JSON.stringify(messageTemplates[key])); // Clone object since it is passed by reference
}

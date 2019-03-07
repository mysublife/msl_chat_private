# Test server
`wss://dev.mysublife.com:8090`

# HTTP call to update contact list
`https://dev.mysublife.com:8090/contact_list_update?user_id=123&http_request_key=#KEY#`

# Messages from client
## auth
### signin
```
{
  "type":"auth",
  "payload":{
    "key":"signin",
    "data":{
      "username":"user1@local.dns",
      "session_key":"a0e1681807b90c8ee535662cf1f153891cfa57d4f86f252122fce1e2450ca58f6c21b122ebdae80befb63272c816d3488eb97221a2344806a6ea1ec1b3789549"
    }
  }
}
```
## messaging
### message
```
{
  "type":"messaging",
  "payload":{
    "key":"message",
    "data":{
      "user_target_id":5432,
      "message":"Hello world"
    }
  }
}
```
### get_conversation
```
{
  "type":"messaging",
  "payload":{
    "key":"get_conversation",
    "data":{
      "user_target_id":5432,
      "before_message_id":123
    }
  }
}
```
## signaling
### message_read
```
{
  "type":"signaling",
  "payload":{
    "key":"message_read",
    "data":{
      "last_message_id":123
    }
  }
}
```

# Test server
`wss://dev.mysublife.com:8090`

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
      "session_key":"c907f10addddf5a3f16991928ef152f175fd4bbdc404670d695487687d3fdad0b243c70f3332f259cae5b379ef738960024fcdd60e6f52d6e181913339a57bc1"
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

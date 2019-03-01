# Test server
`wss://dev.mysublife.com:8090`

# Messages from client
## Authentication
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
## Message
```
{
  "type":"messaging",
  "payload":{
    "key":"message",
    "data":{
      "target_user_id":5432,
      "message":"Hello world"
    }
  }
}
```

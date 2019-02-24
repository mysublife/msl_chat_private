module.exports.getClientIp = function(req) {
  let ip = req.headers["x-fowarded-for"];

  if (ip) {
    let list = ip.split(",");
    return list[list.length-1];
  } else {
    return req.connection.remoteAddress;
  }
}

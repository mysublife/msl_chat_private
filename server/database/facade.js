const database = require('./database');

module.exports.userGet = function(username, sessionKey) {
  return new Promise((resolve, reject) => {
    var query = 'SELECT d_entity.id, d_entity.name ' +
                'FROM d_session ' +
                'INNER JOIN d_user ON d_session.user = d_user.id ' +
                'INNER JOIN d_entity ON d_user.id = d_entity.id ' +
                'WHERE d_session.key = ? AND d_user.mail = ?';

    var args = [sessionKey, username];

    database.query(query, args)
    .then((results) => {
      if (results.length !== 1) {
        resolve(null);
        return;
      }

      var result = {};
      result.id = results[0].id;
      result.nickname = results[0].name;

      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

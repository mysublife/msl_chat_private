const database = require('./database');

module.exports.contactListGet = function(userId) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT DISTINCT
        q.id,
        d_entity.name
      FROM (
        SELECT
          requestor_id AS id
        FROM d_relation
        WHERE relation_id = ? AND date_accepted IS NOT NULL
        UNION ALL
        SELECT
          relation_id AS id
        FROM d_relation
        WHERE requestor_id = ? AND date_accepted IS NOT NULL
      ) AS q
      INNER JOIN d_entity ON d_entity.id = q.id
      ORDER BY d_entity.name ASC
    `;

    let args = [userId, userId];

    database.query(query, args)
    .then((rows) => {
      resolve(rows);
    })
    .catch((err) => {
      reject(err);
    });
  });
};


module.exports.userGet = function(username, sessionKey) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT d_entity.id, d_entity.name
      FROM d_session
      INNER JOIN d_user ON d_session.user = d_user.id
      INNER JOIN d_entity ON d_user.id = d_entity.id
      WHERE d_session.key = ? AND d_user.mail = ?
    `;

    let args = [sessionKey, username];

    database.query(query, args)
    .then((rows) => {
      if (rows.length !== 1) {
        resolve(null);
        return;
      }

      let result = {};
      result.id = rows[0].id;
      result.nickname = rows[0].name;

      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

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

module.exports.messageGet = function(messageId) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT
        id,
        message,
        date_sent_utc,
        date_read_utc,
        user_origin,
        user_target
      FROM d_chat_private_message
      WHERE id = ?
    `;

    let args = [messageId];

    database.query(query, args)
    .then((rows) => {
      if (rows.length !== 1) {
        resolve(null);
        return;
      }

      let result = {};
      result.id = rows[0].id;
      result.message = rows[0].message;
      result.date_send_utc = rows[0].date_sent_utc;
      result.date_read_utc = rows[0].date_read_utc;
      result.origin_user = rows[0].user_origin; // Changed user_origin to origin_user on this app
      result.target_user = rows[0].user_target; // Changed user_target to target_user on this app

      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

module.exports.messageInsert = function(message, originUserId, targetUserId) {
  return new Promise((resolve, reject) => {
    let query = `
      INSERT INTO d_chat_private_message(message, date_sent_utc, date_ack_utc, date_read_utc, user_origin, user_target)
      VALUES (?, UTC_TIMESTAMP(), NULL, NULL, ?, ?)
    `;

    let args = [message, originUserId, targetUserId];

    database.query(query, args)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

module.exports.messageUpdateDateRead = function(lastMessageId, originUserId, targetUserId) {
  return new Promise((resolve, reject) => {
    let query = `
      UPDATE d_chat_private_message
      SET date_read_utc = UTC_TIMESTAMP()
      WHERE date_read_utc IS NULL AND id <= ? AND user_origin = ? AND user_target = ?
    `;

    let args = [lastMessageId, originUserId, targetUserId];

    database.query(query, args)
    .then((result) => {
      resolve(result);
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
      result.name = rows[0].name;

      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

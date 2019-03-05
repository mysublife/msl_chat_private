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

      let result = rows[0];

      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

module.exports.messageGetConversation = function(user1Id, user2Id, beforeMessageId) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT t.*
      FROM ( '
        SELECT id, user_origin, user_target, date_sent_utc, message
        FROM d_chat_private_message
        WHERE ((user_origin = ? AND user_target = ?) OR (user_origin = ? AND user_target = ?))
        AND (? IS NULL OR id < ?)
        ORDER BY id DESC
        LIMIT 25) AS t
      ORDER BY t.id ASC
    `;

    let args = [user1Id, user2Id, user2Id, user1Id, beforeMessageId, beforeMessageId];

    database.query(query, args)
    .then((rows) => {
      resolve(rows);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

module.exports.messageGetUnread = function(userTargetId) {
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
      WHERE user_target = ? AND date_reat_utc IS NULL
      ORDER BY id ASC
    `;

    let args = [userTargetId];

    database.query(query, args)
    .then((rows) => {
      resolve(rows);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

module.exports.messageInsert = function(message, userOriginId, userTargetId) {
  return new Promise((resolve, reject) => {
    let query = `
      INSERT INTO d_chat_private_message(message, date_sent_utc, date_ack_utc, date_read_utc, user_origin, user_target)
      VALUES (?, UTC_TIMESTAMP(), NULL, NULL, ?, ?)
    `;

    let args = [message, userOriginId, userTargetId];

    database.query(query, args)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

module.exports.messageUpdateDateRead = function(lastMessageId, userOriginId, userTargetId) {
  return new Promise((resolve, reject) => {
    let query = `
      UPDATE d_chat_private_message
      SET date_read_utc = UTC_TIMESTAMP()
      WHERE date_read_utc IS NULL AND id <= ? AND user_origin = ? AND user_target = ?
    `;

    let args = [lastMessageId, userOriginId, userTargetId];

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

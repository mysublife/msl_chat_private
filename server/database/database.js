const mysql = require("mysql");

const pool = mysql.createPool({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : !process.env.DATABASE_PASSWORD ? "":process.env.DATABASE_PASSWORD,
  charset  : "utf8mb4",
  database : process.env.DATABASE_NAME,
  port     : process.env.DATABASE_PORT,
  timezone : "utc"
});

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(connection);
    });
  });
}

exports.query = function(sql, args) {
  return new Promise((resolve, reject) => {
    getConnection().then((connection) => {
      connection.query(sql, args, (err, results, fields) => {
        connection.release();
        if (err) {
          console.log(err);
          return reject(err);
        }

        resolve(results);
      });
    });
  });
};

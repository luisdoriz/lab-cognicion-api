require('dotenv').config();

let uri = process.env.DATABASE_URL
uri = uri.replace("postgres://", "")
uri = uri.split(":")
let user = uri[0]
let db = uri[2]
uri = uri[1]
uri = uri.split("@")
let password = uri[0]
let host = uri[1]
let dbName = db.split("/")
dbName = dbName[1]
module.exports = ({
  development: {
    username: user,
    user: user,
    password: password,
    database: dbName,
    host: host,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: user,
    user: user,
    password: password,
    database: dbName,
    host: host,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: user,
    user: user,
    password: password,
    database: dbName,
    host: host,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
});

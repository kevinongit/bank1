const { dbConfig } = require("../config");
const mysql = require("mysql2/promise");
const { Sequelize, DataTypes } = require("sequelize");

let db = {};

init();

function init() {
  console.log(dbConfig);
  //   console.log(Sequelize)
  const sequelize = new Sequelize(
    dbConfig.name,
    dbConfig.user,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      port: dbConfig.port,
      operatorAliases: false,
      pool: dbConfig.pool,
      define: {
        freezeTableName: true, /// to prevent auto pluralizing.
        timestamp: true,
      },
    }
  );
  //   console.log(sequelize);
  db = {
    Sequelize,
    sequelize,
    customer: require("./customer.model")(sequelize, DataTypes),
  };

  mysql
    .createConnection(({ host, port, user, password } = dbConfig))
    .then((connection) => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.name};`);
      console.log(`+ connecting to (${dbConfig.name}).`);
      sequelize
        .sync()
        // sequelize.sync({force: true})
        .then(() => {
          console.log(`+ (${dbConfig.name}) connected!`);
        })
        .catch((error) => {
          console.error(error);
          throw new Error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });

}

module.exports = db;

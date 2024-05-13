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
        freezeTableName: true,  /// to prevent auto pluralizing.
        timestamp: true,
      }
    }
  );
  mysql.createConnection(({host, port, user, password} = dbConfig))
    .then(connection => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.name};`)
      console.log(`+ Database(${dbConfig.name}) created.`)
    }) .catch(error => {
      console.error(error)
    })

//   console.log(sequelize);
  const customerModel = require("./customer.model")
  db = {
    Sequelize,
    sequelize,
    customer: customerModel(sequelize, DataTypes),
  };
  sequelize.sync()
// sequelize.sync({force: true}) 
.then(() => {
  console.log(`+ Database(${dbConfig.name}) connected!`)
}).catch(error => {
  console.error(error)
})
// console.log({customer :  db.customer})
  // console.log({db})
}

module.exports = db

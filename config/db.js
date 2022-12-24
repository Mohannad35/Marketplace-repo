const mysql = require('mysql')

const db1 = {
  host: "localhost",
  port: "3306",
  user: "sqluser",
  password: "1234",
  database: "marketplace"
};
const db2 = {
  host: "localhost",
  port: "3307",
  user: "sqluser",
  password: "12345678",
  database: "marketplace"
};

const db_con_1 = mysql.createConnection(db1);
db_con_1.connect(async (err) => {
  if (err) console.log("Database 1 Connection Failed");
  else console.log("connected to Database 1");
});

const db_con_2 = mysql.createConnection(db2);
db_con_2.connect((err) => {
  if (err) console.log("Database 2 Connection Failed");
  else console.log("connected to Database 2");
});

module.exports = [db_con_1, db_con_2];
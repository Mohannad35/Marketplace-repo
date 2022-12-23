const mysql = require('mysql')

const db = mysql.createConnection({
	host: "localhost",
	user: "sqluser",
	password: "1234",
	database: "marketplace"
});

module.exports = db;
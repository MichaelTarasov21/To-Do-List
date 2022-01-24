const mysql = require("mysql");
const config = require("./config.js");
const setupAdmin = require("./setupadmin");

const sql = mysql.createConnection({
	host: config.sqlhost,
	user: config.sqluser,
	password: config.sqlpassword,
	database: config.database_name,
});

function createTables() {
	sql.connect(function (err) {
		if (err) {
			throw err.stack;
		}
	});
	console.log(`Creating tables in ${config.database_name}...`);
	sql.query(
		`CREATE TABLE users (
			userid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
			administrator BOOLEAN NOT NULL,
			email nVARCHAR(255) NULL,
			username nVARCHAR(255) NOT NULL,
			real_name nVARCHAR(255) NULL,
			password VARCHAR(255) NOT NULL)`,
		function (err) {
			if (err) throw err;
		}
	);
	sql.query(
		`CREATE TABLE sessions (
			sessionid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			userid INT NOT NULL, 
			cookie VARCHAR(1000) NOT NULL, 
			last_access DATETIME NOT NULL,
			FOREIGN KEY (userid) REFERENCES users(userid))`,
		function (err) {
			if (err) throw err;
		}
	);
	sql.query(
		`CREATE TABLE tasks (
			noteid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
			userid INT NOT NULL, 
			position INT NULL, 
			message nVARCHAR(1000) NOT NULL, 
			completed BOOLEAN NOT NULL, 
			completed_date DATE NULL, 
			expiration_date DATE NULL, 
			flag nCHAR(1) NULL,
			FOREIGN KEY (userid) REFERENCES users(userid))`,
		function (err) {
			if (err) throw err;
		}
	);
	console.log("Sucessfully created tables");
	sql.end(setupAdmin);
}

module.exports = createTables;

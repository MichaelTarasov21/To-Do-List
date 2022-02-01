require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const config = require("./config.js");
const checkDatabse = require("./checkdatabase.js");
const login = require("./login.js");
const sendnotes = require("./sendnotes.js");

const tables = ["sessions", "tasks", "users"];
checkDatabse(tables);

const sessionStoreOptions = {
	host: config.sqlhost,
	user: config.sqluser,
	password: config.sqlpassword,
	database: config.database_name,
	createDatabaseTable: true,
	schema: {
		tableName: "sessions",
	},
};

const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(express.static(path.join(__dirname, "public")));

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(
	session({
		secret: config.cookieSecret,
		name: "sessionID",
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		rolling: true,
		unset: "destroy",
		cookie: {
			maxAge: 1000 * 60 * 60,
			sameSite: "strict",
			name: "sessionId",
		},
	})
);

app.listen(config.port, () => {
	console.log(`Example app listening on port ${config.port}!`);
});

app.post("/login", login);
app.post("/notes", sendnotes); // Uses post to ensure a broswer sends the request and does not merely assume that it already has the results (code 304)

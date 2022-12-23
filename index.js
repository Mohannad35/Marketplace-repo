const express = require('express');
const mydb = require('./config/db');
const router = require('./routes/router')
const bodyparser = require("body-parser")
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
app.use(router);

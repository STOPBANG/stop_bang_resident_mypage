const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const residentRouter = require('./routers/residentRouter.js');

app.use(residentRouter);

app.listen(app.get('port'), () => {
  console.log(`Resident Mypage app listening on port ${app.get('port')}`)
})
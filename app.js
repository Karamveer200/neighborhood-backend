require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { middleware } = require("./routes/middleware/middleware");

const connectDB = require("./services/database");

// Connect to MongoDB
connectDB();

var app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/health", (_, res) => res.send("Ok"));

app.use("/api/auth", require("./routes/auth"));

app.use("/api/user", require("./routes/user"));

app.use("/api/post", middleware, require("./routes/post"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const PORT = 5000;

app.listen(PORT, function () {
  console.log(`Server started on PORT ${PORT}`);
});

module.exports = app;

const express = require("express");
const routes = require("./routes/router.js");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");


//imports here


//code here

// Initialize our server
const app = express();
//To access the data user inputs in form.
app.use(express.urlencoded({ extended: false }));
//just a bolierplate code, tells our express server to add the user submitted data to request object.
app.use(express.json());

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cors());
app.use("/", routes);
module.exports = app;
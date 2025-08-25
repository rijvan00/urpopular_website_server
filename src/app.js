const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/database");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
//exposing our index route to the express
const indexRoute = require("./routes/index");
//connecting to db
connectToDatabase();
//exposing our versions of api
app.use("/api/v1", indexRoute);

//fetching portn number from environment variable
const PORT = process.env.PORT;
//telling express to listen us at PORT number
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
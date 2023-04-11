import express from "express";
import dotenv from "dotenv";

// import env variables
dotenv.config();

// create app with middleware
const app = express();
app.use(express.json(), express.urlencoded({ extended: false }));

// set port
const PORT = process.env.PORT || 3000;

// example route
app.route("/").get((_, res) => {
  res.send("Hello");
});

// run server
app.listen(PORT, () => {
  console.log("Running on http://localhost:" + PORT);
});

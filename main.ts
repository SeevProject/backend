import express from "express";

// create app with middleware
const app = express();
app.use(express.json(), express.urlencoded({ extended: false }));

// set port
const PORT = 3000;

// example route
app.route("/").get((_, res) => {
  res.send("Hello");
});

// run server
app.listen(PORT, () => {
  console.log("Running on http://localhost:" + PORT);
});

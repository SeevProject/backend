import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import cors from "cors";
import helmet from "helmet";
import { usersRouter } from "./routers/users.router";

// import env variables
dotenv.config();

// connect to the database
connectDB(process.env.MONGO_URL || "");

// create app
const app = express();

// add middlware to app
app.use(
	// json and url encoding
	express.json(),
	express.urlencoded({ extended: false }),
	// helmet for security
	helmet(),
	// cors for cross origin
	cors({
		// TODO change to domain later
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

// use server port or 3000
const PORT = process.env.PORT || 3000;

// add routers to app
app.use("/users", usersRouter);

// all other routes will return 404
app.all("*", (_, res) => {
	return res.status(404).send("Not Found");
});

// run server
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}!`);
});

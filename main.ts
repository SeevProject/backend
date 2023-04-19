import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import cors from "cors";
import helmet from "helmet";
import { usersRouter } from "./routers/users.router";
import { templatesRouter } from "./routers/templates.router";
import { authRouter } from "./routers/auth.router";
import { companiesRouter } from "./routers/companies.router";

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

// set server port
const PORT = process.env.PORT || 3000;

// add routers to app
app.use("/users", usersRouter);
app.use("/templates", templatesRouter);
app.use("/auth", authRouter);
app.use("/companies", companiesRouter);

// all other routes will return 404
app.all("*", (_, res) => {
	return res.status(404).send("Not Found");
});

// serve app
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}!`);
});

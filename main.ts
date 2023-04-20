import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/mongo";
import cors from "cors";
import helmet from "helmet";
import { usersRouter } from "./routers/users.router";
import { templatesRouter } from "./routers/templates.router";
import { authRouter } from "./routers/auth.router";
import { companiesRouter } from "./routers/companies.router";
import mongoStore from "connect-mongo";
import session from "express-session";

declare module "express-session" {
	interface SessionData {
		username: string;
	}
}

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
		credentials: true,
		// TODO change to domain later
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	}),
	// session for cookies
	session({
		secret: "hello",
		saveUninitialized: false,
		resave: false,
		store: mongoStore.create({
			mongoUrl: process.env.MONGO_URL || "",
			dbName: "testing",
		}),
		cookie: {
			httpOnly: true,
			sameSite: "lax",
			maxAge: 1000 * 60 * 60 * 24 * 3,
			// secure: true,
		},
	}),
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

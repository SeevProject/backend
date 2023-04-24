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
import { requiresAuth } from "./middleware/auth.middleware";
import { rateLimit } from "express-rate-limit";

// declare data that will be stored in session
declare module "express-session" {
	interface SessionData {
		uid: string;
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

	// setup rate limiter for requests
	rateLimit({
		max: 100, // limit each IP to 100 requests
		windowMs: 5 * 60 * 1000, // per 15 minutes
		standardHeaders: true,
		legacyHeaders: false,
		message: "Too many requests from this IP",
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
// all require auth except auth itself
app.use("/auth", authRouter);
app.use("/users", requiresAuth, usersRouter);
app.use("/templates", requiresAuth, templatesRouter);
app.use("/companies", requiresAuth, companiesRouter);

// all other routes will return 404
app.all("*", (_, res) => {
	return res.status(404).send("Not Found");
});

// serve app
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}!`);
});

import express from 'express';
import { connectDB } from './utils/mongo';
import cors from 'cors';
import helmet from 'helmet';
import { usersRouter } from './routers/users.router';
import { templatesRouter } from './routers/templates.router';
import { authRouter } from './routers/auth.router';
import { companiesRouter } from './routers/companies.router';
import mongoStore from 'connect-mongo';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit';
import { loadEnv } from './utils/env';
import { env } from './utils/env';
import fileUpload from 'express-fileupload';
import expressRequestsLogger from 'express-requests-logger';
import { adminRouter } from './routers/admin.route';

// import env variables
loadEnv();

// connect to the database
connectDB(env.MONGO_URL || '');

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
	// cors({
	// 	credentials: true,
	// 	origin: env.DEV ? "*" : "https://seev-backend.ahmed.systems/",
	// 	methods: ["GET", "POST", "PUT", "DELETE"],
	// }),

	cors({
		origin: ['http://localhost:5174', 'http://localhost:5173'],
		credentials: true,
	}),

	// setup rate limiter for requests
	rateLimit({
		max: 100, // limit each IP to 100 requests
		windowMs: 5 * 60 * 1000, // per 15 minutes
		standardHeaders: true,
		legacyHeaders: false,
		message: "You've sent too many requests later",
	}),

	// session for cookies
	session({
		// TODO set proper secret
		secret: 'hello',
		saveUninitialized: false,
		resave: false,
		store: mongoStore.create({
			mongoUrl: env.MONGO_URL || '',
			dbName: 'testing',
		}),
		cookie: {
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 3,
			secure: false,
		},
	}),

	// fileupload handling
	fileUpload({
		createParentPath: true,
		useTempFiles: true,
		safeFileNames: true,
		limits: {
			fileSize: 10 * 1024 * 1024 * 1024, // 2MB max file(s) size
		},
	}),

	// logging requests/responses
	expressRequestsLogger(),
);

// set server port
const PORT = env.PORT || 3000;

// add routers to app
// all require auth except auth itself
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/templates', templatesRouter);
app.use('/companies', companiesRouter);
app.use('/admin', adminRouter);


// all other routes will return 404
app.all('*', (_, res) => {
	return res.status(404).send('Not Found');
});



// serve app
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}!`);
});

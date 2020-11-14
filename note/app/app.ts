import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import redisConnect from 'connect-redis';
//Routes
import noteRouter from './note/note.route';
import sharedNoteRouter from './shared-note/shared-note.route';
import authRouter from './auth/auth.route';
//Connect database
import { sequelize } from './database/database';
import { client } from './database/redis';
//Passport
import passport from './auth/middleware/passport.middleware';
//Logger
import { logger } from './app.logger';

const app = express();
//Morgan
app.use(morgan('dev', { stream: logger.stream.write }));
// Helpers:
app.use(helmet());
app.use(
	cors({
		origin: (_, cb) => cb(null, true),
		credentials: true,
		preflightContinue: true,
		exposedHeaders: [
			'Access-Control-Allow-Headers',
			'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept',
			'X-Password-Expired',
		],
		optionsSuccessStatus: 200,
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Sessions:
const RedisStore = redisConnect(session);
app.use(
	session({
		store: new RedisStore({
			host: process.env.REDIS_HOST,
			port: +process.env.REDIS_PORT,
			client: client,
		}),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
// Passport:
app.use(passport.initialize());
app.use(passport.session());
//Routes:
app.use('/note', noteRouter);
app.use('/note/shared', sharedNoteRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT, async () => {
	try {
		await sequelize.sync({ force: true });
		logger.info('Drop and re-sync db.');
		logger.info(`run serve ${process.env.PORT}`);
	} catch (ex) {
		logger.error(ex.message);
		process.exit(1);
	}
});
export default app;
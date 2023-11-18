import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import morgan from 'morgan'

// External Modules
import Routes from "./Routes";

// Get router
const router: express.Router = express.Router();
const app: express.Express = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const DATABASE = 'mongodb://localhost:27017/tier-test'
const PORT =8000

const connectDatabase = async (mongoUrl: string) => {
	try {
		const options = {
			autoCreate: true,
			keepAlive: true,
			retryReads: true,
		} as mongoose.ConnectOptions;
		mongoose.set("strictQuery", true);
		const result = await mongoose.connect(mongoUrl, options);
		if (result) {
			console.log("MongoDB connected");
		}
		return result
	} catch (err) {
		console.log("ConnectDatabase", err);
	}
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
app.use(morgan('tiny'))
app.use(limiter)
app.use(express.json());

connectDatabase(DATABASE).then(() => {
	// API Router
	Routes(router);
	app.use("/api", router);

	app.listen(PORT, () => {
		console.log(`Server listening on ${PORT} port`);
	});
}).catch((err: any) => {
	console.log(err);
});

export default app;
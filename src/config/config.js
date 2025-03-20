import dotenv from "dotenv";

dotenv.config();

export default {
	port: process.env.PORT || 3000,
	jwtSecret: process.env.JWT_SECRET || "your-secret-key",
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
	environment: process.env.NODE_ENV || "development",
};

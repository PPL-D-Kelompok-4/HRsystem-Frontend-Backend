import dotenv from "dotenv";

dotenv.config();

export default {
	port: process.env.PORT,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiresIn: process.env.JWT_EXPIRES_IN,
	environment: process.env.NODE_ENV,
};

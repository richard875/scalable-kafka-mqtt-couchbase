import dotenv from "dotenv";
dotenv.config();

export const REDIS_HOSTS = process.env.REDIS_HOSTS!;
export const RESEND_API_KEY = process.env.RESEND_API_KEY!;

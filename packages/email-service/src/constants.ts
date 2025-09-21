import dotenv from "dotenv";
dotenv.config();

export const REDIS_HOSTS = process.env.REDIS_HOSTS!;
export const RESEND_API_KEY = process.env.RESEND_API_KEY!;
export const FROM_EMAIL = process.env.FROM_EMAIL!;
export const TO_EMAIL = process.env.TO_EMAIL!;

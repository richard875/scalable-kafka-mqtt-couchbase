import * as dotenv from "dotenv";
dotenv.config();

export const KAFKA_BROKER_URL = process.env.KAFKA_BROKER_URL!;

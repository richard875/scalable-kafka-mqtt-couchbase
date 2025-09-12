import dotenv from "dotenv";
dotenv.config();

export const COUCHBASE_URL = process.env.COUCHBASE_URL!;
export const COUCHBASE_USERNAME = process.env.COUCHBASE_USERNAME!;
export const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD!;
export const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET!;

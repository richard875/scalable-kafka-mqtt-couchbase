import dotenv from "dotenv";
dotenv.config();

export const clusterConnStr = process.env.COUCHBASE_URL!;
export const username = process.env.COUCHBASE_USERNAME!;
export const password = process.env.COUCHBASE_PASSWORD!;
export const bucketName = process.env.COUCHBASE_BUCKET!;

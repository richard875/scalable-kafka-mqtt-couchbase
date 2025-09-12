import couchbase, { Bucket, Collection, Cluster } from "couchbase";
import type SlipItem from "@fdj/shared/types/slipItem";
import {
  COUCHBASE_URL,
  COUCHBASE_USERNAME,
  COUCHBASE_PASSWORD,
  COUCHBASE_BUCKET,
} from "@audit-service/constants.js";

const initCouchbase = async (): Promise<Collection> => {
  const couchbaseCredentials = { username: COUCHBASE_USERNAME, password: COUCHBASE_PASSWORD };
  const couchbaseClient: Cluster = await couchbase.connect(COUCHBASE_URL, couchbaseCredentials);
  const bucketMgr = couchbaseClient.buckets();

  try {
    await bucketMgr.createBucket({ name: COUCHBASE_BUCKET, ramQuotaMB: 100, flushEnabled: true });
    console.log(`✅ Bucket '${COUCHBASE_BUCKET}' created`);
  } catch (err) {
    if (err instanceof couchbase.BucketExistsError) {
      console.log(`⚠️ Bucket '${COUCHBASE_BUCKET}' already exists, skipping creation`);
    } else throw err;
  }

  const bucket: Bucket = couchbaseClient.bucket(COUCHBASE_BUCKET);
  const collection: Collection = bucket.defaultCollection();

  console.log(`📦 Couchbase initialized, bucket: ${COUCHBASE_BUCKET}`);
  return collection;
};

export const handleMessage = async (_: string, message: unknown): Promise<void> => {
  const collection = await initCouchbase();
  if (!collection) throw new Error("Couchbase not initialized");

  const docId = (message as SlipItem).id || crypto.randomUUID();
  await collection.upsert(docId, message);
};

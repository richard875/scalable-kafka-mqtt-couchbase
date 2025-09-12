import couchbase, { Bucket, Collection, Cluster } from "couchbase";
import type SlipItem from "@fdj/shared/types/slipItem";
import { clusterConnStr, username, password, bucketName } from "@audit-service/constants.js";

const initCouchbase = async (): Promise<Collection> => {
  const couchbaseClient: Cluster = await couchbase.connect(clusterConnStr, { username, password });
  const bucketMgr = couchbaseClient.buckets();

  try {
    await bucketMgr.createBucket({ name: bucketName, ramQuotaMB: 100, flushEnabled: true });
    console.log(`✅ Bucket '${bucketName}' created`);
  } catch (err) {
    if (err instanceof couchbase.BucketExistsError) {
      console.log(`⚠️ Bucket '${bucketName}' already exists, skipping creation`);
    } else throw err;
  }

  const bucket: Bucket = couchbaseClient.bucket(bucketName);
  const collection: Collection = bucket.defaultCollection();

  console.log(`📦 Couchbase initialized, bucket: ${bucketName}`);
  return collection;
};

export const handleMessage = async (_: string, message: unknown): Promise<void> => {
  const collection = await initCouchbase();
  if (!collection) throw new Error("Couchbase not initialized");

  const docId = (message as SlipItem).id || crypto.randomUUID();
  await collection.upsert(docId, message);
};

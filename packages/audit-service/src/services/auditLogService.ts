import couchbase, { Bucket, Collection, Cluster } from "couchbase";
import type SlipItem from "@fdj/shared/types/slipItem";
import {
  COUCHBASE_URL,
  COUCHBASE_USERNAME,
  COUCHBASE_PASSWORD,
  COUCHBASE_BUCKET,
} from "../constants.js";

// Global variables to store the Couchbase connection
let couchbaseCluster: Cluster | null = null;
let couchbaseCollection: Collection | null = null;

const initCouchbase = async (): Promise<Collection> => {
  if (couchbaseCollection) return couchbaseCollection;

  const couchbaseCredentials = {
    username: COUCHBASE_USERNAME,
    password: COUCHBASE_PASSWORD,
    // Add connection timeout configuration
    timeouts: {
      connectTimeout: 10000, // 10 seconds
      kvTimeout: 5000, // 5 seconds
      queryTimeout: 75000, // 75 seconds
    },
  };

  couchbaseCluster = await couchbase.connect(COUCHBASE_URL, couchbaseCredentials);
  const bucketMgr = couchbaseCluster.buckets();

  try {
    await bucketMgr.createBucket({ name: COUCHBASE_BUCKET, ramQuotaMB: 100, flushEnabled: true });
    console.log(`✅ Bucket '${COUCHBASE_BUCKET}' created`);
  } catch (err) {
    if (err instanceof couchbase.BucketExistsError) {
      console.log(`⚠️ Bucket '${COUCHBASE_BUCKET}' already exists, skipping creation`);
    } else throw err;
  }

  const bucket: Bucket = couchbaseCluster.bucket(COUCHBASE_BUCKET);
  couchbaseCollection = bucket.defaultCollection();

  console.log(`📦 Couchbase initialized, bucket: ${COUCHBASE_BUCKET}`);
  return couchbaseCollection;
};

// Initialize Couchbase connection once
export const initializeAuditService = async (): Promise<void> => {
  await initCouchbase();
};

// Clean up Couchbase connection
export const cleanupAuditService = async (): Promise<void> => {
  if (couchbaseCluster) {
    await couchbaseCluster.close();
    couchbaseCluster = null;
    couchbaseCollection = null;
    console.log("🔌 Couchbase connection closed");
  }
};

export const handleMessage = async (topic: string, message: unknown): Promise<void> => {
  if (!couchbaseCollection) {
    throw new Error("Couchbase not initialized. Call initializeAuditService() first.");
  }

  try {
    const docId = (message as SlipItem).id || crypto.randomUUID();

    // Add timeout to the upsert operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Upsert operation timed out")), 5000);
    });

    const auditDocument = {
      ...(message as Record<string, unknown>),
      topic,
      timestamp: new Date().toISOString(),
      auditId: docId,
    };

    const upsertPromise = couchbaseCollection.upsert(docId, auditDocument);

    await Promise.race([upsertPromise, timeoutPromise]);
    console.log(`📝 Audit log saved for topic ${topic}: ${docId}`);
  } catch (error) {
    console.error(`Failed to save audit log for topic ${topic}:`, error);
    // Don't re-throw the error to prevent message processing from stopping
    // Instead, log the error and continue processing other messages
  }
};

import couchbase, { Bucket, Collection, Cluster } from "couchbase";
import type BetV1 from "@fdj/shared/types/kafka/betV1.js";
import type BatEnvelope from "@fdj/shared/types/kafka/batEnvelope.js";
import {
  COUCHBASE_URL,
  COUCHBASE_USERNAME,
  COUCHBASE_PASSWORD,
  COUCHBASE_BUCKET,
} from "../constants.js";

const BET_SCHEMA_VERSION = "v1";

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

export const handleMessage = async (
  topic: string,
  message: BatEnvelope<unknown>
): Promise<void> => {
  if (!couchbaseCollection) {
    throw new Error("Couchbase not initialized. Call initializeAuditService() first.");
  }

  try {
    if (!message || message.version !== BET_SCHEMA_VERSION) {
      throw new Error("Invalid message format or unsupported version");
    }

    const localMessage = message as BetV1;
    const docId = localMessage.payload.id || crypto.randomUUID();

    // Add timeout to the upsert operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Upsert operation timed out")), 5000);
    });

    const auditDocument = {
      ...localMessage,
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

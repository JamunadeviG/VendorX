import { MongoClient, Db } from "mongodb"

// Use a global cache so Next.js dev/hot-reload doesn't open many connections
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForMongo = globalThis as any

type MongoCache = { client: MongoClient | null; db: Db | null }
const mongoCache: MongoCache = globalForMongo.__MONGO_CACHE__ || { client: null, db: null }
if (!globalForMongo.__MONGO_CACHE__) {
  globalForMongo.__MONGO_CACHE__ = mongoCache
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI
  const dbName = process.env.MONGODB_DB || "vendorx"

  if (!uri) {
    throw new Error(
      "Database not configured: set MONGODB_URI in your .env.local (and optionally MONGODB_DB)."
    )
  }

  if (mongoCache.client && mongoCache.db) {
    return mongoCache.db
  }

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)

  mongoCache.client = client
  mongoCache.db = db
  return db
}

export async function closeDb(): Promise<void> {
  if (mongoCache.client) {
    await mongoCache.client.close()
    mongoCache.client = null
    mongoCache.db = null
  }
}


// IF CONNECTION EXISTS WE WANT TO REUSE IT, OTHERWISE - CREATE A NEW CONNECTION

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// just to remove typescript warning we use globalWithMongo instead of global
let globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((error) => {
    console.error("Failed to connect to MongoDB server:", error);
    process.exit(1);
  });
}

process.on("exit", () => {
  client.close();
});

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

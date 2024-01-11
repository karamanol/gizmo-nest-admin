import mongoose from "mongoose";

const CONNECTED_CODE = 1;

export async function mongooseConnect() {
  const { connection } = mongoose;

  if (connection.readyState === CONNECTED_CODE) {
    return connection; // If the connection is already open, return it directly
  } else {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");
    try {
      await mongoose.connect(uri, { autoIndex: true });
      console.log("Connected via Mongoose");
      return mongoose.connection; // Return the connection when it's established
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err; // Re-throw the error to handle it in the calling code
    }
  }
}

import mongoose from "mongoose";

export async function mongooseConnect() {
  const { connection } = mongoose;

  if (connection.readyState === 1) {
    return connection; // If the connection is already open, return it directly
  } else {
    const uri = process.env.MONGODB_URI;
    try {
      await mongoose.connect(uri as string);
      console.log("Connected via Mongoose");
      return mongoose.connection; // Return the connection when it's established
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err; // Re-throw the error to handle it in the calling code
    }
  }
}

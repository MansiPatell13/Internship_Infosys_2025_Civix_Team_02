// Run this script once to clean up existing data
// You can run this in MongoDB Compass or create a separate cleanup file

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function cleanupDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB || "civix",
    });

    console.log("Connected to MongoDB");

    // Update all documents with empty string images to null
    const result = await mongoose.connection.db.collection('petitions').updateMany(
      { image: "" }, // Find documents where image is empty string
      { $set: { image: null } } // Set image to null
    );

    console.log(`Updated ${result.modifiedCount} documents`);

    // Also update any other invalid ObjectId references
    const invalidObjectIds = await mongoose.connection.db.collection('petitions').updateMany(
      { 
        image: { 
          $type: "string", 
          $ne: null,
          $regex: /^(?!.*[0-9a-fA-F]{24}$).*/ // Not a valid ObjectId format
        } 
      },
      { $set: { image: null } }
    );

    console.log(`Updated ${invalidObjectIds.modifiedCount} documents with invalid ObjectIds`);

    await mongoose.disconnect();
    console.log("Database cleanup completed");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

// Run cleanup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupDatabase();
}

export default cleanupDatabase;
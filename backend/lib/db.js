import mongoose, { Mongoose } from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exist(1);
  }
};

export default connectDB;

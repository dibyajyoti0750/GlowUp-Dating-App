import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("DB connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/glowup`);
  } catch (err) {
    console.log(err.message);
  }
};

export default connectDB;

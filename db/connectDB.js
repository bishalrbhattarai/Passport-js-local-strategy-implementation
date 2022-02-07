import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017", {
    dbName: "bishal",
  });
  console.log("connected to db");
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const User = new mongoose.model("User", userSchema);
export { User, connectDB };

import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoConnect = await mongoose.connect(process.env.API_MONGO_URI_ACCESS);
  console.log(`MongoDB connected ${mongoConnect.connection.host}`);
};

export default connectDB;

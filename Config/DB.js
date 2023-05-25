import mongoose from "mongoose";
import * as dotenv from 'dotenv' 
dotenv.config()


const connectDB = async () => {
  // const conn = await mongoose.connect(process.env.MONGO_URI);
  mongoose.set('strictQuery', false);
  const conn = await mongoose.connect(process.env.URI);
  // console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
// mongoose.set('useFindAndModify',false)
export {connectDB}




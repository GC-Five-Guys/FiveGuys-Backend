import mongoose from "mongoose";
import dotenv from "dotenv";

// .env 파일의 내용을 읽어옴.
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('❌ Error connecting to MongoDB:', error);
        process.exit(1); // 연결 실패 시 서버 종료.
    }
};

export default connectDB;
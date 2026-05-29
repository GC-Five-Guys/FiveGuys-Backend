import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 8080;

// 서버를 띄우기 전에 먼저 DB를 연결.
connectDB().then(() => {
    // app.listen을 호출하는 순간, 서버가 지정된 포트에서 요청을 기다리기 시작함.
    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
});


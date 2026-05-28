import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import noteRoutes from "./routes/noteRoutes";
import folderRoutes from "./routes/folderRoutes";
import searchRoutes from "./routes/searchRoutes";
import authRoutes from "./routes/authRoutes";

// 1. Express 어플리케이션 인스턴스 생성
const app : Application = express();

// 2. 글로벌 미들웨어 설정 ( 식당에 들어오는 모든 손님이 거치는 입구 컷 )
// 클라이언트 (프론트엔드)에서 보내는 JSON 형태의 데이터를 해석할 수 있게 해줌.
app.use(express.json());
// 다른 도메인 (프론트엔드 URL)에서 오는 요청을 허용해 줌.
app.use(cors());
// API 엔드포인트 연결.
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/folders', folderRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/auth', authRoutes);

// 3. 헬스 체크 API ( 서버가 잘 열려 있는지 확인하는 요청 )
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'ok',
            message: 'Tri-Link Server is running!'}
    });
});

// 외부에서 이 앱 설정을 가져다 쓸 수 있도록 내보냄.
export default app;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../repositories/userRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Express의 Request 객체를 확장하여 user 정보를 담을 수 있게 함.
export interface AuthRequest extends Request {
    user?: any;
}

export const authGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 1. 유저가 Authorization 헤더가 있는지 확인
        // 형식 : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No authentication token, please log in.'});
        }
        // 2.  "Bearer "라는 글자를 떼어내고 토큰 내용을 가져오기
        const token = authHeader.split(' ')[1];

        // 3. .env의 JWT_SECRET과 대조해서 토큰의 진위여부 판단
        // 토큰 검사가 통과하면 토큰 안의 유저 정보가 나옴
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // 4. 그 ID로 DB에서 등록된 유저가 맞는지 확인
        const user = await findUserById(decoded.id);
        if (!user) {
            return  res.status(401).json({ success: false, message: 'This is a non-existent user.' });
        }

        // 5. 등록된 유저가 맞다고 확인되면 Controller에 넘어가기 전에 req 객체에 유저 정보를 첨부
        req.user = user;
        // next()가 호출되어야 Controller가 실행됨.
        next();
    } catch (error) {
        // 토큰 유효기간이 지났거나, 위조되었을 때 이 에러가 발생
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};
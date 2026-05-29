import * as userRepository from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const signup = async (userData: any) => {
    // 1. 중복 검사
    const existing = await userRepository.findUserByEmail(userData.email);
    if (existing) throw new Error('CONFLICT');
    // 2. 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    // 3. 유저 저장
    const newUser = await userRepository.createUser({
        ...userData,
        password_hash: hashedPassword
    });
    // 4. 가입 환영 토큰 발급
    const token = jwt.sign({ id:newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    // 비밀번호를 제외하고 리턴
    return { 
        user: { 
            email: newUser.email, 
            display_name: newUser.display_name,
            created_at: newUser.created_at.toISOString() // 💡 Date -> string 변환
        }, 
        token 
    };
};
export const login = async (email: string, password: string) => {
    // 1. 유저 탐색
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('UNAUTHORIZED');
    // 2. 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('UNAUTHORIZED');
    // 3. 일치하면 토큰 발급
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return { 
        user: { 
            email: user.email,
            display_name: user.display_name,
            created_at: user.created_at.toISOString() // 💡 Date -> string 변환
        }, 
        token 
    };
};
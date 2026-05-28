import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const signup = async ( req: Request, res: Response ) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        if (error.message === 'CONFLICT')
            return res.status(409).json({ success: false, message: 'Duplicate user' });
        res.status(500).json({ success: false, message: 'Failed to register' });
    }
};

export const login = async ( req: Request, res: Response ) => {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        if (error.message === 'UNAUTHORIZED')
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        res.status(500).json({ success: false, message: 'Failed to login' });
    }
};
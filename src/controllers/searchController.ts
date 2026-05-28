import { Request, Response } from 'express';
import * as searchService from '../services/searchService';

interface AuthRequest extends Request {
    user?: any;
}

export const globalSearch = async (req: AuthRequest, res: Response) => {
    try {
        const { q, type } = req.query;
        const userId = req.user._id.toString(); // JWT에서 추출된 실제 유저 ID

        let mappedType: string | undefined;
        if (type === '#') mappedType = 'tag';
        else if (type === '@') mappedType = 'mention';
        else if (type === '&') mappedType = 'object';

        const results = await searchService.integrateSearch(userId, q as string, mappedType);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({success: false, message: 'Error while searching'});
      console.error('Search Error: ', error);
    }
}
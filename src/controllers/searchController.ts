import { Request, Response } from 'express';
import * as searchService from '../services/searchService';

export const globalSearch = async (req: Request, res: Response) => {
    try {
        const { q, type } = req.query;

        let mappedType: string | undefined;
        if (type === '#') mappedType = 'tag';
        else if (type === '@') mappedType = 'mention';
        else if (type === '&') mappedType = 'object';

        const results = await searchService.integrateSearch(q as string, mappedType);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({success: false, message: 'Error while searching'});
      console.error('Search Error: ', error);
    }
}
import { Request, Response } from 'express';
import * as noteService from '../services/noteService';

// 노트 생성 컨트롤러
export const createNote = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;

        // Service에게 요청
        const newNote = await noteService.createNote(title, content);

        res.status(201).json({
            success: true,
            data: newNote
        });
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({
            success: false,
            message: 'server error has occurred.'
        });
    }
};
import { Request, Response } from 'express';
import * as noteService from '../services/noteService';

// 1. 노트 생성 컨트롤러
export const createNote = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        // Service에게 요청
        const newNote = await noteService.createNote(title, content);
        res.status(201).json({success: true, data: newNote});
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({success: false, message: 'server error has occurred.'});
    }
};
// 2. 목록 조회
export const getNotes = async (req: Request, res: Response) => {
    try {
        const notes = await noteService.getNotes();
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({success: false, message: 'Failed to retrieve file list.'});
    }
};
// 3. 상세 조회
export const getNoteDetail = async (req: Request, res: Response) => {
    try {
        const note = await noteService.getNoteDetail(req.params.id)
        if (!note) return res.status(404).json({success: false, message: 'Not Found this note.'});
        res.status(200).json({success: true, data: note});
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({success: false, message: 'Failed to retrieve file'});
    }
}
// 4. 수정 하기 (PUT)
export const updateNote = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body
        const updatedNote = await noteService.updateNote(req.params.id , title, content);
        res.status(200).json({success: true, data: updatedNote});
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({success: false, message: 'Failed to update file.'});
    }
}
// 5. 삭제 하기 (DELETE)
export const deleteNote = async (req: Request, res: Response) => {
    try {
        await noteService.deleteNote(req.params.id);
        res.status(204).send(); // 204 No Content: 삭제 성공. 돌려줄 본문은 없음
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({success: false, message: 'Failed to delete note.'});
    }
}
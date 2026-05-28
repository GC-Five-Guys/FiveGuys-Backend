import { Request, Response } from 'express';
import * as noteService from '../services/noteService';

// AuthRequest 타입을 임시로 정의 (req.user를 쓰기 위함)
interface AuthRequest extends Request {
    user?: any;
}

// 1. 노트 생성 컨트롤러
export const createNote = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, date } = req.body;
        const userId = req.user._id.toString(); // authGuard가 넣어준 진짜 유저 ID
        
        // Service에게 요청
        const newNote = await noteService.createNote(userId, title, content, date);
        res.status(201).json({success: true, data: newNote});
    } catch (error: any) {
        console.error('Controller Error: ', error);
        if (error.message === '해당 날짜에 이미 작성된 일기가 있습니다.') {
            return res.status(409).json({ success: false, message: error.message });
        }
        res.status(500).json({success: false, message: 'server error has occurred.'});
    }
};
// 2. 목록 조회 (날짜 및 폴더 필터링 반영)
export const getNotes = async (req: AuthRequest, res: Response) => {
    try {
        const { date, folder_id } = req.query; 
        const userId = req.user._id.toString();

        const notes = await noteService.getNotes(userId, date as string, folder_id as string);
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
// 4. 수정 하기 (PUT - 전체 수정 및 재파싱)
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

// 5. 부분 수정 하기 (PATCH - 폴더 이동 등 메타데이터)
export const updateNotePartial = async (req: Request, res: Response) => {
    try {
        // Body에 담겨온 변경사항들 (예: folder_id)
        const updatedNote = await noteService.updateNotePartial(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({ success: false, message: 'Failed to update note metadata.' });
    }
}

// 6. 삭제 하기 (DELETE)
export const deleteNote = async (req: Request, res: Response) => {
    try {
        await noteService.deleteNote(req.params.id);
        res.status(204).send(); // 204 No Content: 삭제 성공. 돌려줄 본문은 없음
    } catch (error) {
        console.error('Controller Error: ', error);
        res.status(500).json({success: false, message: 'Failed to delete note.'});
    }
}
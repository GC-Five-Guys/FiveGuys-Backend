import { Router } from "express";
import * as noteController from '../controllers/noteController';

const router = Router();

router.post('/', noteController.createNote);        // 노트 생성
router.get('/', noteController.getNotes);           // 목록 조회
router.get('/:id', noteController.getNoteDetail);   // 상세 조회
router.put('/:id', noteController.updateNote);      // 노트 수정 (전체)
router.patch('/:id', noteController.updateNotePartial); // 노트 수정 (부분 - 폴더 이동 등)
router.delete('/:id', noteController.deleteNote);   // 노트 삭제

export default router;
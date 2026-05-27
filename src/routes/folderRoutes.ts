import { Router } from 'express';
import * as folderController from '../controllers/folderController';

const router = Router();

router.post('/', folderController.createFolder);        // 폴더 생성
router.get('/', folderController.getFolder);            // 폴더 조회
router.patch('/:id', folderController.updateFolder);    // 폴더 수정
router.delete('/:id', folderController.deleteFolder);   // 폴더 삭제

export default router;
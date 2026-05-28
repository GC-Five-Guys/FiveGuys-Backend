import { Router } from 'express';
import * as folderController from '../controllers/folderController';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

router.post('/', authGuard, folderController.createFolder);        // 폴더 생성
router.get('/', authGuard, folderController.getFolder);            // 폴더 조회
router.patch('/:id', authGuard, folderController.updateFolder);    // 폴더 수정
router.delete('/:id', authGuard, folderController.deleteFolder);   // 폴더 삭제

export default router;
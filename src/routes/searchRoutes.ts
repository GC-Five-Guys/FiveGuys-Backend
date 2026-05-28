import { Router } from 'express';
import * as searchController from '../controllers/searchController';
import { authGuard } from '../middlewares/authGuard';

const router = Router();
router.get('/', authGuard, searchController.globalSearch);
export default router;
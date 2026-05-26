import { Router } from "express";
import * as noteController from '../controllers/noteController';

const router = Router();

router.post('/', noteController.createNote);
export default router;
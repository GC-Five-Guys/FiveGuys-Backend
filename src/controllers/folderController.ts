import { Request, Response } from 'express';
import * as folderService from '../services/folderService';

interface AuthRequest extends Request {
    user?: any;
}

// 1. 폴더 생성
export const createFolder = async (req: AuthRequest, res: Response) => {
    try {
        const { name, parent_id, order } = req.body;
        const userId = req.user._id.toString();
        const newFolder = await folderService.createFolder(userId, name, parent_id, order);
        res.status(201).json({ success: true , data: newFolder });
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to create folder.'});
        console.error('Folder Controller Error: ', error);
    }
};
// 2. 폴더 조회
export const getFolder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id.toString();
        const tree = await folderService.getFolderTree(userId);
        res.status(200).json({ success: true, data: { tree } });
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to get folder.'});
        console.error('Folder Controller Error: ', error);
    }
};
// 3. 폴더 수정
export const updateFolder = async (req: Request, res: Response) => {
    try {
        const { name, parent_id, order } = req.body;
        const updatedFolder = await folderService.updateFolder(req.params.id, name, parent_id, order);
        res.status(200).json({ success: true, data: updatedFolder });
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update folder.'});
        console.error('Folder Controller Error: ', error);
    }
};
// 4. 폴더 삭제
export const deleteFolder = async (req: Request, res: Response) => {
    try {
        await folderService.deleteFolder(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to delete folder.'});
    }
};
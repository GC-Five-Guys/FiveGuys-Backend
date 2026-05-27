import { Folder } from '../models/Folder';

export const createFolder = async (folderData: any) => {
    return await Folder.create(folderData);
};

// 유저의 모든 폴더를 정렬 (부모순, 순서순)해서 가져오기
export const findFoldersByUserId = async (userId: string) => {
    return await Folder.find({user_id: userId}).sort({ parent_id: 1, order: 1 });
};

// 특정 폴더 하나만 조회
export const findFolderById = async (id: string) => {
    return await Folder.findById(id);
};

// 특정 폴더를 부모로 둔 서브 폴더들의 부모를 새로운 ID로 일괄 변경
export const moveSubFoldersToNewParent = async (oldParentId: string, newParentId: string | null) => {
    return await Folder.updateMany({ parent_id: oldParentId }, { $set: { parent_id: newParentId } });
};

export const updateFolder = async (id: string, updateData: any) => {
    return await Folder.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteFolder = async (id: string) => {
    return await Folder.findByIdAndDelete(id);
};

export const searchFoldersByName = async (userId: string, keyword: string) => {
    return await Folder.find({
        user_id: userId,
        name: { $regex: keyword, $options: 'i' }
    });
};
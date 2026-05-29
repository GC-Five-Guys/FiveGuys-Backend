import * as folderRepository from '../repositories/folderRepository';
import * as noteRepository from '../repositories/noteRepository';

export const createFolder = async (userId: string, name: string, parent_id?: string, order?: number) => {
    return await folderRepository.createFolder({
        user_id : userId,
        name,
        parent_id : parent_id || null,
        order : order || 0
    });
};

// DB에서 일렬로 가져온 데이터를 중첩된 Tree 구조로 조립
export const getFolderTree = async (userId: string) => {
    // 💡 Repository에서 이미 .lean()을 사용하여 순수 JS 객체를 가져옵니다.
    const folderList: any[] = await folderRepository.findFoldersByUserId(userId);
    const map = new Map();
    const tree: any[] = [];

    // 1. 모든 폴더에 children 빈 배열을 달아주고, ID를 기준으로 'Map'에 등록
    folderList.forEach((f: any) => {
        f.children = [];
        map.set(f._id.toString(), f);
    });

    // 2. 부모 (parent_id)가 있으면 부모의 children 배열에 집어넣고, 없으면 최상위 (root)에 넣음
    folderList.forEach((f: any) => {
        if(f.parent_id) {
            const parent = map.get(f.parent_id.toString());
            if(parent) parent.children.push(f);
        } else {
            tree.push(f);
        }
    });
    return tree;
};

export const updateFolder = async (id: string, name?: string, parent_id?: string, order?: number) => {
    return await folderRepository.updateFolder(id, { name, parent_id, order });
};

export const deleteFolder = async (id: string) => {

    const folderToDelete = await folderRepository.findFolderById(id);
    if (!folderToDelete) return null;
    const targetParentId = folderToDelete.parent_id ? folderToDelete.parent_id.toString() : null;
    // 상위 폴더로 이동 (삭제하는 폴더가 상위 (root) 폴더 라면 parent_id를 null로 변경
    await noteRepository.moveNotesToNewFolder(id, targetParentId);
    await folderRepository.moveSubFoldersToNewParent(id, targetParentId);

    return await folderRepository.deleteFolder(id);
};
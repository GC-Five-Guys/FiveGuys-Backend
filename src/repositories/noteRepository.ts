import {Document} from "../models/Document";
// 1. [Create] 저장
export const saveNote = async (noteData: any) => {
    return await Document.create(noteData);
};

// 2. [Read] 목록 조회 (목록에선 본문 등 무거운 데이터 제외)
export const findNotesByUserId = async (userId: string) => {
    return await Document.find({ user_id: userId }).select('-content -nodes -relationships')// 목록에서 필요없으므로 제외하고 불러오기
    .sort({updated_at: -1}); // 최신 수정순으로 정렬
};

// 3. [Read] 상세 조회
export const findNoteById = async (id: string) => {
    return await Document.findById(id)
};

// [Read] 특정 날짜의 노트 조회 (1인 1일 1노트 확인용)
export const findNoteByDate = async (userId: string, date: string) => {
    return await Document.findOne({ user_id: userId, date });
};

// [Read] 특정 폴더 내의 노트 조회
export const findNotesByFolderId = async (userId: string, folderId: string | null) => {
    return await Document.find({ user_id: userId, folder_id: folderId })
        .select('-content -nodes -relationships')
        .sort({ updated_at: -1 });
};

// 4. [Update] 파일 수정
export const updateNote = async (id: string, updateData: any) => {
  return await Document.findByIdAndUpdate(id, updateData, { new: true });
};

// 5. [Delete] 삭제
export const deleteNote = async (id: string) => {
    return await Document.findByIdAndDelete(id);
};

// [Update] 특정 폴더에 속한 모든 노트의 folder_id를 새로운 부모 폴더 ID로 일괄 변경 (폴더 삭제 대비)
export const moveNotesToNewFolder = async (oldFolderId: string, newFolderId: string | null) => {
    return await Document.updateMany({ folder_id: oldFolderId }, { $set: { folder_id: newFolderId } });
};
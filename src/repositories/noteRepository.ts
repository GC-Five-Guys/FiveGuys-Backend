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

// 4. [Update] 파일 수정
export const updateNote = async (id: string, updateData: any) => {
  return await Document.findByIdAndUpdate(id, updateData, { new: true });
};

// 5. [Delete] 삭제
export const deleteNote = async (id: string) => {
    return await Document.findByIdAndDelete(id);
};
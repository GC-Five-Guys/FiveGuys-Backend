import { Note } from "../models/Note";
// 1. [Create] 저장
export const saveNote = async (noteData: any) => {
    return await Note.create(noteData);
};

// 2. [Read] 목록 조회 (목록에선 본문 등 무거운 데이터 제외)
export const findNotesByUserId = async (userId: string) => {
    return await Note.find({ user_id: userId }).select('-content -nodes -relationships')// 목록에서 필요없으므로 제외하고 불러오기
    .sort({updated_at: -1}).lean(); // 최신 수정순으로 정렬
};

// 3. [Read] 상세 조회
export const findNoteById = async (id: string) => {
    return await Note.findById(id).lean();
};

// [Read] 특정 날짜의 노트 조회 (1인 1일 1노트 확인용)
export const findNoteByDate = async (userId: string, date: string) => {
    return await Note.findOne({ user_id: userId, date }).lean();
};

// [Read] 특정 폴더 내의 노트 조회
export const findNotesByFolderId = async (userId: string, folderId: string | null) => {
    return await Note.find({ user_id: userId, folder_id: folderId })
        .select('-content -nodes -relationships')
        .sort({ updated_at: -1 }).lean();
};

// 4. [Update] 파일 수정
export const updateNote = async (id: string, updateData: any) => {
  return await Note.findByIdAndUpdate(id, updateData, { new: true }).lean();
};

// 5. [Delete] 삭제
export const deleteNote = async (id: string) => {
    return await Note.findByIdAndDelete(id).lean();
};

// [Update] 특정 폴더에 속한 모든 노트의 folder_id를 새로운 부모 폴더 ID로 일괄 변경 (폴더 삭제 대비)
export const moveNotesToNewFolder = async (oldFolderId: string, newFolderId: string | null) => {
    return await Note.updateMany({ folder_id: oldFolderId }, { $set: { folder_id: newFolderId } });
};

// 키워드 검색 (제목 검색 모드 vs 태그 필터 모드 분리)
export const searchNotesByKeyword = async (userId: string, keyword: string, tokenType?: string) => {
    // 💡 버튼을 눌렀을 때 (태그 필터 모드): 임베드된 nodes 배열 안에서 정확한 타입과 라벨을 찾습니다!
    if (tokenType) {
        return await Note.find({
            user_id: userId,
            nodes: { 
                $elemMatch: { 
                    label: { $regex: keyword, $options: 'i' }, 
                    token_type: tokenType 
                } 
            }
        }).select('title date folder_id').lean();
    }

    // 💡 버튼을 누르지 않았을 때 (제목 검색 모드): 오직 제목(title)만 검색합니다.
    return await Note.find({
        user_id: userId,
        title: { $regex: keyword, $options: 'i' }
    }).select('title date folder_id').lean();
};
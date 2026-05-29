import * as noteRepository from '../repositories/noteRepository';
import { parseTags } from './TagParserService';

// 1. 노트 생성하기 (1일 1노트 규칙 반영)
export const createNote = async (userId: string, title: string, content: string, date: string)=> {
    // 1일 1노트 중복 체크
    const existingNote = await noteRepository.findNoteByDate(userId, date);
    if (existingNote) {
        throw new Error('해당 날짜에 이미 작성된 일기가 있습니다.');
    }

    const parsed = parseTags(content);
    const nodes: any[] = [
        ...parsed.mentions.map(label => ({ label, token_type: 'mention', attributes: {} })),
        ...parsed.tags.map(label => ({ label, token_type: 'tag', attributes: {} })),
        ...parsed.objects.map(label => ({ label, token_type: 'object', attributes: {} }))
    ];
    return await noteRepository.saveNote({user_id: userId, title, content, date, nodes});
};
// 2. 목록 가져오기 (날짜 및 폴더 필터링 추가)
export const getNotes = async (userId: string, date?: string, folder_id?: string) => {
    if (date) {
        return await noteRepository.findNoteByDate(userId, date);
    }
    if (folder_id) {
        // null이 문자열로 올 경우 처리
        const folderIdParam = folder_id === 'null' ? null : folder_id;
        return await noteRepository.findNotesByFolderId(userId, folderIdParam);
    }
    return await noteRepository.findNotesByUserId(userId);
};
// 3. 하나만 가져오기 (상세 조회)
export const getNoteDetail = async (id: string) => {
    return await noteRepository.findNoteById(id);
};
// 4. 수정하기 (수정 시 Parser 재가동 - 전체 수정 PUT용)
export  const updateNote = async (id: string, title: string, content: string) => {
    const parsed = parseTags(content);
    const nodes: any[] = [
        ...parsed.mentions.map(label => ({ label, token_type: 'mention', attributes: {} })),
        ...parsed.tags.map(label => ({ label, token_type: 'tag', attributes: {} })),
        ...parsed.objects.map(label => ({ label, token_type: 'object', attributes: {} }))
    ];
    return await noteRepository.updateNote(id, { title, content, nodes});
};

// 5. 부분 수정하기 (폴더 이동 등 메타데이터 수정 PATCH용)
export const updateNotePartial = async (id: string, updateData: any) => {
    return await noteRepository.updateNote(id, updateData);
};

// 6. 삭제하기
export const deleteNote = async (id: string) => {
    return await noteRepository.deleteNote(id);
}
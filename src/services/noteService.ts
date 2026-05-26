import * as noteRepository from '../repositories/noteRepository';
import { parseTags } from './TagParserService';

const tempUserId = "664a12341234123412341234"   // 임의의 값
// 1. 노트 생성하기
export const createNote = async (title: string, content: string)=> {
    const parsed = parseTags(content);
    const nodes = [
        ...parsed.mentions.map(label => ({ label, token_type: 'mention', attributes: {} })),
        ...parsed.tags.map(label => ({ label, token_type: 'tag', attributes: {} })),
        ...parsed.objects.map(label => ({ label, token_type: 'object', attributes: {} }))
    ];
    return await noteRepository.saveNote({user_id: tempUserId, title, content, nodes});
};
// 2. 목록 가져오기
export const getNotes = async () => {
    return await noteRepository.findNotesByUserId(tempUserId);
};
// 3. 하나만 가져오기 (상세 조회)
export const getNoteDetail = async (id: string) => {
    return await noteRepository.findNoteById(id);
};
// 4. 수정하기 (수정 시 Parser 재가동)
export  const updateNote = async (id: string, title: string, content: string) => {
    const parsed = parseTags(content);
    const nodes = [
        ...parsed.mentions.map(label => ({ label, token_type: 'mention', attributes: {} })),
        ...parsed.tags.map(label => ({ label, token_type: 'tag', attributes: {} })),
        ...parsed.objects.map(label => ({ label, token_type: 'object', attributes: {} }))
    ];
    return await noteRepository.updateNote(id, { title, content, nodes});
};
// 5. 삭제하기
export const deleteNote = async (id: string) => {
    return await noteRepository.deleteNote(id);
}
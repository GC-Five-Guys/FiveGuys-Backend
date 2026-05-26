import {Document} from "../models/Document";

export const saveNote = async (noteData: any) => {
    // Document 모델을 사용해 DB에 새로운 문서를 생성
    // 이 부분에서 Mongoose가 우리가 정한 스키마에 맞는지 최종 검사
    return await Document.create(noteData);
};
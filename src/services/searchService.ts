import * as noteRepository from '../repositories/noteRepository';
import * as folderRepository from '../repositories/folderRepository';
import * as nodeRepository from '../repositories/nodeRepository';

export const integrateSearch = async (userId: string, query: string, tokenType?: string)=> {
    const isTitleSearchMode = !tokenType;   // 버튼 선택 안 하면 제목 검색 모드

    // 💡 방어 로직: 검색어가 없거나 공백만 있으면 모두 빈 배열 반환
    if (!query || query.trim() === '') {
        return {
            query,
            mode: isTitleSearchMode ? 'TITLE_SEARCH' : 'TAG_FILTER_SEARCH',
            notes: [],
            folders: [],
            tags: [],
        };
    }

    const [notes, folders, tags] = await Promise.all([
        // 💡 1. 노트: tokenType이 있으면 해당 태그를 가진 노트만, 없으면 제목만 검색
        noteRepository.searchNotesByKeyword(userId, query, tokenType),

        // 💡 2. 폴더: 태그 필터 모드일 때는 폴더를 검색하지 않습니다! (빈 배열 반환)
        tokenType ? [] : folderRepository.searchFoldersByName(userId, query),

        // 3. 태그: 버튼이 선택되었을 때만 해당 타입의 태그를 검색
        tokenType ? nodeRepository.searchNodesByLabel(userId, query, tokenType) : []
    ]);

    return {
        query,
        mode: isTitleSearchMode ? 'TITLE_SEARCH' : 'TAG_FILTER_SEARCH',
        notes,
        folders,
        tags,
    };
};
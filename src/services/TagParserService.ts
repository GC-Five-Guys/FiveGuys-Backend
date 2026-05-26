// 1. 파싱 결과를 담을 상자(타입) 정의
export type ParseResult = {
    mentions: string[];
    tags: string[];
    objects: String[];
};

export const parseTags = (content: string): ParseResult => {
    const result: ParseResult = {
        mentions: [],
        tags: [],
        objects: []
    };

    // 정규표현식 (Regex): 문장 시작이나 공백 뒤에 오는 #, @, & 특수문자 찾기
    const tagRegex = /(?<=^|\s)#([가-힣A-Za-z0-9_]+)/g;          // 문장의 시작이나 공백 뒤에 #가 오는 경우는 '태그'
    const mentionRegex = /(?<=^|\s)@([가-힣A-Za-z0-9_]+)/g;      // 문장의 시작이나 공백 뒤에 @가 오는 경우는 '언급'
    const objectRegex = /(?<=^|\s)&([가-힣A-Za-z0-9_]+)/g;       // 문장의 시작이나 공백 뒤에 &가 오는 경우는 '객체'
    // 2. 단일 토큰 추출 함수 (Set을 써서 중복을 제거)
    const  extractTokens = (regex: RegExp) => {
        const matches = Array.from(content.matchAll(regex));
        return Array.from(new Set(matches.map(m => m[1]))); // 이름만 추출
    };

    result.tags = extractTokens(tagRegex);
    result.mentions = extractTokens(mentionRegex);
    result.objects = extractTokens(objectRegex);

    return result;
}
import * as noteRepository from '../repositories/noteRepository';
import { parseTags } from './TagParserService';

export const createNote = async (title: string, content: string)=> {
    const parsed = parseTags(content);

    const nodes = [
        ...parsed.mentions.map(label => ({ label, token_type: 'mention', attributes: {} })),
        ...parsed.tags.map(label => ({ label, token_type: 'tag', attributes: {} })),
        ...parsed.objects.map(label => ({ label, token_type: 'object', attributes: {} }))
    ];

    const tempUserId = "664a12341234123412341234"   // 임의의 값

    return await noteRepository.saveNote({
        user_id: tempUserId,
        title,
        content,
        nodes
    });
};
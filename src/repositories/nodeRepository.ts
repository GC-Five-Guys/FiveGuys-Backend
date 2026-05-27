import { NodeModel } from '../models/Node';

export const searchNodesByLabel = async (userId: string, keyword: string, tokenType?: string) => {
    const query: any = {
        user_id: userId,
        label: { $regex: keyword, $options: 'i' },
    };
    if (tokenType) query.token_type = tokenType;
    return await NodeModel.find(query).distinct('label');
};
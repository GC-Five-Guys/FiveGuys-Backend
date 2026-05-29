import { Schema, model } from 'mongoose';

const NodeSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    doc_id: { type: Schema.Types.ObjectId, required: true, ref: 'Note' },
    label: { type: String, required: true }, // Tag 이름
    token_type: { type: String, enum: ['mention', 'tag', 'object'], required: true }
}, { timestamps: {createdAt: 'created_at', updatedAt: false} });

NodeSchema.index({ user_id: 1, label: 1 }); // 검색 성능을 위한 인덱스
export const NodeModel = model('Node', NodeSchema);
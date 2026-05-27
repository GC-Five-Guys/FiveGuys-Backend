import { Schema, model } from 'mongoose';

const FolderSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    // parent_id가 null 이면 최상위 (root) 폴더를 의미
    parent_id: {type: Schema.Types.ObjectId, default: null, ref: 'Folder'},
    name: {type: String, required: true, maxlength: 50},
    order: {type: Number, default: 0} // 같은 부모 안에서 정렬 순서
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

export const Folder = model('Folder', FolderSchema);
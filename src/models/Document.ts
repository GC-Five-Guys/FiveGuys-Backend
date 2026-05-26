import { Schema, model } from 'mongoose';

// 1. 임베드 될 하위 규격 : 노트 안에 들어갈 '노드(@/#/&)' 모양 정의.
const NodeSchema = new Schema({
    label: { type: String, required: true },
    token_type: {
        type: String,
        enum: ['tag', 'mention', 'object'], // #: tag, @: mention, &: object
        required: true
    },
    position: {
        x: {type: Number, default: 0},
        y: {type: Number, default: 0},
    }
}, { _id: false }); // _id: false는 하위 데이터에 굳이 고유 ID를 부여하지 않겠다는 뜻.

// 2. 메인 규격: '노트' 전체 모양 정의
const DocumentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },  // User 모델을 참조
    folder_id: { type: Schema.Types.ObjectId, default: null, ref: 'Folder' },
    title: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true, maxlength: 50000 },
    is_public: { type: Boolean, default: false },

    // 노트 하나에 여러 개의 노드(태그 등)가 배열 형태로 저장
    nodes: [NodeSchema],
    // 관계 데이터도 마찬가지로 배열로 저장
    relationships: [{
        source: String,
        target: String,
        type: { type: String, default: 'co_occurrence' },
        weight: { type: Number, default: 1 } // 관계 가중치
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Document = model("Document", DocumentSchema);
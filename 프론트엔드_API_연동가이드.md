# 🔌 Tri-Link API 명세서 (v2)

> **대상 독자**: 프론트엔드 팀 (API 연동 가이드)
> **Base URL**: `http://localhost:4000/api/v1`
> **응답 형식 (공통)**: 
> - 성공 시: `{ "success": true, "data": { ... } }`
> - 실패 시: `{ "success": false, "message": "에러 메시지" }` (필요 시 HTTP Status Code 에러 처리를 따름)

---

## 📂 1. 폴더 관리 (Folder)

### 1.1 폴더 트리 조회
- **Method / URL**: `GET /folders`
- **설명**: 사용자의 전체 폴더 목록을 계층형(Tree) 구조로 조립하여 반환합니다.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "tree": [
        {
          "_id": "폴더ID",
          "name": "2026년 일기",
          "parent_id": null,
          "order": 0,
          "children": [
             { "_id": "하위폴더ID", "name": "5월", ... }
          ]
        }
      ]
    }
  }
  ```

### 1.2 폴더 생성
- **Method / URL**: `POST /folders`
- **Request Body (JSON)**:
  ```json
  {
    "name": "즐거웠던 기억",
    "parent_id": "상위폴더ID (최상위면 null 혹은 생략)",
    "order": 0
  }
  ```
- **Response (201 Created)**: 생성된 폴더 객체

### 1.3 폴더 수정
- **Method / URL**: `PATCH /folders/:id`
- **설명**: 폴더 이름 변경이나 부모 폴더 이동 시 사용합니다.
- **Request Body (JSON)**: (변경할 속성만 전송)
  ```json
  { "name": "수정할 이름" }
  ```

### 1.4 폴더 삭제 (계층적 대피 로직 적용)
- **Method / URL**: `DELETE /folders/:id`
- **설명**: 폴더를 삭제합니다. 이 폴더 안에 있던 일기(노트)와 하위 폴더들은 상위 폴더(혹은 루트)로 안전하게 자동 대피됩니다.
- **Response (204 No Content)**

---

## 📝 2. 일기(노트) 관리 (Note)

### 2.1 일기 목록 필터링 조회 (캘린더 & 폴더 클릭 시)
- **Method / URL**: `GET /notes`
- **Query Parameters**:
  - `?date=YYYY-MM-DD` : (선택) 캘린더에서 특정 날짜 클릭 시 해당 날짜의 일기만 조회합니다.
  - `?folder_id=폴더ID` : (선택) 사이드바에서 특정 폴더 클릭 시 해당 폴더의 일기만 조회합니다. (최상위 루트 조회 시 `folder_id=null` 로 요청)
- **설명**: 최적화를 위해 본문(`content`)과 태그(`nodes`) 정보를 제외한 메타데이터만 반환합니다.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      { "_id": "노트ID", "title": "일기 제목", "date": "2026-05-25", "folder_id": "..." }
    ]
  }
  ```

### 2.2 일기 상세 조회
- **Method / URL**: `GET /notes/:id`
- **설명**: 에디터에 띄울 전체 내용과 파싱된 태그(`nodes`) 배열을 모두 반환합니다.

### 2.3 일기 생성 (1인 1일 1일기 강제)
- **Method / URL**: `POST /notes`
- **Request Body (JSON)**:
  ```json
  {
    "date": "2026-05-25", // 캘린더 날짜 (필수)
    "title": "일기 제목",
    "content": "일기 본문 내용 @인물 #주제 &오브젝트" 
  }
  ```
- **Response**: 
  - 성공 (201): 생성된 일기 객체 (태그 파싱 완료)
  - 실패 (409 Conflict): "해당 날짜에 이미 작성된 일기가 있습니다."

### 2.4 일기 전체 수정 (자동저장 시)
- **Method / URL**: `PUT /notes/:id`
- **설명**: Tiptap 에디터에서 본문이 변경되어 자동저장될 때 호출합니다. 백엔드에서 태그 파서를 재가동하여 `nodes` 배열을 갱신합니다.
- **Request Body (JSON)**:
  ```json
  { "title": "수정된 제목", "content": "수정된 본문" }
  ```

### 2.5 일기 부분 수정 (폴더 드롭다운 이동)
- **Method / URL**: `PATCH /notes/:id`
- **설명**: 본문 수정 없이 메타데이터(예: 소속 폴더 변경)만 고칠 때 사용합니다. 무거운 태그 파싱 과정을 생략하여 속도가 빠릅니다.
- **Request Body (JSON)**:
  ```json
  { "folder_id": "이동할_폴더_ID" } 
  ```

### 2.6 일기 삭제 (하드 삭제)
- **Method / URL**: `DELETE /notes/:id`
- **Response (204 No Content)**

---

## 🔍 3. 통합 검색 (Search)

### 3.1 통합 검색 (제목 & 태그 모드)
- **Method / URL**: `GET /search`
- **Query Parameters**:
  - `?q=검색어` : (필수) 검색할 키워드 (URL 인코딩 필수)
  - `?type=` : (선택) 프론트엔드 버튼 토글 상태 (`#`, `@`, `&`). 이 특수기호는 반드시 `encodeURIComponent()`를 통해 **`%23`, `%40`, `%26`** 으로 인코딩해서 보내야 합니다!
- **동작 방식**:
  - `type`이 없을 때: **[제목 검색 모드]** 노트의 제목과 폴더 이름만 검색합니다. (본문 및 태그 무시)
  - `type`이 있을 때: **[태그 필터 모드]** 본문에 해당 태그 배지가 달린 일기만 검색합니다. (폴더 검색 무시)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "query": "기획",
      "mode": "TITLE_SEARCH 혹은 TAG_FILTER_SEARCH",
      "notes": [ ... ],
      "folders": [ ... ],
      "tags": [ ... ] 
    }
  }
  ```
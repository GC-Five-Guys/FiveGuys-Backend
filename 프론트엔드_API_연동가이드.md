# 🔌 Tri-Link API 명세서 (v2)

> **대상 독자**: 프론트엔드 팀 (API 연동 가이드)
> **Base URL**: `http://localhost:4000/api/v1`
> **응답 형식 (공통)**: 
> - 성공 시: `{ "success": true, "data": { ... } }`
> - 실패 시: `{ "success": false, "message": "에러 메시지" }` (필요 시 HTTP Status Code 에러 처리를 따름)

---

## 🛡️ 0. 인증 (Authentication)

모든 데이터 요청(폴더, 일기, 검색 등)은 로그인 후 발급받은 **JWT 토큰**이 필요합니다.

### **공통 규칙: Authorization 헤더**
- **Header Key**: `Authorization`
- **Header Value**: `Bearer <토큰값>`
- 로그인/회원가입을 제외한 모든 API 호출 시 이 헤더를 포함해야 합니다.

### 0.1 회원가입 (Sign Up)
- **Method / URL**: `POST /auth/signup`
- **Request Body (JSON)**:
  ```json
  {
    "username": "아이디",
    "email": "이메일",
    "password": "비밀번호",
    "display_name": "닉네임"
  }
  ```
- **Response (201 Created)**: 성공 시 유저 정보와 `token` 반환

### 0.2 로그인 (Login)
- **Method / URL**: `POST /auth/login`
- **Request Body (JSON)**:
  ```json
  {
    "email": "이메일",
    "password": "비밀번호"
  }
  ```
- **Response (200 OK)**: 성공 시 유저 정보와 새로운 `token` 반환

---

## 📂 1. 폴더 관리 (Folder) - [Token 필요]

### 1.1 폴더 트리 조회
- **Method / URL**: `GET /folders`
- **설명**: 사용자의 전체 폴더 목록을 계층형(Tree) 구조로 조립하여 반환합니다.

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

### 1.3 폴더 수정
- **Method / URL**: `PATCH /folders/:id`

### 1.4 폴더 삭제
- **Method / URL**: `DELETE /folders/:id`

---

## 📝 2. 일기(노트) 관리 (Note) - [Token 필요]

### 2.1 일기 목록 필터링 조회 (캘린더 & 폴더 클릭 시)
- **Method / URL**: `GET /notes`
- **Query Parameters**:
  - `?date=YYYY-MM-DD` : 해당 날짜의 일기만 조회
  - `?folder_id=폴더ID` : 해당 폴더의 일기만 조회

### 2.2 일기 상세 조회
- **Method / URL**: `GET /notes/:id`

### 2.3 일기 생성 (1인 1일 1일기 강제)
- **Method / URL**: `POST /notes`
- **Request Body (JSON)**:
  ```json
  {
    "date": "2026-05-25",
    "title": "일기 제목",
    "content": "일기 본문 내용 @인물 #주제 &오브젝트" 
  }
  ```
- **Response**: 409 Conflict 발생 시 이미 일기가 있음을 의미

### 2.4 일기 전체 수정 (자동저장 시)
- **Method / URL**: `PUT /notes/:id`

### 2.5 일기 부분 수정 (폴더 드롭다운 이동)
- **Method / URL**: `PATCH /notes/:id`

### 2.6 일기 삭제 (하드 삭제)
- **Method / URL**: `DELETE /notes/:id`

---

## 🔍 3. 통합 검색 (Search) - [Token 필요]

### 3.1 통합 검색 (제목 & 태그 모드)
- **Method / URL**: `GET /search`
- **Query Parameters**:
  - `?q=검색어` : (URL 인코딩 필수)
  - `?type=` : (`%23`, `%40`, `%26` 인코딩 권장)
- **동작 방식**: `type` 유무에 따라 제목 검색 또는 태그 필터 검색 수행
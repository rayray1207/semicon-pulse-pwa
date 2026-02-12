# 📦 Semicon Pulse PWA - 전체 파일 구조 및 설명

## 📁 프로젝트 파일 트리

```
semicon-pulse-pwa/
│
├── 📄 README.md                    # 완전한 사용 가이드 (처음~배포까지)
├── 📄 QUICKSTART.md                # 빠른 시작 가이드 (5분 배포)
├── 📄 package.json                 # Node.js 의존성 및 스크립트
├── 📄 firebase.json                # Firebase 호스팅 설정
├── 📄 .firebaserc                  # Firebase 프로젝트 참조
├── 📄 .gitignore                   # Git 무시 파일 목록
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 update_news.yml      # GitHub Actions 자동화 (RSS 수집 + 배포)
│
├── 📂 public/                      # Firebase Hosting 배포 폴더
│   ├── 📄 index.html               # 메인 PWA 앱 (HTML + CSS + JS 올인원)
│   ├── 📄 manifest.json            # PWA 매니페스트 (앱 메타데이터)
│   ├── 📄 sw.js                    # 서비스 워커 (오프라인 지원, 캐싱)
│   ├── 📄 news.json                # 뉴스 데이터 (자동 생성/업데이트)
│   └── 📂 icons/
│       ├── 📄 ICONS_README.md      # 아이콘 생성 가이드
│       ├── 🖼️ icon-192.png         # PWA 아이콘 192x192 (생성 필요)
│       └── 🖼️ icon-512.png         # PWA 아이콘 512x512 (생성 필요)
│
└── 📂 scripts/
    └── 📄 fetchFeeds.js            # RSS 수집 스크립트 (Node.js)
```

---

## 📄 각 파일 상세 설명

### 1. 루트 파일들

#### `README.md` ⭐
- **목적**: 프로젝트 전체 가이드
- **내용**:
  - 프로젝트 소개 및 특징
  - 처음부터 배포까지 10단계 완전 가이드
  - Firebase 설정, GitHub Actions 연동 방법
  - 문제 해결, 커스터마이징, 비용 정보
- **대상**: 비전공자도 따라할 수 있도록 자세하게 작성됨

#### `QUICKSTART.md` 🚀
- **목적**: 경험자용 빠른 시작 가이드
- **내용**: 5분 안에 배포하는 핵심 명령어만 정리
- **대상**: Firebase/Git 경험자

#### `package.json` 📦
- **목적**: Node.js 프로젝트 정의 및 의존성 관리
- **주요 의존성**:
  - `rss-parser`: RSS 피드 파싱
  - `firebase-tools`: Firebase CLI (배포 도구)
- **스크립트**:
  - `npm run fetch`: RSS 수집 실행
  - `npm run deploy`: Firebase 배포

#### `firebase.json` ⚙️
- **목적**: Firebase Hosting 설정
- **주요 설정**:
  - `public: "public"`: 배포할 폴더 지정
  - 캐시 정책: 정적 파일 1년, news.json 5분
  - CORS 헤더 자동 설정
  - SPA 라우팅 (모든 경로 → index.html)

#### `.firebaserc` 🔗
- **목적**: Firebase 프로젝트 ID 저장
- **설정 필요**: `firebase init` 시 자동 생성됨

#### `.gitignore` 🚫
- **목적**: Git 버전 관리에서 제외할 파일 목록
- **주요 항목**: node_modules, 로그 파일, 환경 변수 등

---

### 2. GitHub Actions 워크플로우

#### `.github/workflows/update_news.yml` 🤖
- **목적**: 뉴스 자동 수집 및 배포 파이프라인
- **트리거**:
  - 스케줄: 매일 6시간마다 (00:00, 06:00, 12:00, 18:00 UTC)
  - 수동 실행: GitHub Actions 탭에서 "Run workflow" 버튼
- **작업 흐름**:
  1. 저장소 체크아웃
  2. Node.js 설치
  3. 의존성 설치 (`npm ci`)
  4. RSS 수집 스크립트 실행
  5. 변경사항 감지 및 커밋 (선택 사항)
  6. Firebase Hosting에 배포
- **필수 Secrets**:
  - `FIREBASE_SERVICE_ACCOUNT`: Firebase 서비스 계정 JSON
  - `FIREBASE_PROJECT_ID`: Firebase 프로젝트 ID
  - `GITHUB_TOKEN`: 자동 제공됨

---

### 3. Public 폴더 (배포 파일들)

#### `public/index.html` 🌐
- **목적**: 메인 PWA 프론트엔드 (올인원 파일)
- **구성**:
  - **HTML**: 시맨틱 마크업, 메타 태그, PWA 설정
  - **CSS**: 
    - CSS 변수로 다크/라이트 테마 관리
    - 반응형 디자인 (모바일 우선)
    - 미니멀 뉴스 앱 스타일
    - Skeleton UI (로딩 중 표시)
  - **JavaScript**:
    - 바닐라 JS (의존성 없음)
    - news.json 페칭 및 렌더링
    - 탭 필터링 (Top, 최신, 카테고리별)
    - 검색 기능
    - 테마 토글 (다크/라이트)
    - 즐겨찾기 (LocalStorage)
    - PWA 설치 프롬프트
    - 서비스 워커 등록
- **폰트**: IBM Plex Sans (Google Fonts)
- **특징**:
  - 의존성 제로 (라이브러리 없음)
  - 모든 기능이 하나의 파일에
  - 약 500줄의 깔끔한 코드

#### `public/manifest.json` 📱
- **목적**: PWA 앱 메타데이터
- **주요 설정**:
  - 앱 이름, 아이콘, 테마 색상
  - 디스플레이 모드: standalone (네이티브 앱처럼)
  - 시작 URL, 오리엔테이션
  - 바로가기 (Shortcuts): Top 뉴스, 최신 뉴스

#### `public/sw.js` ⚙️
- **목적**: 서비스 워커 (PWA 핵심 기능)
- **기능**:
  - **오프라인 지원**: 정적 파일 캐싱
  - **뉴스 캐싱**: Network First 전략 (항상 최신 우선, 실패 시 캐시)
  - **정적 파일**: Cache First 전략 (빠른 로딩)
  - **캐시 버전 관리**: 업데이트 시 자동 갱신
  - **백그라운드 동기화**: 향후 확장 가능
  - **푸시 알림**: 향후 확장 가능
- **캐시 이름**:
  - `semicon-pulse-v1.0.0`: 정적 파일
  - `news-cache-v1`: 뉴스 데이터

#### `public/news.json` 📰
- **목적**: 뉴스 데이터 저장소
- **구조**:
  ```json
  {
    "generatedAt": "2025-02-07T10:00:00.000Z",
    "totalArticles": 15,
    "topArticles": [...],  // 중요도 높은 10개
    "allArticles": [...]   // 전체 기사
  }
  ```
- **각 기사 필드**:
  - `title`: 제목
  - `summary`: 요약 (RSS description)
  - `url`: 원문 링크
  - `publishedAt`: 발행 시간 (ISO 8601)
  - `source`: 출처 이름
  - `sourceDomain`: 도메인
  - `category`: 카테고리
  - `tags`: 태그 배열 (자동 추출)
- **생성 방법**:
  - `scripts/fetchFeeds.js`에 의해 자동 생성
  - 샘플 데이터가 미리 포함되어 있음

#### `public/icons/` 🖼️
- **목적**: PWA 아이콘 저장
- **필요 파일**:
  - `icon-192.png`: 192x192px (Android, PWA 설치 프롬프트)
  - `icon-512.png`: 512x512px (스플래시 스크린, 홈 화면)
- **생성 방법**: `ICONS_README.md` 참고
- **현재 상태**: 파일 없음 (사용자가 생성 필요)
- **임시 해결책**: ImageMagick으로 텍스트 아이콘 생성 가능

---

### 4. Scripts 폴더

#### `scripts/fetchFeeds.js` 🔄
- **목적**: RSS 피드 수집 및 JSON 생성
- **주요 기능**:
  1. **RSS 파싱**: `rss-parser` 라이브러리 사용
  2. **다중 피드 처리**: 병렬로 여러 소스 수집
  3. **태그 자동 추출**: 키워드 매칭으로 카테고리 분류
  4. **중복 제거**: URL 기준 유니크화
  5. **중요도 점수 계산**: 
     - 최근성 (24시간 이내 +10점)
     - 중요 키워드 (HBM, AI, EUV 등 +5점)
     - 태그 개수 (+2점/태그)
  6. **Top 기사 선정**: 상위 10개
  7. **정렬**: 날짜 기준 내림차순
  8. **JSON 저장**: `public/news.json`에 저장
- **RSS 소스 설정**:
  - `RSS_FEEDS` 배열에 정의
  - 현재 3개 소스 (예시)
  - 사용자가 자유롭게 추가/변경 가능
- **키워드 맵**:
  - HBM, Foundry, Equipment, Memory, AI, EUV, Packaging 등
  - 각 키워드별 동의어 및 관련 용어 정의
- **에러 처리**:
  - 개별 피드 실패 시 계속 진행
  - 전체 실패 시 데모 데이터 생성
- **실행 방법**:
  ```bash
  node scripts/fetchFeeds.js
  ```

---

## 🔄 데이터 흐름

```
[RSS 소스들]
    ↓
[fetchFeeds.js] ← (GitHub Actions 6시간마다 실행)
    ↓
[public/news.json] ← (Firebase Hosting에 배포)
    ↓
[index.html] ← (fetch()로 데이터 로드)
    ↓
[사용자 브라우저]
    ↓
[서비스 워커] ← (캐싱 및 오프라인 지원)
```

---

## 🎨 UI/UX 설계 철학

### 디자인 원칙
1. **미니멀리즘**: 불필요한 장식 제거, 정보에 집중
2. **정보 밀도**: 한 화면에 많은 기사 표시
3. **성능 우선**: 애니메이션 최소화, 빠른 로딩
4. **접근성**: 시맨틱 HTML, 키보드 네비게이션

### 색상 팔레트
- **다크 모드** (기본):
  - 배경: `#0f172a` (진한 네이비)
  - 카드: `#1e293b` (약간 밝은 네이비)
  - 주요 색상: `#3b82f6` (파란색)
  - 텍스트: `#f1f5f9` (거의 흰색)

- **라이트 모드**:
  - 배경: `#f8fafc` (거의 흰색)
  - 카드: `#ffffff` (순백)
  - 텍스트: `#0f172a` (진한 네이비)

### 타이포그래피
- **본문**: IBM Plex Sans (Google Fonts)
  - 깔끔하고 읽기 쉬운 산세리프
  - 웹폰트 최적화 (preconnect)
- **액센트**: Courier New (모노스페이스)
  - 태그 표시에 사용

### 반응형 브레이크포인트
- 모바일: 기본 (~ 640px)
- 태블릿: 자동 조정
- 데스크톱: 최대 900px 제한 (가독성)

---

## 🔐 보안 고려사항

1. **CORS**: Firebase Hosting 자동 처리
2. **XSS 방지**: 
   - `escapeHtml()` 함수로 모든 사용자 입력 이스케이프
   - `innerHTML` 대신 `textContent` 사용 (가능한 경우)
3. **외부 링크**: `rel="noopener noreferrer"` 속성
4. **서비스 워커**: HTTPS 필수 (Firebase 자동 제공)
5. **API 키 없음**: 완전히 정적 호스팅 (보안 리스크 제로)

---

## 📊 성능 최적화

1. **번들 크기**: 
   - 의존성 제로 (바닐라 JS)
   - 단일 HTML 파일 (~30KB)
   - 웹폰트 지연 로딩

2. **로딩 전략**:
   - Skeleton UI (체감 속도 개선)
   - 서비스 워커 캐싱
   - news.json만 동적 페칭

3. **캐싱**:
   - 정적 파일: 1년 (Cache-Control)
   - news.json: 5분
   - 서비스 워커: 영구 (버전 관리)

4. **이미지**:
   - 아이콘만 사용 (기사 이미지 없음)
   - WebP 지원 고려 (향후)

---

## 🚀 배포 프로세스

### 초기 배포 (수동)
```bash
npm install
npx firebase login
npx firebase init hosting
npx firebase deploy
```

### 자동 배포 (GitHub Actions)
1. GitHub에 푸시
2. Actions가 6시간마다 자동 실행
3. RSS 수집 → news.json 업데이트
4. Firebase에 자동 배포

---

## 📈 향후 확장 아이디어

1. **백엔드 통합** (Blaze 플랜 필요 시):
   - Cloud Functions로 RSS 수집
   - Firestore로 데이터 저장
   - 실시간 업데이트

2. **사용자 기능**:
   - 계정 시스템 (Firebase Auth)
   - 클라우드 동기화 즐겨찾기
   - 개인화 추천

3. **AI 기능**:
   - 기사 요약 (Anthropic API)
   - 트렌드 분석
   - 알림 자동화

4. **데이터 시각화**:
   - 키워드 트렌드 차트
   - 출처별 통계
   - 시계열 분석

5. **다국어**:
   - i18n 라이브러리
   - 한/영 자동 전환

---

## 🆘 자주 묻는 질문 (FAQ)

**Q1: Firebase 무료 플랜으로 얼마나 버틸 수 있나요?**
- A: 일일 방문자 수백~수천 명 수준은 문제없습니다. 호스팅 트래픽이 360MB/일 제한이므로, 대략 일 1,000명 방문 시 약 36KB/방문 = 안전합니다.

**Q2: GitHub Actions 무료 제한은?**
- A: Public 저장소는 무제한입니다. Private 저장소는 월 2,000분 제한 (충분함).

**Q3: RSS 소스를 어떻게 추가하나요?**
- A: `scripts/fetchFeeds.js`의 `RSS_FEEDS` 배열에 추가하세요.

**Q4: 뉴스가 업데이트되지 않아요.**
- A: GitHub Actions 로그 확인 → Secrets 설정 확인 → 로컬에서 `node scripts/fetchFeeds.js` 테스트.

**Q5: PWA 설치가 안 돼요.**
- A: HTTPS 필요 (Firebase 배포 후 가능), 아이콘 파일 존재 확인, manifest.json 확인.

---

**만든 이**: Claude (Anthropic)  
**라이선스**: MIT  
**버전**: 1.0.0  
**최종 수정**: 2025-02-07

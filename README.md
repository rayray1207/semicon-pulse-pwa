# 🔵 Semicon Pulse - 반도체 뉴스 PWA

Firebase 무료 플랜(Spark)만으로 운영 가능한 반도체 뉴스 집계 PWA입니다.

## ✨ 주요 특징

- **완전 무료**: Firebase Spark 플랜 + GitHub Actions 무료 tier만 사용
- **자동 업데이트**: 매일 4회(6시간마다) RSS 피드 자동 수집
- **PWA 지원**: 오프라인 작동, 홈 화면 설치, 푸시 알림 준비됨
- **반응형 디자인**: 모바일 우선, 데스크톱까지 최적화
- **다크모드**: 기본 다크 + 라이트 모드 토글
- **빠른 로딩**: Skeleton UI, 최소 의존성

## 📁 프로젝트 구조

```
semicon-pulse-pwa/
├── .github/
│   └── workflows/
│       └── update_news.yml         # GitHub Actions 스케줄 작업
├── public/
│   ├── index.html                  # 메인 HTML
│   ├── manifest.json               # PWA 매니페스트
│   ├── sw.js                       # 서비스 워커
│   ├── news.json                   # 수집된 뉴스 데이터 (자동 생성)
│   └── icons/                      # PWA 아이콘들 (생성 필요)
│       ├── icon-192.png
│       └── icon-512.png
├── scripts/
│   └── fetchFeeds.js               # RSS 수집 스크립트
├── firebase.json                   # Firebase 호스팅 설정
├── .firebaserc                     # Firebase 프로젝트 설정
├── package.json                    # Node.js 의존성
└── README.md                       # 이 파일
```

## 🚀 처음부터 배포까지 (단계별 가이드)

### 1단계: 사전 준비

**필요한 것:**
- Node.js 18 이상 (https://nodejs.org)
- Git (https://git-scm.com)
- GitHub 계정
- Google/Firebase 계정

**확인:**
```bash
node --version  # v18 이상
npm --version
git --version
```

### 2단계: Firebase 프로젝트 생성

1. Firebase Console 접속: https://console.firebase.google.com
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `semicon-pulse`)
4. Google 애널리틱스는 선택 사항 (Skip 가능)
5. 프로젝트 생성 완료!

### 3단계: 로컬에서 프로젝트 설정

```bash
# 1. 이 프로젝트를 원하는 폴더에 다운로드/압축 해제

# 2. 프로젝트 폴더로 이동
cd semicon-pulse-pwa

# 3. 의존성 설치
npm install

# 4. Firebase CLI 로그인
npx firebase login

# 5. Firebase 프로젝트 초기화
npx firebase init hosting

# 대화형 질문에 답변:
# - "Use an existing project" 선택
# - 위에서 만든 프로젝트 선택
# - Public directory: public 입력
# - Single-page app: Yes
# - Set up automatic builds with GitHub: No (나중에 수동 설정)
# - Overwrite index.html: No (중요!)
```

### 4단계: PWA 아이콘 생성

PWA 아이콘이 필요합니다. 두 가지 방법:

**방법 A: 온라인 생성기 사용 (추천)**
1. https://realfavicongenerator.net 또는 https://www.pwabuilder.com 방문
2. 512x512 PNG 이미지 업로드 (반도체 칩 이미지 등)
3. 생성된 아이콘들을 `public/icons/` 폴더에 저장
4. 최소한 필요: `icon-192.png`, `icon-512.png`

**방법 B: 임시 아이콘 (개발용)**
```bash
# ImageMagick 설치 필요 (macOS: brew install imagemagick)
mkdir -p public/icons
convert -size 192x192 xc:blue -fill white -pointsize 100 -gravity center -annotate +0+0 "SP" public/icons/icon-192.png
convert -size 512x512 xc:blue -fill white -pointsize 260 -gravity center -annotate +0+0 "SP" public/icons/icon-512.png
```

### 5단계: 초기 뉴스 데이터 생성

```bash
# RSS 피드 수집 스크립트 실행
node scripts/fetchFeeds.js

# public/news.json 파일이 생성되었는지 확인
ls -lh public/news.json
```

### 6단계: 로컬에서 테스트

```bash
# Firebase 호스팅 에뮬레이터 실행
npx firebase serve

# 브라우저에서 열기: http://localhost:5000
# PWA 기능 테스트는 HTTPS 필요 (배포 후 테스트)
```

### 7단계: Firebase에 첫 배포

```bash
# 빌드 및 배포
npx firebase deploy --only hosting

# 성공하면 배포 URL이 표시됩니다:
# ✔ Deploy complete!
# Hosting URL: https://semicon-pulse.web.app
```

### 8단계: GitHub 저장소 생성 및 연결

```bash
# 1. GitHub에서 새 저장소 생성 (예: semicon-pulse-pwa)
# 2. 로컬 Git 초기화
git init
git add .
git commit -m "Initial commit: Semicon Pulse PWA"

# 3. GitHub 저장소와 연결 (본인의 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/semicon-pulse-pwa.git
git branch -M main
git push -u origin main
```

### 9단계: GitHub Actions 자동화 설정

**GitHub Secrets 설정 (중요!):**

1. GitHub 저장소 페이지 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 다음 시크릿 추가:

**FIREBASE_SERVICE_ACCOUNT:**
```bash
# Firebase 서비스 계정 키 생성:
# 1. Firebase Console → 프로젝트 설정 → 서비스 계정
# 2. "새 비공개 키 생성" 클릭
# 3. 다운로드된 JSON 파일 내용 전체를 복사
# 4. GitHub Secret에 붙여넣기
```

**FIREBASE_PROJECT_ID:**
```
값: semicon-pulse (본인의 Firebase 프로젝트 ID)
```

4. Secrets이 추가되었는지 확인

**Actions 활성화:**
```bash
# .github/workflows/update_news.yml이 이미 있으므로
# Git push하면 자동으로 Actions가 활성화됩니다

git add .github/workflows/update_news.yml
git commit -m "Add GitHub Actions workflow"
git push
```

5. GitHub 저장소 → Actions 탭에서 워크플로우 확인
6. 워크플로우 수동 실행 테스트:
   - Actions → "Update News Feeds" → "Run workflow"

### 10단계: 스케줄 확인 및 모니터링

**자동 실행 스케줄:**
- 매일 00:00, 06:00, 12:00, 18:00 (UTC 기준)
- 한국 시간: 09:00, 15:00, 21:00, 03:00

**모니터링:**
```bash
# GitHub Actions 로그 확인
# 저장소 → Actions → 최근 실행 클릭

# 배포 확인
# https://semicon-pulse.web.app에서 뉴스 업데이트 확인
```

## 🔧 설정 커스터마이징

### RSS 피드 소스 변경

`scripts/fetchFeeds.js` 파일에서 `RSS_FEEDS` 배열을 수정하세요:

```javascript
const RSS_FEEDS = [
  {
    url: 'https://example.com/rss',
    source: 'Example News',
    category: 'General'
  },
  // 원하는 피드 추가...
];
```

### 업데이트 주기 변경

`.github/workflows/update_news.yml`에서 cron 스케줄 수정:

```yaml
schedule:
  - cron: '0 */6 * * *'  # 6시간마다 → 원하는 주기로 변경
```

### UI 색상/스타일 변경

`public/index.html`의 CSS 변수 섹션 수정:

```css
:root {
  --primary: #3b82f6;     /* 메인 색상 */
  --bg-dark: #0f172a;     /* 다크 배경 */
  /* 기타 색상... */
}
```

### 카테고리 태그 추가

`scripts/fetchFeeds.js`의 `extractTags()` 함수에서 키워드 추가:

```javascript
const keywordMap = {
  'HBM': ['HBM', 'High Bandwidth Memory'],
  'Custom': ['원하는키워드'],  // 새 카테고리 추가
  // ...
};
```

## 📊 비용 및 제한사항

### Firebase Spark (무료) 제한
- **호스팅 저장소**: 10GB (충분함)
- **호스팅 트래픽**: 360MB/일 (일일 방문자 수천 명 수준 가능)
- **Functions**: 사용 안 함 ✅

### GitHub Actions 무료 제한
- **실행 시간**: 월 2,000분 (충분함)
- **저장소**: Public 저장소는 무제한 ✅

### 예상 사용량
- RSS 수집: 1회 약 1분 → 월 120분 (여유 있음)
- 호스팅: 일 100명 방문 시 약 50MB (여유 있음)

## 🐛 문제 해결

### "firebase.json not found" 오류
```bash
# Firebase 재초기화
npx firebase init hosting
```

### GitHub Actions 실행 실패
```bash
# Secrets 설정 확인
# GitHub → Settings → Secrets → FIREBASE_SERVICE_ACCOUNT 존재 확인
```

### PWA 설치 버튼이 안 보임
- HTTPS 필요 (localhost는 제외)
- 배포 후 https://your-app.web.app에서 테스트
- 아이콘 파일 존재 확인 (`public/icons/`)

### 뉴스가 업데이트 안 됨
```bash
# 로컬에서 스크립트 테스트
node scripts/fetchFeeds.js

# GitHub Actions 로그 확인
# 저장소 → Actions → 최근 워크플로우 클릭
```

### CORS 오류
- Firebase Hosting은 자동으로 CORS 허용
- `firebase.json`에 헤더 설정 확인

## 🎨 향후 개선 아이디어

- [ ] 사용자 즐겨찾기 로컬 저장 (LocalStorage)
- [ ] 웹 푸시 알림 (중요 키워드 알림)
- [ ] 다국어 지원 (한/영)
- [ ] RSS 피드 자동 발견 (OPML import)
- [ ] 기사 요약 AI 통합 (외부 API)
- [ ] 읽음 표시 기능
- [ ] 공유 기능 (Web Share API)

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

## 🤝 기여

이슈 및 PR 환영합니다!

---

**만든 이:** Semicon Pulse Team  
**문의:** GitHub Issues

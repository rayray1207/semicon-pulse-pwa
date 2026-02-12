# 🎯 Semicon Pulse PWA - 시작하기

완전 무료 반도체 뉴스 앱을 만들어드렸습니다! 🎉

---

## ✅ 체크리스트

프로젝트를 시작하기 전에 확인하세요:

- [ ] Node.js 18 이상 설치됨 (`node --version`)
- [ ] Git 설치됨 (`git --version`)
- [ ] Firebase 계정 있음 (https://console.firebase.google.com)
- [ ] GitHub 계정 있음 (자동화 원하면 필수)

---

## 🚀 3가지 시작 방법

### 방법 1: 빠른 로컬 테스트 (5분)

```bash
# 1. 압축 해제 후 폴더로 이동
cd semicon-pulse-pwa

# 2. 의존성 설치
npm install

# 3. 로컬 서버 실행
npx firebase serve

# 4. 브라우저에서 열기
# http://localhost:5000
```

### 방법 2: Firebase 배포 (10분)

```bash
# 위의 방법 1 실행 후...

# 4. Firebase 로그인
npx firebase login

# 5. Firebase 초기화
npx firebase init hosting
# → Use an existing project
# → Public directory: public
# → Single-page app: Yes
# → Overwrite index.html: No

# 6. 배포!
npx firebase deploy --only hosting
```

### 방법 3: 완전 자동화 (30분)

**README.md** 파일의 "처음부터 배포까지 10단계" 가이드를 따라하세요.
GitHub Actions로 6시간마다 자동 업데이트됩니다!

---

## 📂 핵심 파일

시작하기 전에 이 파일들만 확인하세요:

| 파일 | 용도 | 필수 수정 |
|------|------|----------|
| **README.md** | 완전한 가이드 | 읽기만 |
| **QUICKSTART.md** | 빠른 시작 | 읽기만 |
| **PROJECT_STRUCTURE.md** | 전체 구조 설명 | 읽기만 |
| `.firebaserc` | Firebase 프로젝트 ID | 자동 생성 |
| `scripts/fetchFeeds.js` | RSS 소스 목록 | 원하면 수정 |
| `public/icons/` | PWA 아이콘 | 아이콘 추가 |

---

## 🎨 첫 커스터마이징

### 1. 앱 이름 변경

**`public/index.html`** (26번째 줄):
```html
<title>내 앱 이름 - 반도체 뉴스</title>
```

**`public/manifest.json`** (2번째 줄):
```json
"name": "내 앱 이름",
"short_name": "내 앱",
```

### 2. 색상 변경

**`public/index.html`** (CSS 변수 섹션):
```css
:root {
  --primary: #3b82f6;  /* 원하는 색상으로 변경 */
}
```

### 3. RSS 소스 추가

**`scripts/fetchFeeds.js`** (RSS_FEEDS 배열):
```javascript
const RSS_FEEDS = [
  {
    url: 'https://example.com/rss',
    source: 'My Source',
    category: 'Technology'
  },
  // 원하는 만큼 추가...
];
```

### 4. 아이콘 생성

**옵션 A**: https://realfavicongenerator.net 사용 (권장)
**옵션 B**: `public/icons/ICONS_README.md` 참고

---

## 📚 문서 읽는 순서

1. **START_HERE.md** ← 지금 보고 있는 파일 ✅
2. **QUICKSTART.md** ← 5분 만에 배포
3. **README.md** ← 완전한 가이드 (처음~끝)
4. **PROJECT_STRUCTURE.md** ← 모든 파일 설명

---

## 🐛 문제가 생기면?

### "firebase command not found"
```bash
npm install -g firebase-tools
```

### "Permission denied"
```bash
npx firebase login --reauth
```

### RSS 수집이 안 돼요
```bash
# 로컬에서 테스트
node scripts/fetchFeeds.js

# 에러 메시지 확인
```

### 더 많은 문제 해결
→ **README.md** "문제 해결" 섹션 참고

---

## 💡 팁

1. **먼저 로컬에서 테스트하세요**
   - `npx firebase serve`로 localhost에서 확인
   - 문제 없으면 배포

2. **샘플 데이터가 이미 있어요**
   - `public/news.json`에 15개 데모 기사
   - 바로 테스트 가능!

3. **아이콘은 나중에 추가해도 돼요**
   - PWA 기능은 아이콘 없이도 작동
   - 설치 프롬프트만 안 나올 뿐

4. **GitHub Actions는 선택 사항**
   - 자동화 없이도 수동 배포 가능
   - `npm run fetch && npm run deploy`

---

## 🎉 축하합니다!

이제 모든 준비가 끝났습니다.

**다음 단계**: QUICKSTART.md를 열고 5분 안에 배포해보세요! 🚀

---

**도움이 필요하면**: README.md에 모든 것이 있습니다.  
**프로젝트 구조 궁금하면**: PROJECT_STRUCTURE.md를 읽어보세요.

**행운을 빕니다!** 🍀

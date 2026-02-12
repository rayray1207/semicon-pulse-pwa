# 🚀 빠른 시작 가이드 (5분 안에 배포하기)

이미 Firebase 계정과 Node.js가 설치되어 있다면 5분 안에 배포할 수 있습니다.

## 1. 프로젝트 설정 (1분)

```bash
# 프로젝트 폴더로 이동
cd semicon-pulse-pwa

# 의존성 설치
npm install
```

## 2. Firebase 프로젝트 연결 (2분)

```bash
# Firebase 로그인
npx firebase login

# Firebase 초기화
npx firebase init hosting

# 질문에 답변:
# - Use an existing project → 본인의 Firebase 프로젝트 선택
# - Public directory: public
# - Single-page app: Yes
# - Overwrite index.html: No (중요!)
```

## 3. 샘플 데이터 확인 (선택)

```bash
# public/news.json이 이미 있으므로 바로 배포 가능
# 실제 RSS 데이터로 교체하려면:
node scripts/fetchFeeds.js
```

## 4. 배포! (1분)

```bash
# Firebase에 배포
npx firebase deploy --only hosting

# 성공하면 URL이 표시됩니다:
# ✔ Deploy complete!
# Hosting URL: https://your-project.web.app
```

## 5. 브라우저에서 확인

배포된 URL로 접속하면 완성!

---

## 다음 단계

### GitHub Actions 자동화 설정 (10분)

1. GitHub에 저장소 생성
2. 코드 푸시:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/semicon-pulse-pwa.git
   git push -u origin main
   ```

3. GitHub Secrets 설정:
   - `FIREBASE_SERVICE_ACCOUNT`: Firebase 서비스 계정 JSON
   - `FIREBASE_PROJECT_ID`: Firebase 프로젝트 ID

4. GitHub Actions가 자동으로 6시간마다 뉴스 업데이트!

### PWA 아이콘 생성

임시 아이콘 대신 실제 아이콘 생성:

```bash
# 1. https://realfavicongenerator.net 방문
# 2. 512x512 이미지 업로드
# 3. 다운로드한 아이콘을 public/icons/에 복사
```

---

## 문제 해결

**"firebase command not found"**
```bash
npm install -g firebase-tools
```

**"Permission denied"**
```bash
npx firebase login --reauth
```

**배포 후 404 오류**
- firebase.json의 "public" 경로 확인
- index.html이 public/ 폴더에 있는지 확인

---

더 자세한 내용은 [README.md](README.md)를 참고하세요!

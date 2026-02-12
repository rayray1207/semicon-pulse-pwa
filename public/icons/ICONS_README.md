# PWA Icons

이 폴더에는 PWA 아이콘 파일들이 들어갑니다.

## 필요한 파일

- `icon-192.png` - 192x192 픽셀
- `icon-512.png` - 512x512 픽셀

## 생성 방법

### 옵션 1: 온라인 생성기 (권장)

1. https://realfavicongenerator.net 방문
2. 512x512 PNG 이미지 업로드 (반도체 칩 이미지, 로고 등)
3. 생성된 아이콘들 다운로드
4. `icon-192.png`와 `icon-512.png`를 이 폴더에 복사

### 옵션 2: 직접 생성

Photoshop, Figma, Canva 등에서:
- 512x512px 정사각형 캔버스 생성
- 배경색: 진한 파란색 (#3b82f6)
- 텍스트: "SP" 또는 반도체 칩 아이콘
- PNG로 저장

그 후 이미지 편집 도구로 192x192 버전도 생성

### 옵션 3: 임시 개발용 아이콘 (ImageMagick 필요)

```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# 아이콘 생성
convert -size 192x192 xc:#3b82f6 -fill white -pointsize 100 -gravity center -annotate +0+0 "SP" icon-192.png
convert -size 512x512 xc:#3b82f6 -fill white -pointsize 260 -gravity center -annotate +0+0 "SP" icon-512.png
```

## 아이콘 확인

아이콘 생성 후 manifest.json이 올바르게 참조하는지 확인:
- `/icons/icon-192.png`
- `/icons/icon-512.png`

브라우저 개발자 도구 → Application → Manifest에서 아이콘이 로드되는지 확인하세요.

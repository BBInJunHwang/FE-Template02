# ✅ GitHub Pages 설정 체크리스트

## 🎯 설정 전 확인사항

- [ ] GitHub 계정이 있음
- [ ] 저장소가 생성됨
- [ ] 코드가 GitHub에 push됨
- [ ] 저장소가 **Public**임 (Private는 Pro 플랜 필요)

---

## 📝 단계별 설정 (5분 소요)

### 1단계: GitHub 저장소로 이동
```
https://github.com/yourusername/yourrepo
```
- [ ] 저장소 페이지가 열림

### 2단계: Settings 탭 클릭
```
상단 메뉴: Code | Issues | Pull requests | Actions | Projects | Wiki | Security | Insights | [Settings]
                                                                                               ↑ 여기!
```
- [ ] Settings 페이지가 열림

### 3단계: Pages 메뉴 클릭
```
왼쪽 사이드바 (스크롤 내려서):
├─ General
├─ Access
├─ Moderation options
├─ Code and automation
│  ├─ Branches
│  ├─ Tags
│  ├─ Actions
│  └─ Webhooks
└─ Code and automation
   └─ Pages  ← 여기 클릭!
```
- [ ] GitHub Pages 설정 페이지가 열림

### 4단계: Source 설정
```
Build and deployment
├─ Source: [Deploy from a branch ▼]  ← 이것 선택
```
- [ ] "Deploy from a branch" 선택됨

### 5단계: Branch 설정
```
Branch
├─ [main ▼]       ← main (또는 master) 선택
├─ [/ (root) ▼]   ← / (root) 선택
└─ [Save]         ← Save 버튼 클릭!
```
- [ ] main 선택
- [ ] / (root) 선택
- [ ] Save 버튼 클릭

### 6단계: 배포 대기
```
⏳ 몇 분 기다리면...
```
- [ ] 페이지 새로고침 (F5)
- [ ] 상단에 초록색 박스 확인

### 7단계: 완료!
```
✅ Your site is published at
   https://yourusername.github.io/yourrepo/

   [Visit site] 버튼 클릭해서 확인!
```
- [ ] 사이트 링크가 보임
- [ ] [Visit site] 버튼 클릭
- [ ] 웹페이지가 정상적으로 뜸!

---

## 🔗 접속 URL 구조

### 메인 갤러리
```
https://yourusername.github.io/yourrepo/
```

### 개별 템플릿
```
https://yourusername.github.io/yourrepo/templates/landing-saas/
https://yourusername.github.io/yourrepo/templates/event/
https://yourusername.github.io/yourrepo/templates/portfolio/
...
```

---

## 🚨 문제 해결

### ❌ Pages 메뉴가 안 보여요
- **원인**: 저장소가 Private일 수 있음
- **해결**: 저장소를 Public으로 변경
  1. Settings → General
  2. 맨 아래 "Danger Zone"
  3. "Change repository visibility" → "Change to public"

### ❌ 404 에러가 나요
- **원인**: 배포가 아직 완료되지 않음
- **해결**:
  1. 5-10분 더 기다리기
  2. Settings → Pages에서 배포 상태 확인
  3. Actions 탭에서 "pages build and deployment" 확인

### ❌ CSS/이미지가 안 보여요
- **원인**: 파일이 Git에 포함되지 않음
- **해결**:
  ```bash
  git status  # 빠진 파일 확인
  git add .
  git commit -m "Add missing files"
  git push
  ```

### ❌ 페이지가 비어있어요
- **원인**: 잘못된 경로 또는 index.html 없음
- **해결**:
  1. 저장소 루트에 index.html 있는지 확인
  2. templates 폴더 안에 index.html 있는지 확인
  3. URL 끝에 `/` 추가해보기

---

## 📞 추가 도움말

### GitHub Pages 공식 문서
https://docs.github.com/en/pages

### 설정 스크린샷 보기
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

### 여전히 문제가 있다면?
1. Settings → Pages 스크린샷 찍기
2. 에러 메시지 복사하기
3. GitHub Issues에 등록하기

---

## ✨ 설정 완료 후 해야 할 일

### 1. README 업데이트
```bash
# README.md에서 링크 업데이트
# yourusername → 본인 사용자명
# yourrepo → 본인 저장소명

git add README.md
git commit -m "Update live demo links"
git push
```

### 2. 링크 테스트
- [ ] 메인 갤러리 접속 테스트
- [ ] 각 템플릿 페이지 접속 테스트
- [ ] 모바일에서 접속 테스트

### 3. 공유하기!
이제 다른 사람들과 링크 공유 가능합니다:
```
내 포트폴리오 템플릿 보세요!
https://yourusername.github.io/yourrepo/
```

---

## 🎉 완료!

모든 체크리스트를 완료했다면 성공입니다!

이제 README의 링크를 클릭하면 실제 웹페이지가 보입니다! 🚀

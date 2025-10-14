# 🚀 배포 가이드

## GitHub Pages로 배포하기 (무료!)

### 1️⃣ GitHub에 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단 `+` 버튼 → `New repository` 클릭
3. Repository 이름 입력 (예: `modern-web-templates`)
4. `Public` 선택
5. `Create repository` 클릭

### 2️⃣ 로컬 코드를 GitHub에 올리기

터미널에서 프로젝트 폴더로 이동 후 실행:

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 스테이징
git add .

# 커밋
git commit -m "Add modern web templates with 10 templates"

# 원격 저장소 연결 (본인의 URL로 변경!)
git remote add origin https://github.com/yourusername/yourrepo.git

# Push
git branch -M main
git push -u origin main
```

### 3️⃣ GitHub Pages 활성화

1. **GitHub 저장소 페이지**로 이동
2. 상단 메뉴에서 **`Settings`** 탭 클릭
3. 왼쪽 사이드바에서 **`Pages`** 클릭
4. **Source** 섹션에서:
   - Branch: `main` 선택
   - Folder: `/ (root)` 선택
5. **`Save`** 버튼 클릭

### 4️⃣ 배포 완료! 🎉

몇 분 후 다음 URL에서 접속 가능:

```
https://yourusername.github.io/yourrepo/
```

**예시:**
- 사용자명: `john`
- 저장소명: `my-templates`
- 접속 URL: `https://john.github.io/my-templates/`

### 📱 각 템플릿 접속 URL

배포 후 다음 URL로 각 템플릿 접속 가능:

```
# 템플릿 갤러리
https://yourusername.github.io/yourrepo/

# SaaS 랜딩
https://yourusername.github.io/yourrepo/templates/landing-saas/

# Agency 랜딩
https://yourusername.github.io/yourrepo/templates/landing-agency/

# App 랜딩
https://yourusername.github.io/yourrepo/templates/landing-app/

# AI 랜딩
https://yourusername.github.io/yourrepo/templates/landing-ai/

# Startup 랜딩
https://yourusername.github.io/yourrepo/templates/landing-startup/

# 포트폴리오
https://yourusername.github.io/yourrepo/templates/portfolio/

# 이벤트
https://yourusername.github.io/yourrepo/templates/event/

# 회사 소개
https://yourusername.github.io/yourrepo/templates/about-us/

# 제품 소개
https://yourusername.github.io/yourrepo/templates/product/

# 기본 랜딩
https://yourusername.github.io/yourrepo/templates/landing/
```

---

## README.md 업데이트하기

배포 후 README.md의 라이브 데모 링크를 실제 URL로 업데이트:

1. `README.md` 파일 열기
2. `yourusername`을 본인 GitHub 사용자명으로 변경
3. `yourrepo`를 저장소 이름으로 변경
4. 저장 후 Git에 다시 Push:

```bash
git add README.md
git commit -m "Update live demo links"
git push
```

---

## 🔧 문제 해결

### Pages가 활성화되지 않는 경우

1. **Settings → Pages**에서 Source가 올바르게 설정되었는지 확인
2. 저장소가 **Public**인지 확인 (Private는 Pro 플랜 필요)
3. 몇 분 기다린 후 다시 시도

### 404 에러가 나는 경우

- URL 끝에 `/`를 추가해보세요
  - ❌ `https://john.github.io/my-templates/templates/event`
  - ✅ `https://john.github.io/my-templates/templates/event/`

### CSS/이미지가 로드되지 않는 경우

모든 파일이 올바르게 Git에 포함되었는지 확인:
```bash
git status
git add .
git commit -m "Add missing files"
git push
```

---

## 📞 추가 도움이 필요하신가요?

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Git 기본 사용법](https://git-scm.com/book/ko/v2)
- 이슈가 있다면 [Issues](https://github.com/yourusername/yourrepo/issues)에 등록해주세요!

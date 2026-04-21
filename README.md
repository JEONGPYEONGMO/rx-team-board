# RX Team Board

RX Inc. 7인 팀의 출장·휴가 실시간 현황 보드. Firebase Realtime Database + React + PWA.

---

## 📦 배포 순서 (GitHub Pages)

### 1. GitHub 저장소 만들기

1. github.com → 우측 상단 `+` → **New repository**
2. Repository name: `rx-team-board`
3. Visibility: **Public** ⚠️ (Private이면 무료 계정에서 Pages 동작 안 함)
4. **Create repository** 클릭

### 2. 파일 업로드

이 폴더 안의 **6개 파일 전부**를 repo 루트에 업로드:

```
index.html
manifest.json
sw.js
icon-192.png
icon-512.png
database.rules.json   (선택 — 나중에 Firebase에 붙여넣을 참고용)
```

방법 ① 브라우저 업로드: repo 페이지 → **Add file → Upload files** → 파일 드래그 → **Commit changes**
방법 ② git push:
```bash
git clone https://github.com/jeongpyeongmo/rx-team-board.git
cd rx-team-board
# (파일 복사)
git add .
git commit -m "initial deploy"
git push
```

### 3. GitHub Pages 활성화

1. Repo → **Settings** → 왼쪽 **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `/ (root)` → **Save**
4. 1–2분 대기 후 상단에 초록색 ✅ 와 URL 표시:
   ```
   https://jeongpyeongmo.github.io/rx-team-board/
   ```

### 4. 스마트폰에 설치 (PWA)

- **iPhone (Safari)**: 배포 URL 접속 → 공유 버튼 → **홈 화면에 추가**
- **Android (Chrome)**: 배포 URL 접속 → 주소창 설치 배너 OR 우측 상단 ⋮ → **앱 설치**
- 홈 화면 아이콘 탭 → 전체화면 앱처럼 실행됨

팀원 7명에게 URL만 공유하면 각자 같은 방식으로 설치 가능. 모든 등록은 실시간 동기화됩니다.

---

## 🔒 보안 설정 (중요 · 30일 이내)

현재는 **테스트 모드**라 URL만 알면 누구나 읽기·쓰기 가능합니다. Firebase가 30일 후 자동으로 모든 접근을 차단하므로, 그 전에 다음 순서로 전환하세요.

### STEP A — 익명 로그인 활성화

1. [Firebase Console](https://console.firebase.google.com/project/rx-team-board) → 좌측 **빌드 → Authentication**
2. **시작하기** 클릭
3. **로그인 방법** 탭 → **익명** 선택 → **사용 설정** 토글 ON → **저장**

### STEP B — 보안 규칙 적용

1. 좌측 **빌드 → Realtime Database** → **규칙** 탭
2. 기존 내용을 전부 지우고, 이 repo의 `database.rules.json` 내용을 복사해서 붙여넣기
3. **게시** 클릭

이후로는 앱을 브라우저로 열 때마다 자동으로 익명 로그인 → DB 접근 허용. 외부에서 URL만 알아도 Firebase 쓰기가 막혀 보호됩니다.

> ⚠️ STEP A를 먼저 하지 않고 STEP B만 적용하면 앱이 동작하지 않습니다 (auth 토큰 없음). 반드시 A → B 순서.

---

## 🛠 구성 요소

| 파일 | 역할 |
|---|---|
| `index.html` | 앱 전체 (React + Firebase SDK 인라인, 빌드 불필요) |
| `manifest.json` | PWA 메타데이터 (홈 화면 설치용) |
| `sw.js` | 서비스 워커 — 앱 셸 오프라인 캐시 |
| `icon-192.png` / `icon-512.png` | PWA 아이콘 |
| `database.rules.json` | Firebase 보안 규칙 (30일 내 수동 적용) |

---

## 🔄 앱 업데이트 방법

코드를 수정하고 싶을 때:

1. `index.html` 등을 수정
2. GitHub에 push (또는 웹 UI에서 파일 업데이트)
3. Pages가 자동 재배포 (1–2분)
4. 사용자 폰: 앱을 **한 번 완전히 닫았다 재실행**하면 Service Worker가 새 버전 가져옴
   - 안 바뀌면 `sw.js` 안의 `CACHE = 'rx-team-v1'`을 `v2`로 바꾼 뒤 다시 배포

---

## 📊 Firebase 데이터 구조

```
rx-team-board-default-rtdb/
├── members/
│   ├── m1: { id, name, order }
│   ├── m2: { id, name, order }
│   └── ...
└── schedules/
    ├── s_xxx: { id, memberId, type, startDate, endDate, destination, purpose, createdAt }
    └── s_yyy: { ... }
```

- `members`는 앱 최초 실행 시 자동으로 7명 기본값(이강헌·이성기·황정하·배문기·정평모·조재훈·오서진) 시드됩니다.
- `schedules.type`은 `"trip"` 또는 `"vacation"`.
- 일정 삭제 시 즉시 모든 기기에서 사라집니다.

---

## 💾 데이터 백업

Firebase Console → Realtime Database → 우상단 **⋮ → JSON 내보내기**로 언제든 전체 백업 가능.

---

## 🆘 문제 해결

**"불러오는 중..."에서 멈춤**
→ 콘솔(F12) 확인. Firebase `databaseURL`이 `index.html`과 실제 DB 위치가 일치하는지, 보안 규칙이 거부하고 있지 않은지 점검.

**팀원이 등록했는데 내 화면에 안 보임**
→ 네트워크 연결 확인. 헤더에 `OFFLINE` 뱃지가 뜨면 오프라인. 복귀하면 자동 동기화.

**홈 화면 설치 버튼이 안 보임 (iPhone)**
→ Safari로 열어야 함(Chrome for iOS는 PWA 설치 지원 불완전). 반드시 `Safari → 공유 → 홈 화면에 추가`.
"# rx-team-board" 

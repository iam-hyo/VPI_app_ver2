# 🎬 유튜브 VPI 분석기 (Demo Ver.)

유튜브 영상의 잠재적 가치(VPI: Video Potential Index)를 분석하는 서비스의 데모 버전입니다. 사용자는 키워드 검색을 통해 최신 영상을 분석하고, 다양한 기준으로 정렬하여 인사이트를 얻을 수 있습니다.

이 프로젝트는 React와 Firebase를 기반으로 하며, 실제 유튜브 API 호출을 시뮬레이션하는 모의(Mock) API를 사용하여 핵심 데이터 흐름과 VPI 계산 로직을 구현합니다.

## ✨ 주요 기능

- **키워드 검색**: 분석하고 싶은 키워드로 유튜브 영상을 검색합니다.
- **VPI 분석**: 각 영상의 실제 조회수와 기대 조회수를 비교하여 잠재적 가치를 나타내는 VPI 지수를 계산합니다.
- **결과 정렬**: VPI, 구독자 수, 조회수, 최신순 등 다양한 기준으로 검색 결과를 정렬할 수 있습니다.
- **검색 기록**: 검색 결과를 Firestore에 저장하여, API 크레딧 소모 없이 이전 검색 결과를 다시 확인할 수 있습니다.
- **반응형 UI**: 데스크톱과 모바일 환경 모두에서 사용 가능한 UI를 제공합니다.

## 📁 프로젝트 구조

프로젝트는 기능과 역할에 따라 다음과 같이 구조화되어 있습니다.


src/
├── api/
│   └── mockApi.js         # 모의 API (유튜브, VPI 예측)
├── components/
│   ├── common/            # 공용 컴포넌트 (Icon, Pagination 등)
│   ├── layout/            # 레이아웃 컴포넌트 (Sidebar)
│   └── results/           # 검색 결과 관련 컴포넌트 (VideoCard)
├── hooks/
│   ├── useFirebase.js     # Firebase 초기화 및 인증 훅
│   └── useSearchHistory.js# 검색 기록 관리(Firestore) 훅
├── pages/
│   ├── ResultsPage.js     # 검색 결과 페이지
│   └── SearchPage.js      # 초기 검색 페이지
├── utils/
│   └── formatters.js      # 데이터 포맷팅 유틸리티 함수
└── App.js                 # 메인 라우팅 및 전역 상태 관리


## 🚀 설치 및 실행 방법

1.  **프로젝트 파일 준비**
    이 프로젝트의 파일들을 로컬 컴퓨터에 다운로드합니다.

2.  **의존성 파일 생성**
    프로젝트의 최상위 폴더에 `package.json` 파일을 생성하고 아래 내용을 붙여넣으세요.

    ```json
    {
      "name": "youtube-vpi-analyzer",
      "private": true,
      "version": "0.1.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "firebase": "^10.12.2",
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
      },
      "devDependencies": {
        "@types/react": "^18.3.3",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.3.1",
        "autoprefixer": "^10.4.19",
        "eslint": "^8.57.0",
        "eslint-plugin-react": "^7.34.2",
        "eslint-plugin-react-hooks": "^4.6.2",
        "eslint-plugin-react-refresh": "^0.4.7",
        "postcss": "^8.4.38",
        "tailwindcss": "^3.4.4",
        "vite": "^5.3.1"
      }
    }
    ```

3.  **의존성 설치**
    터미널에서 프로젝트 폴더로 이동한 후, 아래 명령어를 실행하여 필요한 라이브러리를 모두 설치합니다.

    ```bash
    npm install
    ```

4.  **Firebase 설정**
    이 데모는 검색 기록 저장을 위해 **Firebase Firestore**를 사용합니다.
    -   [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트를 생성하세요.
    -   웹 앱을 추가하고 제공되는 `firebaseConfig` 객체를 복사하세요.
    -   실제 환경에서는 이 `firebaseConfig` 정보를 환경 변수(`.env` 파일) 등을 통해 안전하게 관리해야 합니다. (현재 코드는 Canvas 환경 변수 `__firebase_config`를 사용하도록 설정되어 있습니다.)

5.  **개발 서버 실행**
    아래 명령어를 실행하여 개발 서버를 시작합니다.

    ```bash
    npm run dev
    ```

    서버가 실행되면 터미널에 표시된 주소(보통 `http://localhost:5173`)로 접속하여 애플리케이션을 확인할 수 있습니다.

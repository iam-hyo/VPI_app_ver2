// =================================================================
// --- src/services/firebase.js ---
// 역할: .env 파일에서 Firebase 설정을 읽어와 초기화하는 로직
// =================================================================
import { initializeApp } from "firebase/app";

// Vite에서 .env 변수를 가져오는 방식: import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Canvas 환경의 전역 변수가 있으면 그것을 우선 사용, 없으면 .env 값 사용
const finalFirebaseConfig = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config) 
    : firebaseConfig;

export const app = initializeApp(finalFirebaseConfig);

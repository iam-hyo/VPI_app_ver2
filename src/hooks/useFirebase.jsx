// =================================================================
// --- src/hooks/useFirebase.js ---
// 역할: Firebase 초기화 및 인증 관련 로직을 담당하는 커스텀 훅
// =================================================================
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const useFirebase = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [appId, setAppId] = useState('default-app-id');
    const [firebaseError, setFirebaseError] = useState(null);

    useEffect(() => {
        try {
            const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
            const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            setAppId(currentAppId);

            if (Object.keys(firebaseConfig).length > 0) {
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firestoreAuth = getAuth(app);
                setDb(firestoreDb);
                setAuth(firestoreAuth);

                onAuthStateChanged(firestoreAuth, async (user) => {
                    if (user) {
                        setUserId(user.uid);
                    } else {
                        try {
                            const initialToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                            if (initialToken) await signInWithCustomToken(firestoreAuth, initialToken);
                            else await signInAnonymously(firestoreAuth);
                        } catch (authError) {
                            console.error("Firebase sign-in error:", authError);
                            setFirebaseError("인증에 실패했습니다. 새로고침 해주세요.");
                        }
                    }
                });
            } else {
                console.warn("Firebase config not found. History will be disabled.");
            }
        } catch (e) {
            console.error("Firebase initialization failed:", e);
            setFirebaseError("Firebase 설정에 실패했습니다.");
        }
    }, []);

    return { db, auth, userId, appId, firebaseError };
};
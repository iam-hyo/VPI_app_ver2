// --- src/hooks/useSearchHistory.js ---
// 역할: 검색 기록(Firestore) 관련 로직을 담당하는 커스텀 훅
// =================================================================
import { useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, onSnapshot, deleteDoc, query, getDocs } from 'firebase/firestore';

export const useSearchHistory = (db, userId, appId) => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [historyError, setHistoryError] = useState(null);

    useEffect(() => {
        if (!db || !userId) return;
        const historyCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'search_history');
        const unsubscribe = onSnapshot(historyCollectionRef, (snapshot) => {
            const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.search_time - a.search_time);
            setSearchHistory(historyData);
        }, (err) => {
            console.error("Error fetching history:", err);
            setHistoryError("검색 기록을 불러오는 데 실패했습니다.");
        });
        return () => unsubscribe();
    }, [db, userId, appId]);

    const saveSearchHistory = useCallback(async (query, results) => {
        if (!db || !userId) return;
        const docId = `${query}_${Date.now()}`;
        const historyRef = doc(db, 'artifacts', appId, 'users', userId, 'search_history', docId);
        try {
            await setDoc(historyRef, { query, search_time: Date.now(), results: JSON.stringify(results) });
        } catch (err) {
            console.error("Error saving history:", err);
            setHistoryError("검색 기록 저장에 실패했습니다.");
        }
    }, [db, userId, appId]);

    const deleteHistoryItem = useCallback(async (id) => {
        if (!db || !userId) return;
        const docRef = doc(db, 'artifacts', appId, 'users', userId, 'search_history', id);
        try {
            await deleteDoc(docRef);
        } catch (err) {
            console.error("Error deleting history item:", err);
            setHistoryError("기록 삭제에 실패했습니다.");
        }
    }, [db, userId, appId]);

    const deleteAllHistory = useCallback(async () => {
        if (!db || !userId || !window.confirm("정말로 모든 검색 기록을 삭제하시겠습니까?")) return;
        const historyCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'search_history');
        try {
            const querySnapshot = await getDocs(historyCollectionRef);
            await Promise.all(querySnapshot.docs.map(d => deleteDoc(d.ref)));
        } catch (err) {
            console.error("Error deleting all history:", err);
            setHistoryError("전체 기록 삭제에 실패했습니다.");
        }
    }, [db, userId, appId]);

    return { searchHistory, historyError, saveSearchHistory, deleteHistoryItem, deleteAllHistory };
};

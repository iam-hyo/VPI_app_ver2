// --- src/App.js ---
// 역할: 애플리케이션의 최상위 컴포넌트, 전역 상태 및 화면 전환 관리
// =================================================================
import React, { useState, useEffect, useCallback } from 'react';
import { useFirebase } from './hooks/useFirebase';
import { useSearchHistory } from './hooks/useSearchHistory';
// import { mockApi } from './api/mockApi';
import { youtubeApi } from './api/youtubeApiManager'
import Sidebar from './components/layout/Sidebar.jsx';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
    const [view, setView] = useState('search');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [apiCredits, setApiCredits] = useState(0);
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);

    const { db, userId, appId, firebaseError } = useFirebase();
    const { searchHistory, historyError, saveSearchHistory, deleteHistoryItem, deleteAllHistory } = useSearchHistory(db, userId, appId);

    useEffect(() => {
        if (firebaseError) setError(firebaseError);
        if (historyError) setError(historyError);
    }, [firebaseError, historyError]);

    const handleSearch = useCallback(async (query) => {
        setIsLoading(true);
        setError(null);
        setSidebarExpanded(false);
        try {
            // 1. search.list 호출
            const searchData = await youtubeApi.searchList(query);
            const videoIds = searchData.items.map(item => item.id.videoId);
            if (videoIds.length === 0) {
                setSearchResults([]);
                setSearchQuery(query);
                setView('results');
                setIsLoading(false);
                return;
            }

            // 2. videos.list 호출
            const videosData = await youtubeApi.videosList(videoIds);
            const channelIdSet = new Set(videosData.items.map(item => item.snippet.channelId));
            
            // 3. channels.list 호출
            const channelsData = await youtubeApi.channelsList(Array.from(channelIdSet));
            
            // 4. 데이터 취합
            const enrichedData = videosData.items.map(video => {
                const channelItem = channelsData.items.find(item => item.id === video.snippet.channelId);
                // search.list 결과의 snippet(title, description 등)과 videos.list의 snippet(tags 등)을 합칩니다.
                const searchItemSnippet = searchData.items.find(item => item.id.videoId === video.id)?.snippet || {};
                return { 
                    ...video, 
                    snippet: { ...video.snippet, ...searchItemSnippet },
                    channel: channelItem || { statistics: { subscriberCount: '0' } } 
                };
            });

            setApiCredits(0); // 실제 크레딧 계산은 서버에서 해야 하므로 UI에서는 제거하거나 0으로 표시
            setSearchResults(enrichedData);
            setSearchQuery(query);
            setView('results');
            await saveSearchHistory(query, enrichedData);

        } catch (err) {
            console.error("Search failed:", err);
            setError(err.message || "데이터를 불러오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [saveSearchHistory]);

    const handleLoadHistory = useCallback((id) => {
        const historyItem = searchHistory.find(item => item.id === id);
        if (historyItem) {
            setIsLoading(true);
            setError(null);
            try {
                setSearchQuery(historyItem.query);
                setSearchResults(JSON.parse(historyItem.results));
                setApiCredits(0);
                setView('results');
            } catch (e) {
                setError("기록 데이터를 불러오는 데 실패했습니다.");
                console.error("Failed to parse history data:", e);
            } finally {
                setIsLoading(false);
            }
        }
    }, [searchHistory]);

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Sidebar history={searchHistory} onLoadHistory={handleLoadHistory} onDeleteHistory={deleteHistoryItem} onDeleteAllHistory={deleteAllHistory} isExpanded={isSidebarExpanded} setExpanded={setSidebarExpanded} />
            <main className={`transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'sm:ml-72' : 'ml-0'}`}>
                {error && <div className="bg-red-500 text-white p-4 text-center fixed top-0 left-0 right-0 z-50">{error}</div>}
                <div className="min-h-screen flex flex-col">
                    {view === 'search' ? (
                        <SearchPage onSearch={handleSearch} isLoading={isLoading} />
                    ) : (
                        <ResultsPage query={searchQuery} results={searchResults} onSearch={handleSearch} apiCredits={apiCredits} isLoading={isLoading} />
                    )}
                </div>
            </main>
        </div>
    );
}
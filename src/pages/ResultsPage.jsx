// --- src/pages/ResultsPage.js ---
// 역할: 검색 결과 화면 UI, 정렬 및 페이지네이션 로직 포함
// =================================================================
import React, { useState, useEffect, useCallback } from 'react';
import { SearchIcon, LoaderIcon } from '../components/common/Icon';
import Pagination from '../components/common/Pagination';
import VideoCard from '../components/results/VideoCard';

const ResultsPage = ({ query, results, onSearch, apiCredits, isLoading }) => {
    const [currentQuery, setCurrentQuery] = useState(query);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedResults, setSortedResults] = useState(results);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentQuery(query);
        setSortedResults(results);
        setCurrentPage(1);
    }, [query, results]);

    const handleSort = useCallback((sortKey) => {
        const sorted = [...results].sort((a, b) => {
            const [key, order] = sortKey.split('_');
            let valA, valB;
            switch (key) {
                case 'vpi': return 0;
                case 'subscribers': valA = parseInt(a.channel.statistics.subscriberCount, 10); valB = parseInt(b.channel.statistics.subscriberCount, 10); break;
                case 'views': valA = parseInt(a.statistics.viewCount, 10); valB = parseInt(b.statistics.viewCount, 10); break;
                case 'date': valA = new Date(a.snippet.publishedAt); valB = new Date(b.snippet.publishedAt); break;
                default: return 0;
            }
            return order === 'desc' ? valB - valA : valA - valB;
        });
        setSortedResults(sorted);
        setCurrentPage(1);
    }, [results]);

    const handleSubmit = (e) => { e.preventDefault(); if (currentQuery.trim() && !isLoading) onSearch(currentQuery.trim()); };
    const paginatedResults = sortedResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-4 sm:p-8 w-full">
            <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8"><div className="relative"><input type="search" value={currentQuery} onChange={(e) => setCurrentQuery(e.target.value)} className="w-full p-3 pr-14 text-base bg-gray-800 border-2 border-gray-700 rounded-full text-white focus:outline-none focus:border-blue-500" disabled={isLoading} /><button type="submit" className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-500" disabled={isLoading}>{isLoading ? <LoaderIcon /> : <SearchIcon />}</button></div></form>
            
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 max-w-7xl mx-auto">
                <div className="mb-4 sm:mb-0"><h2 className="text-xl sm:text-2xl text-white">"<span className="font-bold text-blue-400">{query}</span>"에 대한 총 {results.length}개의 분석 결과</h2><p className="text-sm text-gray-400">(API 크레딧: {apiCredits} 소요)</p></div>
                <select onChange={(e) => handleSort(e.target.value)} className="bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="vpi_desc">VPI Index 높은 순</option><option value="subscribers_desc">구독자 많은 순</option><option value="subscribers_asc">구독자 낮은 순</option><option value="views_desc">조회수 높은 순</option><option value="date_desc">최신 순</option><option value="date_asc">오래된 순</option></select>
            </div>

            <div className="max-w-7xl mx-auto space-y-4">{paginatedResults.map(video => <VideoCard key={video.id} video={video} />)}</div>
            <Pagination totalItems={results.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
    );
};

export default ResultsPage;
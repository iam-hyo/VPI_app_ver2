// --- src/pages/SearchPage.js ---
// 역할: 초기 검색 화면 UI
// =================================================================
import React, { useState } from 'react';
import { SearchIcon, LoaderIcon } from '../components/common/Icon';

const SearchPage = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); if (query.trim() && !isLoading) onSearch(query.trim()); };
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">유튜브 VPI 분석기</h1>
            <p className="text-gray-400 mb-8">분석하고 싶은 검색어를 입력하세요.</p>
            <form onSubmit={handleSubmit} className="w-full max-w-xl"><div className="relative"><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 리액트 강좌, AI 신기술..." className="w-full p-4 pr-16 text-lg bg-gray-800 border-2 border-gray-700 rounded-full text-white focus:outline-none focus:border-blue-500" disabled={isLoading} /><button type="submit" className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-500" disabled={isLoading}>{isLoading ? <LoaderIcon /> : <SearchIcon />}</button></div></form>
        </div>
    );
};

export default SearchPage;
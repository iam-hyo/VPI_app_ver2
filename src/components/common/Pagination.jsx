// --- src/components/common/Pagination.js ---
// 역할: 페이지네이션 UI 및 로직 담당
// =================================================================
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from './Icon';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center items-center gap-2 mt-8 text-white">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent"><ChevronsLeftIcon /></button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent"><ChevronLeftIcon /></button>
            
            {pageNumbers.map(number => {
                if (Math.abs(number - currentPage) < 3 || number === 1 || number === totalPages) {
                    return <button key={number} onClick={() => onPageChange(number)} className={`px-4 py-2 rounded-md ${currentPage === number ? 'bg-blue-600 font-bold' : 'hover:bg-gray-700'}`}>{number}</button>;
                }
                if (Math.abs(number - currentPage) === 3) {
                    return <span key={number} className="px-2">...</span>;
                }
                return null;
            })}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent"><ChevronRightIcon /></button>
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:text-gray-500 disabled:hover:bg-transparent"><ChevronsRightIcon /></button>
        </nav>
    );
};

export default Pagination;
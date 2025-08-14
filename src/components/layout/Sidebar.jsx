// --- src/components/layout/Sidebar.js ---
// 역할: 검색 기록을 보여주는 사이드바 UI
// =================================================================
import React from 'react';
import { HistoryIcon, Trash2Icon, XIcon } from '../common/Icon';

const Sidebar = ({ history, onLoadHistory, onDeleteHistory, onDeleteAllHistory, isExpanded, setExpanded }) => (
    <>
        <button onClick={() => setExpanded(!isExpanded)} className="fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors" aria-label="Toggle search history"><HistoryIcon /></button>
        <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-20 shadow-2xl transform transition-transform duration-300 ease-in-out ${isExpanded ? 'translate-x-0' : '-translate-x-full'} w-full sm:w-72`}>
            <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">검색 기록</h2><button onClick={() => setExpanded(false)} className="p-1 hover:bg-gray-700 rounded-full"><XIcon /></button></div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {history.length === 0 ? <p className="text-gray-400">검색 기록이 없습니다.</p> : (
                        <ul>
                            {history.map((item) => (
                                <li key={item.id} className="group flex justify-between items-center mb-2 p-2 rounded-md hover:bg-gray-800 transition-colors">
                                    <button onClick={() => { onLoadHistory(item.id); setExpanded(false); }} className="text-left flex-grow"><span className="block font-semibold">{item.query}</span><span className="block text-xs text-gray-400">{new Date(item.search_time).toLocaleString('ko-KR')}</span></button>
                                    <button onClick={() => onDeleteHistory(item.id)} className="ml-2 p-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2Icon /></button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {history.length > 0 && <button onClick={onDeleteAllHistory} className="w-full mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"><Trash2Icon /> 전체 기록 삭제</button>}
            </div>
        </aside>
    </>
);

export default Sidebar;
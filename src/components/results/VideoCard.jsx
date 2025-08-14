import React, { useState, useEffect } from 'react';
import { mockApi } from '../../api/mockApi.js';
import { formatNumber, formatTimeAgo } from '../../utils/formatters.js';
import { HelpCircleIcon, LoaderIcon } from '../common/Icon.jsx';

const VideoCard = ({ video }) => {
    // --- 상태(State) 정의 ---
    const [vpi, setVpi] = useState(null);
    const [vpiError, setVpiError] = useState(null);
    const [isLoadingVpi, setIsLoadingVpi] = useState(true);
    
    // 툴팁에 표시할 값들을 상태로 관리합니다.
    const [actualViews, setActualViews] = useState(0);
    const [predictedViews, setPredictedViews] = useState(0);

    useEffect(() => {
        const calculateVpi = async () => {
            setIsLoadingVpi(true);
            setVpiError(null);
            
            if (!video.channel?.statistics?.subscriberCount || !video.statistics?.likeCount) {
                setVpiError("VPI 계산 정보 부족");
                setIsLoadingVpi(false);
                return;
            }

            const elapsed_time = (new Date() - new Date(video.snippet.publishedAt)) / (1000 * 60 * 60 * 24);
            const durationMatch = video.contentDetails.duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
            const minutes = durationMatch && durationMatch[1] ? parseInt(durationMatch[1], 10) : 0;
            const seconds = durationMatch && durationMatch[2] ? parseInt(durationMatch[2], 10) : 0;
            const is_short = (minutes * 60 + seconds) <= 60;

            const requestBody = {
                is_short,
                elapsed_time,
                subscriber_count: parseInt(video.channel.statistics.subscriberCount, 10),
                like_count: parseInt(video.statistics.likeCount, 10),
            };

            const response = await mockApi.predictViews(requestBody);

            if (response.error || !response.predicted_view_count) {
                setVpiError("예측 서버 연결 오류");
            } else {
                const currentActualViews = parseInt(video.statistics.viewCount, 10);
                const currentPredictedViews = response.predicted_view_count;

                // 계산된 값을 상태에 저장합니다.
                setActualViews(currentActualViews);
                setPredictedViews(currentPredictedViews);
                
                setVpi(currentPredictedViews > 0 ? (currentActualViews / currentPredictedViews).toFixed(2) : 0);
            }
            setIsLoadingVpi(false);
        };
        calculateVpi();
    }, [video]);

    const getVpiColor = (v) => v >= 1.2 ? 'bg-green-500/20 text-green-400 border-green-500/30' : v >= 0.8 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
    const vpiColor = vpi !== null ? getVpiColor(vpi) : 'bg-gray-700/20 text-gray-400 border-gray-700/30';

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 border border-transparent hover:border-blue-500/50 transition-all duration-300">
            <a href={`https://www.youtube.com/watch?v=${video.id.videoId || video.id}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-full sm:w-48"><img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="rounded-md w-full h-auto object-cover" /></a>
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-white mb-1 leading-tight">{video.snippet.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3"><a href={`https://www.youtube.com/channel/${video.snippet.channelId}`} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2"><img src={`https://placehold.co/24x24/333/fff?text=${video.snippet.channelTitle.charAt(0)}`} className="w-6 h-6 rounded-full" alt="channel profile"/><span>{video.snippet.channelTitle}</span></a></div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300 mb-4">
                    <span>조회수 {formatNumber(parseInt(video.statistics?.viewCount || 0, 10))}</span>
                    <span>좋아요 {formatNumber(parseInt(video.statistics?.likeCount || 0, 10))}</span>
                    <span>댓글 {formatNumber(parseInt(video.statistics?.commentCount || 0, 10))}</span>
                    <span>구독자 {formatNumber(parseInt(video.channel?.statistics?.subscriberCount || 0, 10))}</span>
                    <span>{formatTimeAgo(video.snippet.publishedAt)}</span>
                </div>
                
                {/* --- 요청하신 대로 수정된 부분 --- */}
                <div className="flex flex-wrap gap-3">
                    <div className={`group relative px-3 py-1 rounded-md border text-sm font-semibold ${vpiColor}`}>
                        {isLoadingVpi ? (
                            <span className="flex items-center gap-1"><LoaderIcon className="w-4 h-4" /> VPI 계산중...</span>
                        ) : vpiError ? (
                            <span data-tooltip={vpiError}>VPI 계산 오류</span>
                        ) : (
                            <span className="group relative flex items-center gap-1">
                                VPI Index: {vpi}
                                <HelpCircleIcon className="w-4 h-4" />
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    VPI 예측 시스템을 통한 정밀 예측 결과입니다. (실제 조회수 {formatNumber(actualViews)} / 기대 조회수 {formatNumber(predictedViews)})
                                </div>
                            </span>
                        )}
                        {vpiError && <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{vpiError}</div>}
                    </div>
                    <div className="group relative px-3 py-1 rounded-md border bg-purple-500/20 text-purple-400 border-purple-500/30 text-sm">카테고리 : 개발 중</div>
                    <div className="group relative px-3 py-1 rounded-md border bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-sm flex items-center gap-1">꿀지표: --점</div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;

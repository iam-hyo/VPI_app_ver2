// --- src/api/mockApi.js ---
// 역할: 실제 API를 대체하는 모의(Mock) API 함수 모음
// =================================================================
const generateMockData = (query, count = 50) => {
    const items = [];
    for (let i = 0; i < count; i++) {
        const videoId = `vid_${query}_${i}_${Date.now()}`;
        const channelId = `chan_${query}_${(i % 10)}`;
        items.push({
            id: { videoId },
            snippet: {
                publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                channelId,
                title: `${query} 관련 영상 제목 ${i + 1}`,
                description: `${query}에 대한 심도 깊은 분석과 정보를 제공하는 영상입니다.`,
                thumbnails: { medium: { url: `https://placehold.co/320x180/1a1a1a/ffffff?text=Video+${i+1}` } },
                channelTitle: `채널 ${query} ${i % 10}`,
            }
        });
    }
    return { items };
};
const generateMockVideoDetails = (videoIds) => ({
    items: videoIds.map(id => ({
        id,
        snippet: { categoryId: `${Math.floor(Math.random() * 10) + 1}`, tags: ['mock', 'data', 'react'] },
        statistics: {
            viewCount: `${Math.floor(Math.random() * 1000000)}`,
            likeCount: `${Math.floor(Math.random() * 50000)}`,
            commentCount: `${Math.floor(Math.random() * 5000)}`
        },
        contentDetails: { duration: Math.random() > 0.8 ? 'PT59S' : `PT${Math.floor(Math.random() * 50)}M${Math.floor(Math.random()*60)}S` }
    }))
});
const generateMockChannelDetails = (channelIds) => ({
    items: [...new Set(channelIds)].map(id => ({
        id,
        statistics: { subscriberCount: `${Math.floor(Math.random() * 5000000)}` }
    }))
});
export const mockApi = {
    searchList: (query) => new Promise(resolve => setTimeout(() => resolve(generateMockData(query)), 500)),
    videosList: (videoIds) => new Promise(resolve => setTimeout(() => resolve(generateMockVideoDetails(videoIds)), 500)),
    channelsList: (channelIds) => new Promise(resolve => setTimeout(() => resolve(generateMockChannelDetails(channelIds)), 500)),
    predictViews: (videoStats) => new Promise(resolve => {
        setTimeout(() => {
            if (Math.random() < 0.1) {
                resolve({ error: "Prediction server failed" });
                return;
            }
            const predicted_view_count = (videoStats.subscriber_count * 0.1 + videoStats.like_count * 10) * (Math.random() * 0.5 + 0.75);
            resolve({ predicted_view_count: Math.floor(predicted_view_count) });
        }, 300);
    })
};
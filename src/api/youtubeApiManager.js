// =================================================================
// --- src/api/youtubeApiManager.js ---
// 역할: 여러 API 키를 관리하고 할당량 초과 시 자동 전환하는 로직
// =================================================================
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// .env 파일에서 콤마로 구분된 API 키들을 배열로 가져옵니다.
const apiKeys = (import.meta.env.VITE_YOUTUBE_API_KEYS || '').split(',').filter(key => key.trim() !== '');
let currentKeyIndex = 0;

/**
 * YouTube API를 호출하고 할당량 초과 시 자동으로 다른 키로 재시도합니다.
 * @param {string} endpoint - API 엔드포인트 (예: 'search', 'videos')
 * @param {URLSearchParams} params - 요청에 포함될 URL 파라미터
 * @returns {Promise<any>} API 응답 JSON
 */
async function callYoutubeApi(endpoint, params) {
  if (apiKeys.length === 0) {
    throw new Error("YouTube API 키가 .env 파일에 설정되지 않았습니다.");
  }

  const key = apiKeys[currentKeyIndex];
  if (!key) {
    throw new Error("모든 YouTube API 키의 할당량을 소진했거나 유효하지 않습니다.");
  }

  // 기존 파라미터에 API 키 추가
  params.set('key', key);

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}?${params.toString()}`);
    
    // 할당량 초과 에러(403) 감지
    if (response.status === 403) {
      const errorData = await response.json();
      const isQuotaError = errorData.error.errors.some(e => e.reason === 'quotaExceeded');
      
      if (isQuotaError) {
        console.warn(`[API 키 경고] API 키 (${key.substring(0, 8)}...)의 할당량이 초과되었습니다. 다음 키로 전환합니다.`);
        currentKeyIndex++;
        return callYoutubeApi(endpoint, params); // 다음 키로 재귀 호출
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API 에러: ${errorData.error.message}`);
    }

    return await response.json();

  } catch (error) {
    // 네트워크 에러 등
    console.error("YouTube API 호출 중 심각한 오류 발생:", error);
    throw error;
  }
}

// 실제 사용할 API 함수들
export const youtubeApi = {
  searchList: (query) => {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: '50',
    });
    return callYoutubeApi('search', params);
  },
  videosList: (videoIds) => {
    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      id: videoIds.join(','),
    });
    return callYoutubeApi('videos', params);
  },
  channelsList: (channelIds) => {
    const params = new URLSearchParams({
      part: 'statistics',
      id: channelIds.join(','),
    });
    return callYoutubeApi('channels', params);
  }
};

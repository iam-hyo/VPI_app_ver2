/**
 * VPI 계산에 필요한 video 객체의 데이터 유효성을 검사합니다.
 * @param {object} video - API로부터 받은 통합 영상 데이터 객체
 * @returns {{isValid: boolean, error: string|null}} - 유효성 결과와 오류 메시지를 담은 객체
 */
export const validateVideoDataForVPI = (video) => {
  // 1. 채널 정보 (구독자 수) 검사
  if (!video.channel || !video.channel.statistics) {
    // App.jsx에서 채널 정보 병합에 실패했을 가능성이 높습니다.
    return { isValid: false, error: "데이터 병합 실패 (채널 정보 누락)" };
  }
  if (video.channel.statistics.subscriberCount === undefined) {
    // API 응답에 구독자 수 필드가 없는 경우입니다. (예: 비공개 채널)
    return { isValid: false, error: "API 응답 누락 (구독자 수)" };
  }

  // 2. 영상 통계 (좋아요 수) 검사
  if (!video.statistics) {
    return { isValid: false, error: "데이터 병합 실패 (영상 통계 누락)" };
  }
  if (video.statistics.likeCount === undefined) {
    // API 응답에 좋아요 수 필드가 없는 경우입니다. (예: 좋아요 비공개 영상)
    return { isValid: false, error: "API 응답 누락 (좋아요 수)" };
  }

  // 3. 기타 필수 정보 검사
  if (!video.snippet?.publishedAt) {
    return { isValid: false, error: "영상 정보 누락 (공개일)" };
  }
  if (!video.contentDetails?.duration) {
    return { isValid: false, error: "영상 정보 누락 (영상 길이)" };
  }

  // 모든 검사를 통과한 경우
  return { isValid: true, error: null };
};

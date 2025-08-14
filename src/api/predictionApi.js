// src/api/predictionApi.js
const PREDICTION_API_URL = 'http://localhost:5001/predict/views';

export const getPredictedViews = async (requestBody) => {
  try {
    const response = await fetch(PREDICTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || `HTTP 오류! 상태 코드: ${response.status}` };
    }

    return await response.json();

  } catch (error) {
    console.error('Prediction API fetch error:', error);
    return { error: '네트워크 오류 또는 예측 서버에 연결할 수 없습니다.' };
  }
};
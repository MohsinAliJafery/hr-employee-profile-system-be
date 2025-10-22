import api from './apiConfig';
export const POST = async (endPoint, body) => {
  const config = {};
  // 👇 Only set headers manually if it's not FormData
  if (!(body instanceof FormData)) {
    config.headers = { 'Content-Type': 'application/json' };
  } else {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const response = await api.post(endPoint, body, config);
  return response;
};

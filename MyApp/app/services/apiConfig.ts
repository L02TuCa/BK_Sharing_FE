export const BASE_URL = 'https://bk-sharing-app.fly.dev';

export const ENDPOINTS = {
    LOGIN: `${BASE_URL}/api/v1/users/login`,
    REGISTER: `${BASE_URL}/api/v1/users`,
    DOCUMENTS: `${BASE_URL}/api/v1/documents`,
    SEARCH_DOCUMENTS: `${BASE_URL}/api/v1/documents/search`,

    // API 1: Cập nhật info (PUT)
    UPDATE_USER_INFO: (id: number | string) => `${BASE_URL}/api/v1/users/${id}`,
    // API 2: Upload avatar (POST/PUT)
    UPLOAD_AVATAR: (id: number | string) => `${BASE_URL}/api/v1/users/${id}/profile-picture`,
};
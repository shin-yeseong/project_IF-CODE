// API 엔드포인트
export const API_ENDPOINTS = {
    BASE_URL: 'http://localhost:8080/api',
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        PROFILE: '/users/profile'
    },
    BOARD: {
        POSTS: '/posts',
        POST: (id) => `/posts/${id}`
    },
    COMPETITION: {
        LIST: '/competitions',
        DETAIL: (id) => `/competitions/${id}`
    },
    JOB: {
        LIST: '/jobs',
        DETAIL: (id) => `/jobs/${id}`
    }
};

// 페이지네이션 설정
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10
};

// 게시판 카테고리
export const BOARD_CATEGORIES = {
    STUDY: 'STUDY',
    PROJECT: 'PROJECT',
    QNA: 'QNA'
};

// 메시지
export const MESSAGES = {
    ERROR: {
        NETWORK: '네트워크 오류가 발생했습니다.',
        SERVER: '서버 오류가 발생했습니다.',
        AUTH: '인증에 실패했습니다.',
        REQUIRED: '필수 항목을 입력해주세요.'
    },
    SUCCESS: {
        SAVE: '성공적으로 저장되었습니다.',
        DELETE: '성공적으로 삭제되었습니다.',
        UPDATE: '성공적으로 수정되었습니다.'
    }
}; 
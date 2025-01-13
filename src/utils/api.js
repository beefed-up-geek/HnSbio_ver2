// src/utils/api.js
import axios from 'axios';

// 인증서 기반 API 설정
const api = axios.create({
  baseURL: 'https://ec2-98-82-55-237.compute-1.amazonaws.com:5000', // 백엔드 URL
  sslPinning: {
    certs: ['certification'], // src/certs/certification.pem (확장자 제외)
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// 파일 업로드용 axios 인스턴스
const formDataApi = axios.create({
  baseURL: 'https://ec2-98-82-55-237.compute-1.amazonaws.com:5000',
  sslPinning: {
    certs: ['certification'],
  },
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export { api, formDataApi };

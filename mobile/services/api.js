import axios from 'axios';
import { API_BASE_URL } from '../config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export function setAuthToken(token) {
  if (!token) {
    delete api.defaults.headers.common.Authorization;
    return;
  }
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}


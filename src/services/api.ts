import axios from 'axios';

export const celestrak = axios.create({
  baseURL: 'https://celestrak.org',
  timeout: 20000,
});

export const openNotify = axios.create({
  baseURL: 'https://api.wheretheiss.at/v1',
  timeout: 10000,
});

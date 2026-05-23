import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const getApiBaseUrl = (): string => {
  const url = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080';
  console.log('[API BASE URL]', url);
  return url;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Post'],
  endpoints: () => ({}),
});

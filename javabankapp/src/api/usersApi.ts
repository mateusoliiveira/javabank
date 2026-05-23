import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from './baseApi';
import { RootState } from '../store';
import { UserSetting } from '../store/authSlice';

export interface UserDTO {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
}

export interface UpdateSettingsRequest {
  bankUserSetting: UserSetting[];
}

export interface UpdateSettingsResponse {
  bankUserSetting: UserSetting[];
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserDTO[], void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    getUserById: builder.query<UserDTO, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    updateSettings: builder.mutation<UpdateSettingsResponse, UpdateSettingsRequest>({
      query: (body) => ({
        url: '/users/settings',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateSettingsMutation } = usersApi;

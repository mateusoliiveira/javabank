import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiBaseUrl } from './baseApi';
import { RootState } from '../store';
import { UserInfo } from '../store/authSlice';

export interface TransferRequest {
  amount: number;
  receiptAccountNumber: string;
}

export interface WithdrawRequest {
  amount: number;
}

export interface DepositRequest {
  amount: number;
}

export interface AccountResponse {
  id: number;
  accountHolderName: string;
  accountNumber: string;
  balance: number;
}

export interface TransactionResponse {
  account: AccountResponse;
}

export interface HistoricTransaction {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  createdAt: string;
  account: AccountResponse;
}

export const accountsApi = createApi({
  reducerPath: 'accountsApi',
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
  tagTypes: ['Account', 'Historic'],
  endpoints: (builder) => ({
    transfer: builder.mutation<TransactionResponse, TransferRequest>({
      query: (body) => ({
        url: '/accounts/transfer',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Historic'],
    }),
    withdraw: builder.mutation<TransactionResponse, WithdrawRequest>({
      query: (body) => ({
        url: '/accounts/withdraw',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Historic'],
    }),
    deposit: builder.mutation<TransactionResponse, DepositRequest>({
      query: (body) => ({
        url: '/accounts/deposit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Historic'],
    }),
    getHistoric: builder.query<HistoricTransaction[], void>({
      query: () => '/accounts/statement',
      providesTags: ['Historic'],
    }),
  }),
});

export const {
  useTransferMutation,
  useWithdrawMutation,
  useDepositMutation,
  useGetHistoricQuery,
} = accountsApi;

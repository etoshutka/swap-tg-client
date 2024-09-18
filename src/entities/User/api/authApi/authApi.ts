import { ApiResponse } from '@/shared/lib/types/apiResponse';
import * as types from './authApiTypes';
import { api } from '@/shared/api/api';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<ApiResponse<types.SignUpResult>, types.SignUpParams>({
      query: (body) => ({
        url: `/auth/sign-up`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

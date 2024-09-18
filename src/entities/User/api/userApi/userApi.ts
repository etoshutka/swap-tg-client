import { ApiResponse } from '@/shared/lib/types/apiResponse';
import { User } from '../../model/types/userSchema';
import * as types from './userApiTypes';
import { api } from '@/shared/api/api';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<ApiResponse<User>, types.GetUserParams>({
      query: (params) => ({
        url: `/users/profile`,
        params,
      }),
    }),
  }),
});

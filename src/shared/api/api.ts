import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const prepareHeaders = (headers: Headers): Headers => {
  headers.set('Content-Type', 'application/json');
  return headers;
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  credentials: 'include',
  prepareHeaders,
});

const baseQueryWithInterceptors: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const refreshResult = await baseQuery({ url: '/users/profile' }, api, extraOptions);

    if (refreshResult.data) {
      await baseQuery({ url: '/users/profile' }, api, extraOptions);
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptors,
  reducerPath: 'api',
  tagTypes: ['User', 'Workspace', 'Ticker', 'Chart', 'Quote', 'Stock', 'Event'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({}),
});

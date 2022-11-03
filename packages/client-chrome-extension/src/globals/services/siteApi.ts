import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as apis from '@/configs/apis.contants';
import { baseURL } from '@/configs/globals.contants';
import { SiteListResponse, SiteItem } from '@/globals/types';
import { stringify } from 'qs';
import prepareHeaders from '@/globals/utils/prepareHeaders';

export const siteApi = createApi({
    reducerPath: 'siteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders,
    }),
    endpoints: (builder) => ({
        pushSite: builder.mutation<any, Record<string, any>>({
            query: (body) => {
                console.log('body', body);
                return {
                    url: apis.SITES,
                    method: 'POST',
                    body,
                };
            },
        }),
        sites: builder.query<SiteListResponse, Record<string, any>>({
            query: (params = {}) => {
                return {
                    url: `${apis.SITES}?${stringify(params)}`,
                    method: 'get',
                };
            },
        }),
        site: builder.query<SiteItem, string>({
            query: (uuid) => {
                return {
                    url: `${apis.SITES}/${uuid}`,
                    method: 'get',
                };
            },
        }),
        sitesAssociate: builder.query<SiteListResponse, Record<string, any>>({
            query: (params = {}) => {
                const { uuid, ...query } = params;
                return {
                    url: `${apis.SITES}/${uuid}/associate?${stringify(query)}`,
                    method: 'get',
                };
            },
        }),
    }),
});

export const {
    useSitesQuery,
    useSiteQuery,
    useSitesAssociateQuery,
    usePushSiteMutation,
} = siteApi;
export const { sites, site, sitesAssociate, pushSite } = siteApi.endpoints;

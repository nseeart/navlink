export const SUCCESS_STATUS_CODE = 0;
export const ERROR_STATUS_CODE = 1;
export const TOKEN_KEY = 'VUE_DESIGN_TOKEN';
export const SITE_DOMAIN = 'http://localhost:3004';
export const baseURL = `${SITE_DOMAIN}/api/v1`;

export const details = {
    name: 'token',
    url: SITE_DOMAIN,
};

export type TypeItem = {
    value: string;
    label: string;
};
export const typeList: Array<TypeItem> = [
    {
        value: 'all',
        label: '全部',
    },
    {
        value: 'site',
        label: '网站',
    },
    {
        value: 'code',
        label: '代码',
    },
];
export const typeMap = new Map(
    typeList.map((item) => [item.value, item.label]),
);

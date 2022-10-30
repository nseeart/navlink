import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/globals/store';
import { User } from '@/globals/types/auth';
import { details } from '@/configs/globals.contants';

export type AuthState = {
    user: User | null;
    isLoginVisible: boolean;
    token: string | null;
    loginState: number;
};

const initialState: AuthState = {
    user: null,
    isLoginVisible: false,
    token: null,
    loginState: 0,
};
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<User | null>) => {
            state.user = payload;
        },
        setIsLoginVisible: (state, { payload }: PayloadAction<boolean>) => {
            state.isLoginVisible = payload;
        },
        setToken: (state, { payload }: PayloadAction<string | null>) => {
            debugger;
            console.log('setToken payload', payload);
            state.token = payload;
        },
        updateLoginState: (state) => {
            state.loginState = state.loginState + 1;
        },
    },
});

export const { setUser, setIsLoginVisible, setToken, updateLoginState } =
    slice.actions;
export default slice.reducer;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoginVisible = (state: RootState) =>
    state.auth.isLoginVisible;
export const selectToken = (state: RootState) => state.auth.token;
export const selectLoginState = (state: RootState) => state.auth.loginState;

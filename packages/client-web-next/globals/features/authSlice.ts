import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from '@/globals/store';
import { AuthState, User } from '@/globals/types/auth';

const initialState: AuthState = { user: null, token: null };
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<User | null>) => {
            state.user = payload;
        },
        setToken: (state, { payload }: PayloadAction<string | null>) => {
            state.token = payload;
        },
    },
});

export const { setUser, setToken } = slice.actions;
export default slice.reducer;
export const selectCurrentUser = (state: AppState) => state.auth.user;
export const selectCurrentToken = (state: AppState) => state.auth.token;

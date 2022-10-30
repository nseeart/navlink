import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/globals/store';

export interface GlobalState {
    isSettingVisible: boolean;
}

const initialState: GlobalState = {
    isSettingVisible: false,
};

export const slice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setIsSettingVisible: (state, { payload }: PayloadAction<boolean>) => {
            state.isSettingVisible = payload;
        },
    },
});

export const { setIsSettingVisible } = slice.actions;

export default slice.reducer;
export const selectIsSettingVisible = (state: RootState) =>
    state.global.isSettingVisible;

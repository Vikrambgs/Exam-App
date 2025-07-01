import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    theme: "light", // 'light' or 'dark'
    showTimer: true,
    showGlobalTimeProgress: true,
    showQuestionTimeProgress: true,
    fontSize: "medium", // 'small', 'medium', 'large'
    soundEnabled: true,
    hideQuestionStatusByDefault: false,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        toggleTimer: (state) => {
            state.showTimer = !state.showTimer;
        },
        setFontSize: (state, action) => {
            state.fontSize = action.payload;
        },
        toggleSound: (state) => {
            state.soundEnabled = !state.soundEnabled;
        },
        toggleShowHideQuestionStatusByDefault: (state) => {
            state.hideQuestionStatusByDefault = !state.hideQuestionStatusByDefault;
        },
        resetSettings: () => {
            return initialState;
        },
        getAllSettings: (state) => {
            return state;
        },
    },
});

export const {
    setTheme,
    toggleTimer,
    setFontSize,
    toggleSound,
    resetSettings,
    toggleShowHideQuestionStatusByDefault,
    getAllSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

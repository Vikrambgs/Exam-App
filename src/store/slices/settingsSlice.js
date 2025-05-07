import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  fontSize: 'medium',
  soundEffects: true,
  timerDisplay: true,
  questionNavigation: {
    showProgress: true,
    allowSkip: true,
    showTimer: true,
  },
  resultDisplay: {
    showDetailedAnalysis: true,
    showCorrectAnswers: true,
    showPerformanceGraph: true,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
  },
  notifications: {
    examReminders: true,
    resultAlerts: true,
    studyTips: true,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    toggleSoundEffects: (state) => {
      state.soundEffects = !state.soundEffects;
    },
    toggleTimerDisplay: (state) => {
      state.timerDisplay = !state.timerDisplay;
    },
    updateQuestionNavigation: (state, action) => {
      state.questionNavigation = {
        ...state.questionNavigation,
        ...action.payload,
      };
    },
    updateResultDisplay: (state, action) => {
      state.resultDisplay = {
        ...state.resultDisplay,
        ...action.payload,
      };
    },
    updateAccessibility: (state, action) => {
      state.accessibility = {
        ...state.accessibility,
        ...action.payload,
      };
    },
    updateNotifications: (state, action) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload,
      };
    },
  },
});

export const {
  setTheme,
  setFontSize,
  toggleSoundEffects,
  toggleTimerDisplay,
  updateQuestionNavigation,
  updateResultDisplay,
  updateAccessibility,
  updateNotifications,
} = settingsSlice.actions;

export default settingsSlice.reducer; 

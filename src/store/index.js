import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import examReducer from './slices/examSlice'
import settingsReducer from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    settings: settingsReducer,
  },
})

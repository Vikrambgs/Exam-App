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
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['your-action-type'],
            // Ignore these field paths in all actions
            ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // Ignore these paths in the state
            ignoredPaths: ['items.dates'],
        },
    }),
})

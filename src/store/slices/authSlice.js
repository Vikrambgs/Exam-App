import { createSlice } from '@reduxjs/toolkit'

// Mock user data - in production, this would come from a backend
const MOCK_USERS = {
  'student1': 'password123',
  'student2': 'password456',
}

const initialState = {
  isAuthenticated: false,
  studentId: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { studentId, password } = action.payload
      if (MOCK_USERS[studentId] === password) {
        state.isAuthenticated = true
        state.studentId = studentId
        state.error = null
      } else {
        state.error = 'Invalid credentials'
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.studentId = null
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { login, logout, setError } = authSlice.actions
export default authSlice.reducer

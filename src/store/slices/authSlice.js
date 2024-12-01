import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Simulated login API call
const loginAPI = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation - in real app, this would be a server call
  if (credentials.username === 'admin' && credentials.password === 'password') {
    return { user: { username: credentials.username } };
  }
  throw new Error('Invalid credentials');
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await loginAPI(credentials);
    return response.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer


import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
  } from "@reduxjs/toolkit";
  
  const getStoredUser = () => {
  if (typeof window === 'undefined') return null;

  const localUser = localStorage.getItem('user');
  if (localUser) return JSON.parse(localUser);

  const sessionUser = sessionStorage.getItem('user');
  if (sessionUser) return JSON.parse(sessionUser);

  return null;
};

const savedUser = getStoredUser();

  // Types
  interface User {
    Userid: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    emailVerified: boolean;
  }
  
  interface AuthState {
    isAuthenticated: boolean;
    
    token: string | null;
    user: User | null;
    error: string | null;
  }
  
  interface JwtPayload {
    id: string;
    fullName: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  }
  
  interface LoginParams {
    email: string;
    password: string;
  }
  
  interface VerifyOtpParams {
    phoneNumber: string;
    code: string;
  }
  
  interface LoginResponse {
    message: string;
    token: string;
  }
  
  interface VerifyOtpResponse {
    message: string;
    token: string;
    user: User;
  }
  
  // Initial state
  const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: savedUser,
    error: null,
  };

  
  // Get the token expiration time
  
  
  // Auth slice
  const authSlice = createSlice({ 
    name: "auth",
    initialState,
    reducers: {
      setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
        state.isAuthenticated = action.payload;
      },

      setUser: (state, ) => {
        state.isAuthenticated = true;
      },
      authSuccess: (state) => {
        state.isAuthenticated = true;
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      },
      setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      },
      },
    })
 
  
  export const {
    setIsAuthenticated,
    setUser,
    authSuccess,
    logout,
    setError,
  } = authSlice.actions;
  
  export default authSlice.reducer;
  
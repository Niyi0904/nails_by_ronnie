
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
    role: 'user' | "admin"
    cart: any
  }
  
  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean
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
    user: null,
    isLoading: false
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

      setUser: (state, action:PayloadAction<User | null>) => {
        state.user =action.payload
        state.isAuthenticated = true;
      },
      authSuccess: (state) => {
        state.isAuthenticated = true;
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.user = null
      },
      setIsLoading: (state, action:PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
      },
    })
 
  
  export const {
    setIsAuthenticated,
    setUser,
    authSuccess,
    logout,
    setIsLoading
  } = authSlice.actions;
  
  export default authSlice.reducer;
  
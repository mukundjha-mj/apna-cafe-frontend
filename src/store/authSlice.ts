import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabaseClient';
import { syncUserProfile } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean; // whether we've checked the session
  isAuthModalOpen: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  initialized: false,
  isAuthModalOpen: false,
};

// Check existing session on app load
export const initAuth = createAsyncThunk('auth/init', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const userData = {
    id: session.user.id,
    name: session.user.user_metadata?.name || '',
    email: session.user.email || '',
    phone: session.user.user_metadata?.phone || '',
  };

  // Sync with PostgreSQL
  try {
    await syncUserProfile(userData);
  } catch (err) {
    console.error('Failed to sync profile:', err);
  }

  return userData as User;
});

// Login with email/password
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);

    const user = data.user;
    const userData = {
      id: user.id,
      name: user.user_metadata?.name || '',
      email: user.email || '',
      phone: user.user_metadata?.phone || '',
    };

    // Sync with PostgreSQL
    try {
      await syncUserProfile(userData);
    } catch (err) {
      console.error('Failed to sync profile during login:', err);
    }

    return userData as User;
  }
);

// Signup with email/password
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (
    { email, password, name, phone }: { email: string; password: string; name: string; phone: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    });
    if (error) return rejectWithValue(error.message);
    if (!data.user) return rejectWithValue('Signup failed');

    const userData = {
      id: data.user.id,
      name,
      email: data.user.email || email,
      phone,
    };

    // Sync with PostgreSQL
    try {
      await syncUserProfile(userData);
    } catch (err) {
      console.error('Failed to sync profile during signup:', err);
    }

    return userData as User;
  }
);

// Logout
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await supabase.auth.signOut();
});

// Login with Google OAuth
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) return rejectWithValue(error.message);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Init auth
    builder.addCase(initAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.initialized = true;
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
    });
    builder.addCase(initAuth.rejected, (state) => {
      state.loading = false;
      state.initialized = true;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Signup
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { clearError, setUser, updateProfile, setAuthModalOpen } = authSlice.actions;
export default authSlice.reducer;

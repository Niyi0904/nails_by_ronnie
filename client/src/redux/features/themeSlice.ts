// redux/features/themeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  theme: 'light' | 'dark';
}

/**
 * Safely read saved theme from localStorage on initialisation.
 * Guards against SSR (typeof window check) and invalid values.
 */
const getSavedTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('nbr-theme');
  return saved === 'dark' ? 'dark' : 'light';
};

/**
 * Apply theme class to <html> element.
 * Called on init AND on every theme change.
 */
const applyThemeToDOM = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const savedTheme = getSavedTheme();

// Apply immediately on load — prevents flash of wrong theme
if (typeof document !== 'undefined') {
  applyThemeToDOM(savedTheme);
}

const initialState: ThemeState = {
  theme: savedTheme,
};

const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;

      // Persist to localStorage so preference survives page refresh
      localStorage.setItem('nbr-theme', action.payload);

      // Apply to DOM
      applyThemeToDOM(action.payload);
    },
  },
});

export const { changeTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;
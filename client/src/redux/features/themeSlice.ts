// store/ThemeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface theme {
    theme: string
}

const initialState: theme = {
  theme: 'light',
};

const ThemeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<string>) => {
        state.theme = action.payload;
        if (state.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
    }
  },
});

export const { changeTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;

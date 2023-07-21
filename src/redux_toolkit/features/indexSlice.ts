import { createSlice } from "@reduxjs/toolkit";
import { media_Item, user } from "@/typeScript/basics";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  darkmode: boolean;
  user: user;
  media_Items: Array<media_Item>;
  my_uploads: Array<media_Item>;
}
const initialState: CounterState = {
  darkmode: false,
  user: {},
  media_Items: [],
  my_uploads: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggle_dark_mode: (state) => {
      state.darkmode = !state.darkmode;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    set_media_items: (state, action) => {
      state.media_Items = [...action.payload];
    },
    set_my_uploads: (state, action) => {
      state.my_uploads = [...action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle_dark_mode, set_media_items, set_my_uploads, setUser } =
  counterSlice.actions;

export default counterSlice.reducer;

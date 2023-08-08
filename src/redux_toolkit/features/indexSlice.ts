import { createSlice } from "@reduxjs/toolkit";
import { media_Item, suggestedData, admin, users } from "@/typeScript/basics";
import type { PayloadAction } from "@reduxjs/toolkit";



export interface CounterState {
  darkmode: boolean;
  admin: admin;
  media_Items: Array<media_Item>;
  my_uploads: Array<media_Item>;
  onLineUsers: Array<onlineUsers>;
  suggestedData: suggestedData;
}
const initialState: CounterState = {
  darkmode: false,
  admin: {},
  media_Items: [],
  my_uploads: [],
  onLineUsers: [],
  suggestedData: { users: [] },
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggle_dark_mode: (state) => {
      state.darkmode = !state.darkmode;
    },
    set_Admin: (state, action:PayloadAction<admin>) => {
      state.admin = action.payload;
    },
    set_media_items: (state, action:PayloadAction<Array<media_Item>>) => {
      state.media_Items = [...action.payload];
    },
    set_my_uploads: (state,  action:PayloadAction<Array<media_Item>>) => {
      state.my_uploads = [...action.payload];
    },
    set_onLineUsers: (state,  action:PayloadAction<Array<onlineUsers>>) => {
      state.onLineUsers = [...action.payload];
    },
    set_suggestedData: (state, action:PayloadAction<suggestedDataPayloadType>) => {
      const { _type }: { _type: String } = action.payload;
      if (_type == "users") {
        const { data }: { data: Array<users> } = action.payload;
        state.suggestedData = { users: [...data] };
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggle_dark_mode,
  set_media_items,
  set_my_uploads,
  set_Admin,
  set_onLineUsers,
  set_suggestedData
} = counterSlice.actions;

export default counterSlice.reducer;



interface suggestedDataPayloadType{
  _type:string;
  data:Array<users>
}


export interface onlineUsers extends users {
  socketId: String;
}
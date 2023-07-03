import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    darkmode: boolean,
    media_Items:Array<T>
  }
  const initialState: CounterState = {
    darkmode: false,
    media_Items:[]
  }


  export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
      toggle_dark_mode:(state)=>{state.darkmode=!state.darkmode},
      set_media_items:(state,action)=>{state.media_Items=[...action.payload]}
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { toggle_dark_mode,set_media_items } = counterSlice.actions
  
  export default counterSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import {user} from '@/typeScript/basics'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    darkmode: boolean,
    user:user
    media_Items:Array<T>
  }
  const initialState: CounterState = {
    darkmode: false,
    user:{},
    media_Items:[]
  }


  export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
      toggle_dark_mode:(state)=>{state.darkmode=!state.darkmode},
      setUser:(state,action)=>{state.user=action.payload},
      set_media_items:(state,action)=>{state.media_Items=[...action.payload]}
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { toggle_dark_mode,set_media_items ,setUser} = counterSlice.actions
  
  export default counterSlice.reducer
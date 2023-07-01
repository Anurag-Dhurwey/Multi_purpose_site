import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    value: boolean
  }
  
  const initialState: CounterState = {
    value: false,
  }


  export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
      dark_mode:(state)=>{state.value=!state.value}
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { dark_mode } = counterSlice.actions
  
  export default counterSlice.reducer
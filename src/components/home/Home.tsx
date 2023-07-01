'use client'
import React from 'react'
import { useAppDispatch, useAppSelector } from "../../redux_toolkit/hooks";
import { RootState } from '@/redux_toolkit/store'
// import {dark_mode } from '../../redux_toolkit/features/counterSlice'

const Home = () => {
  const scrrenMode = useAppSelector((state: RootState) => state.dark_mode.value)
  const dispatch = useAppDispatch()

  console.log(scrrenMode)
  return (
    <div className='w-full flex justify-center items-center'>
      <div className='w-[15%] h-screen bg-slate-600'></div>
      <div className='w-[60%] h-screen bg-green-600'></div>
      <div className='w-[15%] h-screen bg-yellow-700' ></div>
    </div>
  )
}

export default Home

"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { set_Admin } from "@/redux_toolkit/features/indexSlice";
import { getAdminData } from "@/utilities/functions/getAdminData";
const page = () => {

    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const admin = useAppSelector((state) => state.hooks.admin);
    const onLineUsers=useAppSelector((state)=>state.hooks.onLineUsers)
  
    useEffect(() => {
    console.log({onLineUsers})
    }, [session]);

  return (
    <div>
      <h1>hello</h1>
    </div>
  )
}

export default page

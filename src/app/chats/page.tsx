"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { set_Admin, set_onLineUsers } from "@/redux_toolkit/features/indexSlice";
import { getAdminData } from "@/utilities/functions/getAdminData";
import { socketIoConnection } from "@/utilities/socketIo";
import { Chat } from "@/components";
const page = () => {

    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const admin = useAppSelector((state) => state.hooks.admin);
    const onLineUsers=useAppSelector((state)=>state.hooks.onLineUsers)
  
    if(!session){
      return null
    }

    // useEffect(() => {
    //  if(session){
    //   socketIoConnection({session,dispatch,admin,set_Admin,set_onLineUsers})
    //   console.log({onLineUsers})
    //  }
    // }, [session]);

  return (
    <section>
     <Chat/>
    </section>
  )
}

export default page

"use client";
import { useEffect } from "react";
import { Home } from "@/components";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { setUser, set_onLineUsers } from "@/redux_toolkit/features/indexSlice";
import { socketIoConnection } from "@/utilities/socketIo";


export default function Assemble() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = useAppSelector((state) => state.hooks.user);



  useEffect(() => {
    if(session){
      socketIoConnection({session,set_onLineUsers,setUser,dispatch,user});
    }
  }, [session]);

  return (
    <>
      <Home />
    </>
  );
}

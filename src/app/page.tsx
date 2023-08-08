"use client";
import { useEffect } from "react";
import { Home } from "@/components";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { set_Admin, set_onLineUsers } from "@/redux_toolkit/features/indexSlice";
import { socketIoConnection } from "@/utilities/socketIo";


export default function Assemble() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);



  useEffect(() => {
    if(session){
      socketIoConnection({session,set_onLineUsers,set_Admin,dispatch,admin});
    }
  }, [session]);

  return (
    <>
      <Home />
    </>
  );
}

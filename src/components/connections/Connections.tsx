"use client";
import style from './connections.module.css'
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
import UserGui from "../userMinData/UserGui";
const Connections = () => {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.hooks.admin);
  const { data: session } = useSession();
  const connectedUsr = useAppSelector(
    (state) => state.hooks.admin?.connections?.connected
  );
  console.log(connectedUsr);

  function withUseEffect() {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        message:message
      });
    }
  }

  useEffect(() => {
    withUseEffect()
  }, [session]);


  return (
    <section style={{ paddingTop: "8px" }}>
      <p>connections</p>
      <ul className={style.connectionsUl}>
        {connectedUsr?.map((user, i) => {
          const { user:usr,_key}=user
          if (usr._id == "test") {
            return null;
          }
          return (
           <li key={i}>
             <UserGui user={{...usr,_key}}></UserGui>
           </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Connections;

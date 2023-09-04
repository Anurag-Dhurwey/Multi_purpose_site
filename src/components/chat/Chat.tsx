"use client";
import {
  set_Admin,
  set_onLineUsers,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { usersMinData } from "@/typeScript/basics";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);

  const [offlineUsers, setOfflineUsers] = useState<usersMinData[]>([]);

  function filterOfflineUsr() {
    const offlineUsr = admin.connections?.connected?.filter((usr) => {
      const isOnline = onLineUsers.find((Onusr) => {
        return Onusr.email == usr.email;
      });
      return isOnline?.email !== usr.email;
    });
    if (offlineUsr) {
      setOfflineUsers(offlineUsr);
    }
  }

  useEffect(() => {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        set_Admin,
        set_onLineUsers,
        message: message,
      });
      filterOfflineUsr();
      console.log({ onLineUsers });
      console.log({ offlineUsers });
      console.log(admin.connections?.connected);
    }
  }, [session]);
  return (
    <div>
      <span>
        <ul>
          {onLineUsers?.map((item, i) => {
            const { name, email, image } = item;
            return (
              <li key={i} >
                <p style={{color:'green'}}>{name}</p>
              </li>
            );
          })}
        </ul>
      </span>
      <span>
      <ul>
          {offlineUsers?.map((item, i) => {
            const { name, email, image } = item;
            return (
              <li key={i}>
                <p>{name}</p>
              </li>
            );
          })}
        </ul>
      </span>
    </div>
  );
};

export default Chat;

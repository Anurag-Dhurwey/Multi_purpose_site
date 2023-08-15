'use client'
import {
  set_Admin,
  set_onLineUsers,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);

  useEffect(() => {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        set_Admin,
        set_onLineUsers,
        message:message
      });
      console.log({ onLineUsers });
    }
  }, [session]);
  return (
    <div>
      <p>hello chat</p>
    </div>
  );
};

export default Chat;

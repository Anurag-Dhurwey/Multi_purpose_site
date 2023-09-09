"use client";
import {
  onlineUsers,
  set_Admin,
  set_onLineUsers,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { admin, usersMinData,oldChats } from "@/typeScript/basics";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import OnlineOffline from "./miniComps/OnlineOffline";
import { client } from "@/utilities/sanityClient";
import OldConnectedUsr from "./miniComps/OldConnectedUsr";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);
  const [oldChats, setOldChats] = useState<oldChats[]>([]);
  const [remaining_Users, setRemainingUsr] = useState<remaining_Users>({
    onLine: [],
    connected: [],
  });

  if (!session) {
    return null;
  }

  async function get_Old_ChatMessages() {
    try {
      const admins_all_old_chats = await client.fetch(
        `*[_type=="chat" && (userOne.email=="${admin.email}"|| userTwo.email=="${admin.email}") ]`
      );
      if (admins_all_old_chats.length) {
        setOldChats(admins_all_old_chats);
        // return chatMessages[0];
      }
    } catch (error) {
      console.error(error);
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
      get_Old_ChatMessages();
      setRemainUser(admin,onLineUsers,oldChats,setRemainingUsr)
      console.log(admin.connections?.connected);
      console.log({ oldChats });
    }
  }, [session]);
  return (
    <div>
      <span>
        <OnlineOffline
          remain_onLineUsers={remaining_Users.onLine}
          remain_connected={remaining_Users.connected}
        />
      </span>
      <div>
        <aside>
          <OldConnectedUsr users_with_old_chats={oldChats} />
        </aside>
        <div></div>
      </div>
    </div>
  );
};

export default Chat;

function setRemainUser(
  admin: admin,
  onLineUsers: onlineUsers[],
  oldChats: oldChats[],
  setRemainingUsr: React.Dispatch<React.SetStateAction<remaining_Users>>
) {
  const remain_onLineUsr = onLineUsers.filter((usr) => {
    const isExist = oldChats?.find((oldUsr) => {
      return (
        oldUsr.userOne.email == usr.email || oldUsr.userTwo.email == usr.email
      );
    });
    return !isExist;
  });

  const remain_connectedUsr = admin.connections?.connected?.filter((usr) => {
    const isExist = oldChats?.find((oldUsr) => {
      return (
        oldUsr.userOne.email == usr.email || oldUsr.userTwo.email == usr.email
      );
    });
    return !isExist;
  });

  setRemainingUsr({ onLine: remain_onLineUsr, connected: remain_connectedUsr });
}

interface remaining_Users {
  onLine: onlineUsers[] | undefined;
  connected: usersMinData[] | undefined;
}



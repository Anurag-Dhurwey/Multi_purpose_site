"use client";
import style from "./chat.module.css";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import {
  _ref,
  currentUser_On_Chat,
  usr_and_key_in_array,
} from "@/typeScript/basics";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import OnlineOffline from "./miniComps/OnlineOffline";
import { client } from "@/utilities/sanityClient";
import OldConnectedUsr from "./miniComps/OldConnectedUsr";
import ChatBox from "./ChatBox";
import { get_Old_ChatMessages } from "@/utilities/functions/getOldChatMessages";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);
  const oldChats = useAppSelector((state) => state.hooks.oldChats);

  const [remaining_Users, setRemainingUsr] = useState<usr_and_key_in_array[]>();
  const [currentUser, setCurrentUsr] = useState<currentUser_On_Chat>();

  function setRemainingUsers() {
    if (session && oldChats) {
      const remain_Usr = admin.connections?.connected?.filter((usr) => {
        const isExist = oldChats.find((oldUsr) => {
          const { userOne, userTwo } = oldUsr;
          return (
            userOne.email == usr.user.email || userTwo.email == usr.user.email
          );
        });
        return !isExist;
      });
      setRemainingUsr(remain_Usr);
    }
  }

  function withUseEffec_two() {
    if (session && oldChats) {
      setRemainingUsers();
      console.log({ remaining_Users, onLineUsers });
    }
  }

  useEffect(() => {
    withUseEffec_two();
  }, [onLineUsers.length, session, oldChats]);

  function withUseEffect() {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        message: message,
      });
     if(!oldChats?.length){
      get_Old_ChatMessages({session,oldChats,admin,dispatch});
     }
    }
  }

  useEffect(() => {
    withUseEffect();
  }, [session]);

  if (!session) {
    return null;
  }

  const toggleAsside = {
    ...(window.innerWidth <= 475 && {
      display: currentUser ? "none" : "",
    }),
  };
  const toggleMain = {
    ...(window.innerWidth <= 475 && {
      display: currentUser ? "" : "none",
    }),
  };

  return (
    <div style={{ paddingBottom: "4px" }}>
      {remaining_Users && (
        <span>
          <OnlineOffline
            remain_usr={remaining_Users}
            setCurrentUsr={setCurrentUsr}
          />
        </span>
      )}
      <div className={style.chatMain}>
        {oldChats && (
          <aside className={style.chatAside} style={toggleAsside}>
            <OldConnectedUsr
              users_with_old_chats={oldChats}
              setCurrentUsr={setCurrentUsr}
            />
          </aside>
        )}
        <main className={style.chatMainChatbox} style={toggleMain}>
          {currentUser && (
            <ChatBox currentUser={currentUser} setCurrentUsr={setCurrentUsr} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;

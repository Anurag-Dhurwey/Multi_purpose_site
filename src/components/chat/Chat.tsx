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
import OldConnectedUsr from "./miniComps/OldConnectedUsr";
import ChatBox from "./ChatBox";
import { get_Users_with_Old_Chat } from "@/utilities/functions/getUsers_with_OldChats";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);
  const users_with_old_chats = useAppSelector(
    (state) => state.hooks.users_with_old_chats
  );

  const [remaining_Users, setRemainingUsr] = useState<usr_and_key_in_array[]>();
  const [currentUser, setCurrentUsr] = useState<currentUser_On_Chat>();
  const [innerWH, setInnerWh] = useState({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  });

  // this function is to filter friends who are not intracted yet with admin or no conversation yet
  function setRemainingUsers() {
    if (session && users_with_old_chats?.length) {
      const remain_Usr = admin.connections?.connected?.filter((usr) => {
        const isExist = users_with_old_chats.find((oldUsr) => {
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
    if (session && users_with_old_chats?.length) {
      setRemainingUsers();
      console.log({ remaining_Users, onLineUsers, users_with_old_chats });
    }
  }

  useEffect(() => {
    withUseEffec_two();
  }, [onLineUsers, session, users_with_old_chats]);

  function withUseEffect() {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        message: message,
      });
      if (!users_with_old_chats?.length && admin._id) {
        get_Users_with_Old_Chat({ session, admin, dispatch });
      }
    }
  }

  useEffect(() => {
    withUseEffect();

    const handleResize = () => {
      setInnerWh({
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
      });
    };

    // Add the event listener to window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [session, admin]);

  if (!session) {
    return null;
  }

  const toggleAsside = {
    ...(innerWH.innerWidth <= 700 && {
      display: currentUser ? "none" : "",
    }),
  };
  const toggleMain = {
    ...(innerWH.innerWidth <= 700 && {
      display: currentUser ? "" : "none",
    }),
  };

  return (
    <div className={style.mainParent}>
      <div className={style.first_childDiv}>
        {remaining_Users && (
          <OnlineOffline
            remain_usr={remaining_Users}
            setCurrentUsr={setCurrentUsr}
          />
        )}
      </div>
      <div className={style.second_childDiv}>
        {users_with_old_chats && (
          <aside className={style.chatAside} style={toggleAsside}>
            <OldConnectedUsr
              users_with_old_chats={users_with_old_chats}
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

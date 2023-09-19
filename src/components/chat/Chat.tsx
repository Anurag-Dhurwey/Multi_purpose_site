"use client";
import {
  onlineUsers,
  set_Admin,
  set_onLineUsers,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import {
  _ref,
  currentUser_On_Chat,
  oldChats,
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

const Chat = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);
  const [oldChats, setOldChats] = useState<oldChats[]>();
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

  async function get_Old_ChatMessages() {
    if (!oldChats && session) {
      try {
        const admins_all_old_chats = await client.fetch(
          `*[_type=="chat" && (userOne._ref=="${admin._id}"|| userTwo._ref=="${admin._id}") ]{_id,userOne->{_id,name,email,image},userTwo->{_id,name,email,image}}`
        );
        if (admins_all_old_chats.length) {
          setOldChats(admins_all_old_chats);
          // return chatMessages[0];
        }
      } catch (error) {
        console.error(error);
      }
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
      get_Old_ChatMessages();
    }
  }

  useEffect(() => {
    withUseEffect();
  }, [session]);
  if (!session) {
    return null;
  }
  return (
    <div>
      {remaining_Users && (
        <span>
          <OnlineOffline
            remain_usr={remaining_Users}
            setCurrentUsr={setCurrentUsr}
          />
        </span>
      )}
      <div>
        {oldChats && (
          <aside>
            <OldConnectedUsr
              users_with_old_chats={oldChats}
              setCurrentUsr={setCurrentUsr}
            />
          </aside>
        )}
        <div>
          {currentUser && (
            <ChatBox currentUser={currentUser} setCurrentUsr={setCurrentUsr} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

interface remaining_Users {
  onLine: onlineUsers[] | undefined;
  connected: usr_and_key_in_array[] | undefined;
}

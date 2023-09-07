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
import Image from "next/image";
import Link from "next/link";

const Chat = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);

  const [offlineUsers, setOfflineUsers] = useState<usersMinData[]>([]);

  if(!session){
    return null
  }
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
            const { name, email, image ,_id} = item;
            const serializedObject = encodeURIComponent(JSON.stringify({_id,email,name}));
            return (
              <li
              key={_id}
              className="w-fit py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
            >
              <Image
                src={`${image}`}
                height={100}
                width={100}
                alt="image"
                className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
              />
              <p style={{color:'green'}} className="text-xs">{name}</p>
              <Link href={`/chats/${serializedObject}`}>
              Chat
              </Link>
            </li>
            );
          })}
        </ul>
      </span>
      <span>
      <ul>
          {offlineUsers?.map((item, i) => {
            const { name, email, image,userId:_id } = item;
            const serializedObject = encodeURIComponent(JSON.stringify({_id,email,name}));
            return (
              <li
              key={_id}
              className="w-fit py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
            >
              <Image
                src={`${image}`}
                height={100}
                width={100}
                alt="image"
                className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
              />
              <p className="text-xs">{name}</p>
              <Link href={`/chats/${serializedObject}`}>
              Chat
              </Link>
              {/* <button onClick={()=>onChatHandler()}>Chat</button> */}
            </li>
            );
          })}
        </ul>
      </span>
    </div>
  );
};

export default Chat;

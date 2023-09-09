import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usersMinData } from "@/typeScript/basics";
import { onlineUsers } from "@/redux_toolkit/features/indexSlice";
import { useAppSelector } from "@/redux_toolkit/hooks";
import { useSession } from "next-auth/react";

interface propType {
  remain_connected: usersMinData[]|undefined;
  remain_onLineUsers: onlineUsers[]|undefined;
}
const OnlineOffline = ({ remain_connected, remain_onLineUsers }: propType) => {
  const { data: session } = useSession();
  const [offlineUsers, setOfflineUsers] = useState<usersMinData[]>([]);

  function filterOfflineUsr() {
    const offlineUsr = remain_connected?.filter((usr) => {
      const isOnline = remain_onLineUsers?.find((Onusr) => {
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
      filterOfflineUsr();
      console.log({ remain_connected});
      console.log({ remain_onLineUsers});
    }
  }, [session]);

  return (
    <ul>
      {remain_onLineUsers?.map((item, i) => {
        const { name, email, image, _id } = item;
        const serializedObject = encodeURIComponent(
          JSON.stringify({ _id, email, name })
        );
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
            <p style={{ color: "green" }} className="text-xs">
              {name}
            </p>
            <Link href={`/chats/${serializedObject}`}>Chat</Link>
          </li>
        );
      })}

      {offlineUsers?.map((item, i) => {
        const { name, email, image, userId: _id } = item;
        const serializedObject = encodeURIComponent(
          JSON.stringify({ _id, email, name })
        );
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
            <Link href={`/chats/${serializedObject}`}>Chat</Link>
            {/* <button onClick={()=>onChatHandler()}>Chat</button> */}
          </li>
        );
      })}
    </ul>
  );
};

export default OnlineOffline;

"use client";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { set_Admin, set_onLineUsers } from "@/redux_toolkit/features/indexSlice";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
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
        set_Admin,
        set_onLineUsers,
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
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {connectedUsr?.map((user, i) => {
          if (user.user._id == "test") {
            return null;
          }
          return (
            <li
              key={ user._key}
              className="py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
            >
               {user.user.image.includes("https://") ? (
                <Image
                  src={`${user.user.image}`}
                  height={100}
                  width={100}
                  alt="image"
                  className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
                />
              ) : (
                null
              )}
              <p className="text-xs">{user.user.name}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Connections;

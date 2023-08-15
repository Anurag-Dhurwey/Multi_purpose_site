"use client";
import {
  set_Admin,
  set_onLineUsers,
  set_suggestedData,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { getAdminData } from "@/utilities/functions/getAdminData";
import { getSuggestedUsers } from "@/utilities/functions/getSuggestedUsers";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Image from "next/image";
import { users } from "@/typeScript/basics";
import { socketIoConnection } from "@/utilities/socketIo";

interface propType {
  sendRequestHandler: (userTosendReq: users) => void;
}

const Suggetions = ({ sendRequestHandler }: propType) => {
  const dispatch: Function = useAppDispatch();
  const { data: session } = useSession();
  const suggestedData = useAppSelector((state) => state.hooks.suggestedData);
  const admin = useAppSelector((state) => state.hooks.admin);

  async function configureSuggestions() {
    if (session) {
      if (!suggestedData.users.length) {
        try {
          const userArr = await getSuggestedUsers();
          console.log(userArr);
          if (userArr) {
            dispatch(set_suggestedData({ _type: "users", data: userArr }));
          }
        } catch (error) {
          message.error("something went wrong");
        } finally {
        }
      }
    }
  }

  useEffect(() => {
    configureSuggestions();
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        set_Admin,
        set_onLineUsers,
        message
      });
    }
  }, [session]);

  return (
    <section style={{ paddingTop: "8px" }}>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {suggestedData.users ? (
          suggestedData.users.map((user, i) => {
            return (
              <li
                key={user._id ? user._id : i}
                style={{ display: admin._id == user._id ? "none" : "" }}
                className="py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
              >
                <Image
                  src={`${user.image}`}
                  height={100}
                  width={100}
                  alt="image"
                  className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
                />
                <p className="text-xs">{user.name}</p>
                <button className="" onClick={() => sendRequestHandler(user)}>
                  connect
                </button>
              </li>
            );
          })
        ) : (
          <li>Gathering information</li>
        )}
      </ul>
    </section>
  );
};

export default Suggetions;

interface propType {
  sendRequestHandler: (userTosendReq: users) => void;
}

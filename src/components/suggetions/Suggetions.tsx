"use client";
import {
  set_Admin,
  set_onLineUsers,
  set_suggestedData,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { getSuggestedUsers } from "@/utilities/functions/getSuggestedUsers";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Image from "next/image";
import { users } from "@/typeScript/basics";
import { socketIoConnection } from "@/utilities/socketIo";


const Suggetions = ({ sendRequestHandler }: propType) => {

  const admin = useAppSelector((state) => state.hooks.admin);
  const { data: session } = useSession();
 
  const dispatch = useAppDispatch();
  const suggestedData = useAppSelector((state) => state.hooks.suggestedData);

  async function configureSuggestions() {
    if (session) {
      if (!suggestedData.users.length) {
        await getSuggestedUsers({admin,session,suggestedData,dispatch,set_suggestedData,message});
      }
    }
  }

  function withUseEffect() {
    if (session) {
      configureSuggestions();
      socketIoConnection({
        session,
        dispatch,
        admin,
        set_Admin,
        set_onLineUsers,
        message
      });
    }
  }

  useEffect(() => {
   withUseEffect()
  }, [session]);

  if(!admin._id){
    return null
  }
console.log({suggestedData})
  return (
    <section style={{ paddingTop: "8px" }}>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {suggestedData.users ? (
          suggestedData.users.map((user, i) => {
            if(admin?._id == user._id){return null}
            return (
              <li
                key={user._id ? user._id : i}
                className="  py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
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

"use client";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { getSuggestedUsers } from "@/utilities/functions/getSuggestedUsers";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { users } from "@/typeScript/basics";
import { socketIoConnection } from "@/utilities/socketIo";
import UserGui from "../userMinData/UserGui";

const Suggetions = ({ sendRequestHandler }: propType) => {
  const admin = useAppSelector((state) => state.hooks.admin);
  const { data: session } = useSession();

  const dispatch = useAppDispatch();
  const suggestedData = useAppSelector((state) => state.hooks.suggestedData);

  async function configureSuggestions() {
    if (session) {
      if (!suggestedData.users.length) {
        await getSuggestedUsers({
          admin,
          session,
          suggestedData,
          dispatch,
          message,
        });
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
        message,
      });
    }
  }

  useEffect(() => {
    withUseEffect();
  }, [session]);

  if (!admin._id) {
    return null;
  }
  return (
    <section style={{ paddingTop: "8px" }}>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {suggestedData.users ? (
          suggestedData.users.map((user, i) => {
            if (admin?._id == user._id) {
              return null;
            }
            const slug=encodeURIComponent(JSON.stringify({...user}))
            return (
             <li key={i}>
               <UserGui user={{...user}}>
                <button className="" onClick={() => sendRequestHandler(user)}>
                  connect
                </button>
              </UserGui>
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

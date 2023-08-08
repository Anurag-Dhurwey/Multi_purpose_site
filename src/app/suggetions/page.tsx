"use client";
import React, { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSuggestedUsers } from "@/utilities/functions/getSuggestedUsers";
import { userTosendReq } from "@/typeScript/basics";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import {
  setUser,
  set_suggestedData,
} from "@/redux_toolkit/features/indexSlice";
import Image from "next/image";
import { client } from "@/utilities/sanityClient";
import { message } from "antd";
import { getUserId } from "@/utilities/functions/getUserId";
const page = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const suggestedData = useAppSelector((state) => state.hooks.suggestedData);
  const user = useAppSelector((state) => state.hooks.user);
  async function configureSuggestions() {
    if (session) {
      if (!suggestedData.users.length) {
        console.log("hello");
        const userArr = await getSuggestedUsers();
        console.log(userArr);
        if (userArr) {
          dispatch(set_suggestedData({ _type: "users", data: userArr }));
        }
      }
    }
  }

  async function sendRequestHandler(userTosendReq: userTosendReq) {
    if (user._id) {
      console.log(userTosendReq.email, userTosendReq.name);
      try {
        const res = await client
          .patch(userTosendReq._id)
          .setIfMissing({ connections: { requests: [] } })
          .insert("after", "connections.requests[-1]", [
            {
              name: user.name,
              userId: user._id,
              mail: user.email,
              img: user.image,
            },
          ])
          .commit({ autoGenerateArrayKeys: true });
        console.log(res);
        message.success("Request sent");
      } catch (error) {
        message.error("something went wrong");
        console.error(error);
      }
    } else {
      console.error("user not found");
      message.error("user id not found");
    }
  }

  useEffect(() => {
    configureSuggestions();
    if (!user._id && session) {
      getUserId({ dispatch, setUser, user, session });
    }
  }, [session]);

  console.log(suggestedData);
  return (
    <section style={{ paddingTop: "8px" }}>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {suggestedData.users ? (
          suggestedData.users.map((user, i) => {
            return (
              <li
                key={user._id ? user._id : i}
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

export default page;

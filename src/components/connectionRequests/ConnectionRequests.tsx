"use client";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAdminData } from "@/utilities/functions/getAdminData";
import {
  set_Admin,
  set_Admins_Connections,
} from "@/redux_toolkit/features/indexSlice";
import Image from "next/image";
import { usersMinData } from "@/typeScript/basics";
import { client } from "@/utilities/sanityClient";
import { message } from "antd";
const ConnectionRequests = () => {
  const dispatch = useAppDispatch();
  // const { data: session } = useSession();
  const requests = useAppSelector(
    (state) => state.hooks.admin.connections?.requests
  );
  const admin = useAppSelector((state) => state.hooks.admin);
  console.log(requests);

  // this below function will move requested user from requests to connectedUsr
  async function acceptRequestHandler(userToAcceptReq: usersMinData) {
    const { userId, name, mail, img, _key } = userToAcceptReq;
    console.log(userId, name, mail, img, _key);
    if (admin._id && admin.connections) {
      const isAlreadyExist = admin.connections?.connectedUsr?.find(
        (user) => user.userId == userToAcceptReq.userId
      );

      if (!isAlreadyExist) {
        try {
          // adding data to connectedUsr
          const added = await client
            .patch(admin._id)
            .setIfMissing({ connections: { connectedUsr: [] } })
            .insert("before", "connections.connectedUsr[-1]", [
              { userId: userId, name: name, mail: mail, img: img },
            ])
            .commit({ autoGenerateArrayKeys: true });
          const check = added.connections.connectedUsr?.find(
            (usr: usersMinData) => usr.userId == userId
          );
          console.log(check);
          if (check) {
            // removing request from my connections
            const removed = await client
              .patch(admin._id)
              .unset(["connections.requests[0]", `requests[_key==${_key}]`])
              .commit();

            dispatch(
              set_Admins_Connections({
                command: "accept",
                data: userToAcceptReq,
                current: admin.connections,
              })
            );
            message.success("request accepted");

            // adding admin data on friends account who want's to connect with me
            const addedInFriendsAccount = await client
              .patch(userToAcceptReq.userId)
              .setIfMissing({ connections: { connectedUsr: [] } })
              .insert("before", "connections.connectedUsr[-1]", [
                {
                  userId: admin._id,
                  name: admin.name,
                  mail: admin.email,
                  img: admin.image,
                },
              ])
              .commit({ autoGenerateArrayKeys: true });
            const check2 = addedInFriendsAccount.connections.connectedUsr?.find(
              (usr: usersMinData) => usr.userId == admin._id
            );
            if (check2) {
              // if admin data on friends account then no need to perform again
              // emitConnectionRequestSent(userTosendReq);
              console.log("added to friends account");
            } else {
              // but while this function need to add admin data on friends account who want's to connect with me
              // emitConnectionRequestSent(userTosendReq);
              console.log("unable to add in friends account");
            }
          } else {
            message.error("unable to add something went wrong");
          }
        } catch (error) {
          console.error(error);
          message.error("error");
        }
      } else {
        try {
          const removed = await client
            .patch(admin._id)
            .unset(["connections.requests[0]", `requests[_key==${_key}]`])
            .commit();
          message.success("request accepted");
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.error("admin not found");
      message.error("login to contineu");
    }
  }

  async function onRejectHandler(userToRejectReq: usersMinData) {
    const { _key } = userToRejectReq;
    if (admin._id && admin.connections) {
      try {
        const removed = await client
          .patch(admin._id)
          .unset(["connections.requests[0]", `requests[_key==${_key}]`])
          .commit();
        const check = removed.connections.requets?.find(
          (usr:usersMinData) => usr.userId == userToRejectReq.userId
        );
        if(!check){
          dispatch(set_Admins_Connections({
            command: "reject",
            data: userToRejectReq,
            current: admin.connections,
          }));
        }else{
          console.log('something went wrong')
        }

 
      } catch (error) {
        console.log(error);
        message.error("try again after some time");
      }
    }
  }

  // useEffect(() => {
  //   if (session && !admin._id) {
  //     getAdminData({ dispatch, admin, session, set_Admin });
  //   }
  //   console.log("hello");
  // }, [session]);

  return (
    <section style={{ paddingTop: "8px" }}>
      <p>Requests</p>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {requests?.map((req, i) => {
          return (
            <li
              key={req.userId ? i : i}
              className="py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
            >
              {req.img?(<Image
                src={`${req.img}`}
                height={100}
                width={100}
                alt="image"
                className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
              />):(<p></p>)}
              <p className="text-xs">{req.name}</p>
              <button className="" onClick={() => acceptRequestHandler(req)}>
                accept
              </button>
              <button onClick={() => onRejectHandler(req)}>reject</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ConnectionRequests;

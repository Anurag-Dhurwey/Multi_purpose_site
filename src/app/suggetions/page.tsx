"use client";

import Suggetions from "@/components/suggetions/Suggetions";
import { useAppSelector } from "@/redux_toolkit/hooks";
import { users, usersMinData } from "@/typeScript/basics";
import { client } from "@/utilities/sanityClient";
import { getSocket } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const admin = useAppSelector((state) => state.hooks.admin);
  const { data: session } = useSession();
  const socket=getSocket(session)
  const emitConnectionRequestSent = ({userTosendReq,_key}: {userTosendReq:users,_key:string}) => {
    if(socket){
      socket.emit("ConnectionRequest", { user: userTosendReq ,me:admin,_key});
    }else{
      console.log('unable to connect to web-socket')
    }
  };

  async function sendRequestHandler(userTosendReq: users) {
    if (admin._id) {
      const { _id, image, name, email } = userTosendReq;
      console.log(userTosendReq.email, userTosendReq.name);
      try {
        const res = await client
          .patch(userTosendReq._id)
          .setIfMissing({ connections: { requests_got: [] } })
          .insert("after", "connections.requests_got[-1]", [
            {
              name: admin.name,
              userId: admin._id,
              mail: admin.email,
              img: admin.image,
            },
          ])
          .commit({ autoGenerateArrayKeys: true });
        const check = res.connections.requests_got?.find(
          (usr: usersMinData) => usr.userId == admin._id
        );
        console.log(check);
        if (check) {
          emitConnectionRequestSent({userTosendReq,_key:check._key});
          message.success("Request sent");
        } else {
          message.error("unable to add something went wrong");
        }
      } catch (error) {
        message.error("something went wrong");
        console.error(error);
      }
    } else {
      console.error("user not found");
      message.error("user id not found");
    }
  }

  if(!session){return null}
 

  return (
    <main>
      <Suggetions sendRequestHandler={sendRequestHandler} />
    </main>
  );
};

export default Page;

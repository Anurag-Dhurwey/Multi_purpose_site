"use client";

import Suggetions from "@/components/suggetions/Suggetions";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { users, usersMinData } from "@/typeScript/basics";
import { getAdminConnectionId,getUsrConnectionId } from "@/utilities/functions/getConnectionsId";
import { client } from "@/utilities/sanityClient";
import { getSocket } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
const Page = () => {
  const admin = useAppSelector((state) => state.hooks.admin);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  async function mutation(userTosendReq: users) {
    const { _id, image, name, email } = userTosendReq;
    try {
     const friendsConnectionId=userTosendReq.connections?._id?userTosendReq.connections:await getUsrConnectionId(_id)
      if (friendsConnectionId?._id) {
        const res = await client
          .patch(friendsConnectionId._id)
          .setIfMissing({ requests_got: [] })
          .insert("after", "requests_got[-1]", [
            {
              _key: uuidv4(),
              name: admin.name,
              userId: admin._id,
              mail: admin.email,
              img: admin.image,
            },
          ])
          .commit();
        const check = res.connections.requests_got?.find(
          (usr: usersMinData) => usr.userId == admin._id
        );
        return check;
      } else {
        const doc = {
          _type: "connections",
          userId: _id,
          email: email,
          requests_got: [
            {
              _key: uuidv4(),
              name: admin.name,
              userId: admin._id,
              mail: admin.email,
              img: admin.image,
            },
          ],
        };
        const createdDoc = await client.create(doc);
        const check = createdDoc.requests_got.find(
          (usr) => usr.userId == admin._id
        );
        return check;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const emitConnectionRequestSent = async ({
    userTosendReq,
    _key,
  }: {
    userTosendReq: users;
    _key: string;
  }) => {
    const socket = getSocket(session);
    if (socket) {
      socket.emit("ConnectionRequest", {
        user: userTosendReq,
        me: admin,
        _key,
      });
    } else {
      console.log("unable to connect to web-socket");
    }
  };

  async function sendRequestHandler(userTosendReq: users) {
    if (admin._id) {
      const { _id, image, name, email } = userTosendReq;
      
      const adminConnectionsId:string|undefined = admin.connections?._id
        ? admin.connections._id
        : await getAdminConnectionId({ dispatch, id: admin._id, admin });
      console.log(userTosendReq.email, userTosendReq.name,adminConnectionsId);
      try {
        const check = await mutation(userTosendReq);
        console.log({ check });
        if (check) {
          emitConnectionRequestSent({ userTosendReq, _key: check._key });
          message.success("Request sent");

          // below function, there is no need to perform because it will add data to array, but in app there in no implemented method to remove data
          if (adminConnectionsId) {
            const requestSent = await client
              .patch(adminConnectionsId)
              .setIfMissing({ requests_sent: [] })
              .insert("after", "requests_sent[-1]", [
                {
                  _key: uuidv4(),
                  name: name,
                  userId: _id,
                  mail: email,
                  img: image,
                },
              ])
              .commit();
          } else {
            const doc = {
              _type: "connections",
              userId: _id,
              email: email,
              requests_sent: [
                {
                  _key: uuidv4(),
                  name: name,
                  userId: _id,
                  mail: email,
                  img: image,
                },
              ],
            };
            const createdDoc = await client.create(doc);
          }
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

  if (!session) {
    return null;
  }

  return (
    <main>
      <Suggetions sendRequestHandler={sendRequestHandler} />
    </main>
  );
};

export default Page;


interface FCtype{
  _id:string;
  requests_sent:Array<usersMinData>
}
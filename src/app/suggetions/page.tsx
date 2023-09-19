"use client";

import Suggetions from "@/components/suggetions/Suggetions";
import { set_Admin } from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { _ref, min_id_of_usr } from "@/typeScript/basics";
import {
  getAdminConnectionId,
  getUsrConnectionId,
} from "@/utilities/functions/getConnectionsId";
import { client } from "@/utilities/sanityClient";
import { getSocket } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";


const Page = () => {
  const admin = useAppSelector((state) => state.hooks.admin);
  // const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [onRequest, setOnRequest] = useState<boolean>(false);

  async function mutation(userTosendReq: min_id_of_usr) {
    const { _id, image, name, email } = userTosendReq;
    try {
      const friendsConnectionId = await getUsrConnectionId(_id);
      if (friendsConnectionId?._id) {
        const res: resType = await client
          .patch(friendsConnectionId._id)
          .setIfMissing({ requests_got: [] })
          .insert("after", "requests_got[-1]", [
            {
              _key: uuidv4(),
              user: {
                _type: "reference",
                _ref: admin._id,
              },
            },
          ])
          .commit();
        const check = res.requests_got?.find(
          (usr: { _key: string; user: _ref }) => usr.user._ref == admin._id
        );
        if (check) {
          return check;
        }
      } else {
        const doc = {
          _type: "connections",
          user: {
            _type: "reference",
            _ref: _id,
          },
          requests_got: [
            {
              _key: uuidv4(),
              user: {
                _type: "reference",
                _ref: admin._id,
              },
            },
          ],
        };
        const createdDoc = await client.create(doc);
        const check = createdDoc.requests_got?.find(
          (usr) => usr.user._ref == admin._id
        );
        if (check) {
          return check;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const emitConnectionRequestSent = async ({
    userTosendReq,
    _key,
  }: {
    userTosendReq: min_id_of_usr;
    _key: string;
  }) => {
    const { socket } = await getSocket({ session, dispatch, admin});

    if (socket?.connected) {
      socket.emit("ConnectionRequest", {
        sendTo: { ...userTosendReq},
        sentBy: {
          _id: admin._id,
          name: admin.name,
          image: admin.image,
          email: admin.email,
          socketId: socket.id,
        },
        _key,
      });
    } else{
      console.error("socket not found");
    } 
  };

  async function sendRequestHandler(userTosendReq: min_id_of_usr) {
    if (admin._id && !onRequest) {
      setOnRequest(true);
      const { _id, image, name, email } = userTosendReq;

      const adminConnectionsId: string | undefined = admin.connections?._id
        ? admin.connections._id
        : await getAdminConnectionId({ dispatch, id: admin._id, admin });
      console.log(userTosendReq.email, userTosendReq.name, adminConnectionsId);
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
                  user: {
                    _type: "reference",
                    _ref: _id,
                  },
                },
              ])
              .commit();
          } else {
            const doc = {
              _type: "connections",
              user: {
                _type: "reference",
                _ref: admin._id,
              },
              requests_sent: [
                {
                  _key: uuidv4(),
                  user: {
                    _type: "reference",
                    _ref: _id,
                  },
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
      } finally {
        setOnRequest(false);
      }
    } else if (onRequest) {
      alert("wait a second");
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



interface resType {
  userId: string;
  email: string;
  requests_got: { _key: string; user: _ref }[];
}

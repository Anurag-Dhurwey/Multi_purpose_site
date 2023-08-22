"use client";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import React from "react";
import {
  set_Admins_Connections,
  set_ConnectionsId,
} from "@/redux_toolkit/features/indexSlice";
import Image from "next/image";
import { usersMinData } from "@/typeScript/basics";
import { client } from "@/utilities/sanityClient";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";
import {
  getAdminConnectionId,
  getUsrConnectionId,
} from "@/utilities/functions/getConnectionsId";

const ConnectionRequests = () => {
  const dispatch = useAppDispatch();
  // const { data: session } = useSession();
  const requests = useAppSelector(
    (state) => state.hooks.admin?.connections?.requests_got
  );
  const admin = useAppSelector((state) => state.hooks.admin);
  console.log(requests);

  // this below function will move requested user from requests to connectedUsr
  async function acceptRequestHandler(userToAcceptReq: usersMinData) {
    const { userId, name, mail, img, _key } = userToAcceptReq;
    if (admin?._id) {
      const adminConnectionsId = admin.connections?._id
        ? admin.connections._id
        : await getAdminConnectionId({ dispatch, id: admin._id, admin });

      const isAlreadyExist = admin.connections?.connected?.find(
        (user) => user.userId == userToAcceptReq.userId
      );

      if (!isAlreadyExist && adminConnectionsId) {
        try {
          // adding data to connectedUsr
          const added = await client
            .patch(adminConnectionsId)
            .setIfMissing({ connected: [] })
            .insert("after", "connected[-1]", [
              {
                _key: uuidv4(),
                userId: userId,
                name: name,
                mail: mail,
                img: img,
              },
            ])
            .commit();
          const check = added.connected?.find(
            (usr: usersMinData) => usr.userId == userId
          );
          console.log(added);
          console.log(check);
          if (check) {
            // removing request from my connections
            const removed = await client
              .patch(adminConnectionsId)
              .unset(["requests_got[0]", `requests_got[_key=="${_key}"]`])
              .commit();

            if (admin.connections) {
              dispatch(
                set_Admins_Connections({
                  command: "accept",
                  data: userToAcceptReq,
                  current: admin.connections,
                })
              );
            }
            message.success("request accepted");

            // adding admin data on friends account who want's to connect with me
            const friendsConnectionId = await getUsrConnectionId(userId);
            // this below variable is to get _key to delete element from requests_sent array after accepting connection request
            const element = friendsConnectionId?.requests_sent?.find(
              (usr: usersMinData) => usr.userId == admin._id
            );
            console.log({ element });
            if (friendsConnectionId?._id && element) {
              const addedInFriendsAccount = await client
                .patch(friendsConnectionId._id)
                .setIfMissing({ connected: [] })
                .insert("after", "connected[-1]", [
                  {
                    _key: uuidv4(),
                    userId: admin._id,
                    name: admin.name,
                    mail: admin.email,
                    img: admin.image,
                  },
                ])
                .unset([
                  "requests_sent[0]",
                  `requests_sent[_key=="${element._key}"]`,
                ])
                .commit();
              const check2 = addedInFriendsAccount.connected?.find(
                (usr: usersMinData) => usr.userId == admin._id
              );
              if (check2) {
                // if admin data on friends account then no need to perform again
                // emitConnectionRequestSent(userTosendReq);
                const arr = addedInFriendsAccount.request_sent?.find(
                  (obj: usersMinData) => obj.userId == admin._id
                );
                console.log(addedInFriendsAccount);
                console.log(arr);
                console.log("added to friends account");
              } else {
                // emitConnectionRequestSent(userTosendReq);
                console.log("unable to add in friends account");
              }
            } else {
              console.log("element not found");
            }
          } else {
            message.error("unable to add something went wrong");
          }
        } catch (error) {
          console.error(error);
          message.error("error");
        }
      } else if (isAlreadyExist && adminConnectionsId) {
        try {
          const removed = await client
            .patch(adminConnectionsId)
            .unset(["requests_got[0]", `requests_got[_key=="${_key}"]`])
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
    if (admin?._id && admin.connections) {
      const adminConnectionsId = admin.connections._id
        ? admin.connections._id
        : await getAdminConnectionId({ dispatch, id: admin._id, admin });
      console.log({ adminConnectionsId });
      console.log({ admin: admin.connections._id });
      try {
        if (adminConnectionsId) {
          const removed = await client
            .patch(adminConnectionsId)
            .unset(["requests_got[0]", `requests_got[_key=="${_key}"]`])
            .commit();
          const check = removed.requets_got?.find(
            (usr: usersMinData) => usr.userId == userToRejectReq.userId
          );
          if (!check) {
            dispatch(
              set_Admins_Connections({
                command: "reject",
                data: userToRejectReq,
                current: admin.connections,
              })
            );
          } else {
            console.log("something went wrong");
          }
        } else {
          console.log("adminConnectionsId not found");
        }
      } catch (error) {
        console.log(error);
        message.error("try again after some time");
      }
    }
  }

  return (
    <section style={{ paddingTop: "8px" }}>
      <p>Requests</p>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {requests?.map((req, i) => {
          if (req.userId == "test") return null;
          return (
            <li
              key={req.userId ? i : i}
              className="py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
            >
              {req.img.includes("https://") ? (
                <Image
                  src={`${req.img}`}
                  height={100}
                  width={100}
                  alt="image"
                  className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
                />
              ) : (
                <p></p>
              )}
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

"use client";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import React, { useState } from "react";
import { set_Admins_Connections } from "@/redux_toolkit/features/indexSlice";
import Image from "next/image";
import { _ref, usr_and_key_in_array } from "@/typeScript/basics";
import { client } from "@/utilities/sanityClient";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";
import {
  getAdminConnectionId,
  getUsrConnectionId,
} from "@/utilities/functions/getConnectionsId";
import UserGui from "../userMinData/UserGui";

const ConnectionRequests = () => {
  const dispatch = useAppDispatch();
  const [onRequest, setOnRequest] = useState<boolean>(false);
  const requests = useAppSelector(
    (state) => state.hooks.admin?.connections?.requests_got
  );
  const admin = useAppSelector((state) => state.hooks.admin);
  console.log(requests);

  // this below function will move requested user from requests to connectedUsr
  async function acceptRequestHandler(userToAcceptReq: usr_and_key_in_array) {
    const { user, _key } = userToAcceptReq;
    const { _id, name, email, image } = user;
    if (admin?._id && !onRequest) {
      setOnRequest(true);
      const adminConnectionsId = admin.connections?._id
        ? admin.connections._id
        : await getAdminConnectionId({ dispatch, id: admin._id, admin });

      const isAlreadyExist = admin.connections?.connected?.find(
        (user) => user.user._id == _id
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
                user: {
                  _type: "reference",
                  _ref: _id,
                },
              },
            ])
            .commit();
          const check = added.connected?.find(
            (usr: { _key: string; user: _ref }) => usr.user._ref == _id
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
            const friendsConnection = await getUsrConnectionId(_id);
            // this below variable is to get _key to delete element from requests_sent array after accepting connection request
            const element = friendsConnection?.requests_sent?.find(
              (usr) => usr.user._ref == admin._id
            );
            console.log({ element });
            if (friendsConnection?._id && element) {
              const addedInFriendsAccount = await client
                .patch(friendsConnection._id)
                .setIfMissing({ connected: [] })
                .insert("after", "connected[-1]", [
                  {
                    _key: uuidv4(),
                    user: {
                      _type: "reference",
                      _ref: admin._id,
                    },
                  },
                ])
                .unset([
                  "requests_sent[0]",
                  `requests_sent[_key=="${element._key}"]`,
                ])
                .commit();
              const check2 = addedInFriendsAccount.connected?.find(
                (usr: { _key: string; user: _ref }) =>
                  usr.user._ref == admin._id
              );
              if (check2) {
                console.log(addedInFriendsAccount);
                console.log("added to friends account");
              } else {
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
        } finally {
          setOnRequest(false);
        }
      }
    } else if (onRequest) {
      alert("wait a second");
    } else {
      console.error("admin not found");
      message.error("login to contineu");
    }
  }

  async function onRejectHandler(userToRejectReq: usr_and_key_in_array) {
    const { user, _key } = userToRejectReq;
    const { _id, name, email, image } = user;
    if (admin?._id && admin.connections && !onRequest) {
      setOnRequest(true);
      const adminConnectionsId = admin.connections._id
        ? admin.connections._id
        : await getAdminConnectionId({ dispatch, id: admin._id, admin });
      console.log({ adminConnectionsId });
      console.log({ admin: admin.connections._id });
      const friendsConnection = await getUsrConnectionId(_id);
      const element = friendsConnection?.requests_sent?.find(
        (usr) => usr.user._ref == admin._id
      );
      try {
        if (adminConnectionsId && friendsConnection && element) {
          const removed = await client
            .patch(adminConnectionsId)
            .unset(["requests_got[0]", `requests_got[_key=="${_key}"]`])
            .commit();

          const check = removed.requets_got?.find(
            (usr: { _key: string; user: _ref }) => usr.user._ref == _id
          );
          if (!check) {
            dispatch(
              set_Admins_Connections({
                command: "reject",
                data: userToRejectReq,
                current: admin.connections,
              })
            );
            const removed = await client
              .patch(friendsConnection._id)
              .unset([
                "requests_sent[0]",
                `requests_sent[_key=="${element._key}"]`,
              ])
              .commit();
          } else {
            console.log("something went wrong");
          }
        } else {
          console.log("adminConnectionsId not found");
        }
      } catch (error) {
        console.log(error);
        message.error("try again after some time");
      } finally {
        setOnRequest(false);
      }
    } else if (onRequest) {
      alert("wait a second");
    }
  }

  return (
    <section style={{ paddingTop: "8px" }}>
      <p>Requests</p>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {requests?.map((req, i) => {
          const { user: usr, _key } = req;
          if (usr._id == "test") return null;
          return (
            <li key={i}>
              <UserGui user={{ ...usr, _key }}>
              <button className="" onClick={() => acceptRequestHandler(req)}>
                accept
              </button>
              <button onClick={() => onRejectHandler(req)}>reject</button>
            </UserGui>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ConnectionRequests;

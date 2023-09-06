"use client";

import UserChatBox from "@/components/chat/UserChatBox";
import { set_Admin, set_onLineUsers } from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { client } from "@/utilities/sanityClient";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

export default function Page({ params }: { params: { user: string } }) {
  
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  // const dispatch = useAppDispatch();
  // const admin = useAppSelector((state) => state.hooks.admin);
  // const [chatData, setChatData] = useState<chatDataType>();
  // const [form, setForm] = useState<string>();

  const parsedObject: { _id: string; email: string; name: string } = params.user
    ? JSON.parse(decodeURIComponent(params.user))
    : null;

  // async function getChatMessages() {
  //   const chatMessages = await client.fetch(
  //     `*[_type=="chat" && (userOne.email=="${admin.email}" || userOne.email=="${parsedObject.email}") && (userOne.email=="${admin.email}" || userOne.email=="${parsedObject.email}") ]`
  //   );
  //   if (chatMessages.length) {
  //     setChatData(chatMessages[0]);
  //     return chatMessages[0];
  //   }
  // }

  // async function onHandleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   console.log({ chatData });
  //   if (admin._id && admin.email && form) {
  //     if (chatData) {
  //       console.log({ chatData, form });
  //     } else {
  //       const doc = {
  //         _type: "chat",
  //         userOne: {
  //           userId: admin._id,
  //           email: admin.email,
  //         },
  //         userTwo: {
  //           userId: parsedObject._id,
  //           email: parsedObject.email,
  //         },
  //         chat_messages: [
  //           {
  //             sender_id: admin._id,
  //             receiver_id: parsedObject._id,
  //             message: form,
  //           },
  //         ],
  //       };
  //       try {
  //         const createdDoc = await client.create(doc);
  //         setChatData(createdDoc);
  //       } catch (error) {
  //         console.error(error);
  //         message.error("internal server error");
  //       }
  //     }
  //   } else {
  //     alert("admin id not found");
  //   }
  // }



  return (
    <section>
      <UserChatBox parsedObject={parsedObject}/>
    </section>
  );
}



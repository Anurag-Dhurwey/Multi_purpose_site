import {
  set_Admin,
  set_onLineUsers,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { getDateFormate } from "@/utilities/functions/getDateFormate";
import { client } from "@/utilities/sanityClient";
import { getSocket, socketIoConnection } from "@/utilities/socketIo";

import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";

const UserChatBox = ({ parsedObject }: propType) => {
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const [chatData, setChatData] = useState<chatDataType>();
  const [form, setForm] = useState<string>("");
  const dispatch = useAppDispatch();
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);

  const socket = getSocket(session);

  const emitChatMessage = (arg: emitArg) => {
    const isOnline = onLineUsers.find((usr) => {
      return usr._id == arg.receiver_id;
    });
    if (socket && isOnline) {
      console.log(arg)
      socket.emit("chat_message", {...arg,receiver_socketId:isOnline.socketId});
    } else if (!socket) {
      console.error('socket not found');
    } else {
      console.log("user is offline");
    }
  };

  async function getChatMessages() {
    const chatMessages = await client.fetch(
      `*[_type=="chat" && (userOne.email=="${admin.email}" || userOne.email=="${parsedObject.email}") && (userOne.email=="${admin.email}" || userOne.email=="${parsedObject.email}") ]`
    );
    if (chatMessages.length) {
      setChatData(chatMessages[0]);
      // return chatMessages[0];
    }
  }


  async function onHandleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ chatData });
    if (admin._id && admin.email && form) {
      if (chatData?._id) {
        // console.log({ chatData, form });
        const obj = {
          _key: v4(),
          sender_id: admin._id,
          receiver_id: parsedObject._id,
          message: form,
          date_time: new Date(),
        };
        const addMessageToArray: chatDataType = await client
          .patch(chatData._id)
          .insert("after", "chat_messages[-1]", [obj])
          .commit();
        console.log(addMessageToArray);
        const sentMessage = addMessageToArray.chat_messages.find((item) => {
          return item.message == form;
        });
        if (sentMessage) {
          console.log(sentMessage);
          emitChatMessage({...obj,receiver_email:parsedObject.email});
          setChatData(addMessageToArray);
        }
      } else {
        const obj={
          _key: v4(),
          sender_id: admin._id,
          receiver_id: parsedObject._id,
          message: form,
          date_time: new Date(),
        }
        const doc = {
          _type: "chat",
          userOne: {
            userId: admin._id,
            email: admin.email,
          },
          userTwo: {
            userId: parsedObject._id,
            email: parsedObject.email,
          },
          chat_messages: [
            obj
          ],
        };
        try {
          const createdDoc = await client.create(doc);
          emitChatMessage({...obj,receiver_email:parsedObject.email});
          setChatData(createdDoc);
        } catch (error) {
          console.error(error);
          message.error("internal server error");
        }
      }
    } else {
      alert("admin id not found");
    }
  }

  useEffect(() => {
    if (session && !chatData) {
      getChatMessages();
    }
  }, [parsedObject._id]);

  useEffect(() => {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        set_Admin,
        set_onLineUsers,
        message,
      });
    }
  }, [session]);

  return (
    <main className=" flex justify-center items-start">
      <div className=" flex flex-col justify-start items-center h-[90vh] w-[80vw] gap-y-2">
        <span className=" self-start">
          <p> {parsedObject.name}</p>
        </span>
        <div className=" overflow-auto border-2 p-2 border-blue-500 h-[70%] w-[80%] flex flex-col justify-start items-start">
          {chatData?.chat_messages.map((chat, i) => {
            const { message, date_time, sender_id, receiver_id } = chat;
            const uploadDate = new Date(date_time);
            const date = getDateFormate(uploadDate);
            return (
              <span
                key={i}
                className="h-fit w-full flex flex-col justify-start items-start"
              >
                {date && <p className=" self-center px-1 py-[2px]">{date}</p>}
                <p
                  className="px-1 py-[2px]"
                  style={{
                    alignSelf: sender_id == admin._id ? "end" : "",
                  }}
                >
                  {message}
                  <span className=" text-xs pl-2">{`${uploadDate.getHours()}:${uploadDate.getMinutes()}`}</span>
                </p>
              </span>
            );
          })}
        </div>
        <form
          onSubmit={(e) => onHandleSubmit(e)}
          className="w-[80%] gap-x-2 flex justify-center items-start"
        >
          <input
            type="text"
            className="border-2 border-teal-400 h-8 w-[90%]"
            name="message"
            id="message"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          ></input>
          <button
            className=" border-2 border-r-emerald-700 px-2 py-[2px]"
            type="submit"
          >
            send
          </button>
        </form>
      </div>
    </main>
  );
};

export default UserChatBox;

interface chatDataType {
  _id: string;
  userOne: {
    userId: string;
    email: string;
  };
  userTwo: {
    userId: string;
    email: string;
  };
  chat_messages: chat_message[];
}

interface chat_message {
  sender_id: string;
  receiver_id: string;
  message: string;
  date_time: Date;
}

interface emitArg extends chat_message{
  receiver_email:string
}

interface propType {
  parsedObject: {
    _id: string;
    email: string;
    name: string;
  };
}

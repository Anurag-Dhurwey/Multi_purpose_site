import {
  set_Admin,
} from "@/redux_toolkit/features/indexSlice";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { _ref, chat_messages, currentUser_On_Chat } from "@/typeScript/basics";
import { getDateFormate } from "@/utilities/functions/getDateFormate";
import { client } from "@/utilities/sanityClient";
import { getSocket } from "@/utilities/socketIo";

import { message } from "antd";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";

const ChatBox = ({ currentUser, setCurrentUsr }: propType) => {
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);
  const [chatData, setChatData] = useState<chat_messages[]>();
  const [form, setForm] = useState<string>("");
  const dispatch = useAppDispatch();
  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);

  const { chat_id, user } = currentUser;

  const emitChatMessage = async (arg: chat_messages) => {
    const { socket } = await getSocket({ session, dispatch, admin });
    const isOnline = onLineUsers.find((usr) => {
      return usr._id == arg.receiver._ref;
    });
    if (socket?.connected && isOnline) {
      console.log(arg);
      socket.emit("chat_message", {
        ...arg,
        receiver_socketId: isOnline.socketId,
      });
    } else if (!socket?.disconnected) {
      console.error("socket not found");
    } else {
      console.log("user is offline");
    }
  };

  async function getChatMessages() {
    const chatMessages: { chat_messages: chat_messages[] }[] =
      await client.fetch(
        `*[_type=="chat" && _id=="${chat_id}" ]{chat_messages}`
      );
    if (chatMessages.length) {
      console.log({ chatMessages });
      setChatData(chatMessages[0].chat_messages);
      // return chatMessages[0];
    }
  }

  async function onHandleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log({ chatData });
    if (admin._id && admin.email && form) {
      const uuid = v4();
      const obj = {
        _key: uuid,
        sender: {
          _type: "reference",
          _ref: admin._id,
        },
        receiver: {
          _type: "reference",
          _ref: user._id,
        },
        message: form,
        date_time: new Date(),
      };
      if (chat_id) {

        const addMessageToArray: chatDataType_ref = await client
          .patch(chat_id)
          .insert("after", "chat_messages[-1]", [obj])
          .commit();
        console.log(addMessageToArray);
        const isSent = addMessageToArray.chat_messages.find((item) => {
          return item._key == uuid;
        });
        if (isSent) {
          console.log(isSent);
          emitChatMessage(obj);
          setChatData(addMessageToArray.chat_messages);
        }
      } else {
        const doc = {
          _type: "chat",
          userOne: {
            _type: "reference",
            _ref: admin._id,
          },
          userTwo: {
            _type: "reference",
            _ref: user._id,
          },
          chat_messages: [obj],
        };
        try {
          const createdDoc = await client.create(doc);
          emitChatMessage(obj);
          setChatData(createdDoc.chat_messages);
          setCurrentUsr({ chat_id: createdDoc._id, user });
        } catch (error) {
          console.error(error);
          message.error("internal server error");
        }
      }
    } else {
      alert("admin id not found");
    }
  }

  function withUseEffect() {
    if (session) {
      getChatMessages();
    }
  }
  useEffect(() => {
   withUseEffect()
  }, [user._id]);

  return (
    <main className=" flex justify-center items-start">
      <div className=" flex flex-col justify-start items-center h-[90vh] w-[80vw] gap-y-2">
        <span className=" self-start">
          <p> {user.name}</p>
        </span>
        <div className=" overflow-auto border-2 p-2 border-blue-500 h-[70%] w-[80%] flex flex-col justify-start items-start">
          {chatData?.map((chat, i) => {
            const { sender, receiver, message, _key, date_time } = chat;
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
                    alignSelf: sender._ref == admin._id ? "end" : "",
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

export default ChatBox;

interface chatDataType_ref {
  _id: string;
  userOne: _ref;
  userTwo: _ref;
  chat_messages: chat_messages[];
}



interface propType {
  currentUser: currentUser_On_Chat;
  setCurrentUsr: React.Dispatch<
    React.SetStateAction<currentUser_On_Chat | undefined>
  >;
}

import style from "./chatbox.module.css";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { _ref, chat_messages, currentUser_On_Chat } from "@/typeScript/basics";
import { getDateFormate } from "@/utilities/functions/getDateFormate";
import { client } from "@/utilities/sanityClient";
import { getSocket } from "@/utilities/socketIo";
import { IoArrowBackOutline } from "react-icons/io5";
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
    withUseEffect();
  }, [user._id]);

  return (
    <main className={style.chatboxParentDiv}>
      <div style={{ alignSelf: "start" }}>
        <button onClick={() => setCurrentUsr(undefined)}>
          <IoArrowBackOutline />
        </button>{" "}
        <span> {user.name}</span>
      </div>
      <div className={style.chatboxChildDiv}>
        {chatData?.map((chat, i) => {
          const { sender, receiver, message, _key, date_time } = chat;
          const uploadDate = new Date(date_time);
          const date = getDateFormate(uploadDate);
          return (
            <span key={i} className={style.chatboxChildDivChildSpan}>
              {date && <p className={style.chatboxChat}>{date}</p>}
              <p
                style={{
                  alignSelf: sender._ref == admin._id ? "end" : "",
                  padding: "2px 4px 2px 4px",
                }}
              >
                {message}
                <span
                  style={{ fontSize: "12px", paddingLeft: "8px" }}
                >{`${uploadDate.getHours()}:${uploadDate.getMinutes()}`}</span>
              </p>
            </span>
          );
        })}
      </div>
      <form onSubmit={(e) => onHandleSubmit(e)} className={style.chatboxForm}>
        <input
          type="text"
          className={style.chatboxFormInput}
          name="message"
          id="message"
          value={form}
          onChange={(e) => setForm(e.target.value)}
        ></input>
        <button className={style.chatboxFormButton} type="submit">
          send
        </button>
      </form>
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

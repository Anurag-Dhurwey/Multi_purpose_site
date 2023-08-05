"use client";
import { useAppSelector, useAppDispatch } from "@/redux_toolkit/hooks";
import { setUser, set_media_items } from "@/redux_toolkit/features/indexSlice";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { getUserId } from "@/utilities/functions/getUserId";
import { media_Item } from "@/typeScript/basics";
import { message } from "antd";

const CommentForm = ({ meadia_item }:{meadia_item:media_Item}) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const user = useAppSelector((state) => state.hooks.user);
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const { data: session } = useSession();
  const [form, setForm] = useState("");

  const onHnandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(session){
      const user_with_id = await getUserId({dispatch,setUser,user,session,messageApi});
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({ form, meadia_item, user: user_with_id }),
      });
      const jsonRes = await res.json();
      if (jsonRes) {
        const updatedMeadia_Items = media_Items.map((item) => {
          if (item._id == jsonRes._id) {
            return { ...item, comments: [...jsonRes.comments] };
          } else {
            return item;
          }
        });

        dispatch(set_media_items([...updatedMeadia_Items]));
        setForm("");
        console.log(jsonRes);
      }
    } catch (error) {
      console.error(error);
      messageApi.error("comment not posted");
    }
    }else{
      console.log('session not found')
      messageApi.error('login to contineu')
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(e.target.value);
  };

  return (
    <>
    {contextHolder}
      <form
        onSubmit={(e) => onHnandleSubmit(e)}
        className="mb-1 gap-x-1 w-full flex justify-center items-center"
      >
        <input
          required
          minLength={3}
          type="text"
          name="comment"
          id="comment"
          className="text-xs px-4 py-1 rounded-lg w-[90%] bg-white"
          value={form}
          onChange={(e) => onChangeHandler(e)}
        />
        <button type="submit" className="text-xs">
          <IoMdSend className="text-lg " />
        </button>
      </form>
    </>
  );
};

export default CommentForm;

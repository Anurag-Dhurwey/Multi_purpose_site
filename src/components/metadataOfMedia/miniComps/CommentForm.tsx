"use client";
import { useAppSelector, useAppDispatch } from "@/redux_toolkit/hooks";
import { set_media_items } from "@/redux_toolkit/features/indexSlice";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { media_Item } from "@/typeScript/basics";
import { message } from "antd";

const CommentForm = ({ meadia_item }: { meadia_item: media_Item }) => {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.hooks.admin);
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const { data: session } = useSession();
  const [form, setForm] = useState("");
  const [onSubmit,setOnsubmit]=useState<boolean>(false)

  const onHnandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const formetedFormText = form
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .join(" ");

    if (formetedFormText.length >= 3 && !onSubmit) {
      setOnsubmit(true)
      try {
        const res = await fetch("/api/comment", {
          method: "POST",
          body: JSON.stringify({ form:formetedFormText, meadia_item, user: admin }),
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
        message.error("comment not posted");
      }finally{
        setOnsubmit(false)
      }
    }else if(onSubmit){
      alert("submitting")
    } else {
      setForm(formetedFormText);
      alert("text length should be greater then 3");
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(e.target.value);
  };


  return (
    <>
      <form
        onSubmit={(e) =>
          session && admin._id
            ? onHnandleSubmit(e)
            : message.error("login to contineu")
        }
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

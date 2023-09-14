"use client";
import { useAppSelector, useAppDispatch } from "@/redux_toolkit/hooks";
import { set_media_items } from "@/redux_toolkit/features/indexSlice";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { comment_ref, media_Item } from "@/typeScript/basics";
import { message } from "antd";
import { client } from "@/utilities/sanityClient";
import { v4 } from "uuid";

const CommentForm = ({ meadia_item }: { meadia_item: media_Item }) => {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.hooks.admin);
  const media_Items = useAppSelector((state) => state.hooks.media_Items);
  const { data: session } = useSession();
  const [form, setForm] = useState("");
  const [onSubmit, setOnsubmit] = useState<boolean>(false);

  const onHnandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uuid = v4();
    // console.log(uuid);
    const formetedFormText = form
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .join(" ");

    if (formetedFormText.length >= 3 && !onSubmit) {
      setOnsubmit(true);
      try {
        const res = await client
          .patch(meadia_item._id)
          .setIfMissing({ comments: [] })
          .insert("after", "comments[-1]", [
            {
              _key: uuid,
              comment: form,
              postedBy: { _type: "reference", _ref: admin._id },
            },
          ])
          .commit();

        const element: comment_ref | undefined = res.comments.find(
          (item: comment_ref) => item._key == uuid
        );

        if (element?._key && admin._id && admin.name && admin.email) {
          console.log(element);
          const doc = {
            _key: element?._key,
            comment: form,
            postedBy: {
              _id: admin._id,
              name: admin.name,
              email: admin.email,
            },
          };
          const updatedMeadia_Items = media_Items.map((item) => {
            if (item._id == res._id) {
              return {
                ...item,
                comments: item.comments ? [...item.comments, doc] : [doc],
              };
            } else {
              return item;
            }
          });

          dispatch(set_media_items([...updatedMeadia_Items]));
          setForm("");
          console.log(res);
        }
      } catch (error) {
        console.error(error);
        message.error("comment not posted");
      } finally {
        setOnsubmit(false);
      }
    } else if (onSubmit) {
      alert("submitting");
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

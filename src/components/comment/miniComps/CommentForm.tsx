"use client";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
const CommentForm = () => {
  const [form, setForm] = useState<String>("");

  const onHnandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(e.target.value);
  };

  return (
    <>
      <form
        onSubmit={(e) => onHnandleSubmit(e)}
        className="mb-1 gap-x-1 w-full flex justify-center items-center"
      >
        <input
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

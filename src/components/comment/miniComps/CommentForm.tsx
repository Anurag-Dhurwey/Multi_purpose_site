import React from "react";
import {IoMdSend} from 'react-icons/io'
const CommentForm = () => {
  return (
    <>
      <form onSubmit={(e)=>console.log(e)} className="mb-1 gap-x-1 w-full flex justify-center items-center">
        <input
          type="text"
          name="comment"
          id="comment"
          className="text-xs px-4 py-1 rounded-lg w-[90%] bg-white"
        />
        <button type="submit" className="text-xs">
         <IoMdSend className="text-lg "/>
        </button>
      </form>
    </>
  );
};

export default CommentForm;

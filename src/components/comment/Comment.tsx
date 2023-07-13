"use client";
import React, { useState } from "react";

const Comment = ({ comments, user, caption, desc }) => {
  const [cmtView, setCmtView] = useState(false);
  const [descView, setDescView] = useState(true);

  return (
    <div className={`w-[30%] h-[395px]  overflow-auto `}>
      <div
        className={`p-3 mb-1 bg-yellow-700 rounded-md `}
        onClick={() => {
          setDescView(!descView);
        }}
      >
        <span className="flex justify-start items-center gap-x-2">
          <button className="h-8 w-8 bg-blue-600 rounded-3xl"></button>
          <h4>{user}</h4>
        </span>
        <h3>{caption}</h3>
        <p className={`text-sm ${descView ? "" : "hidden"}`}>{desc}</p>
      </div>

      <div className="w-full flex justify-center">
        {/* <Comment comments={comments} /> */}
        <div
          className={`w-full p-3 pt-0 bg-yellow-700 rounded-md `}
          onClick={() => {
            setCmtView(!cmtView);
          }}
        >
          {comments?.map((cmnt, i) => {
            const { comment, postedBy: commentBy } = cmnt;
            const { name: user } = commentBy;
            return (
              <div
                key={comment + i}
                className={`flex flex-col justify-start items-start ${
                  cmtView ? " " : i == 0 ? "" : "hidden"
                }`}
              >
                <span className="flex justify-center items-center">
                  <button className="w-4 h-4 bg-blue-600 rounded-full"></button>
                  <p>{user}</p>
                </span>
                <p>{comment}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Comment;

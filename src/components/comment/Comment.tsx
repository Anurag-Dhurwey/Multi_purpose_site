"use client";
import React, { useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import CommentForm from "./miniComps/CommentForm";
const Comment = ({ comments, user, caption, desc }) => {
  const [cmtView, setCmtView] = useState(false);
  const [descView, setDescView] = useState(false);

  return (
    <div className={`w-[30%] h-[395px] relative  overflow-auto `}>
      <div
        className={`p-3 mb-1 bg-yellow-700 rounded-md `}
        onClick={() => {
          setDescView(!descView);
          setCmtView(false);
        }}
      >
        <span className="flex justify-start items-center gap-x-2">
          <button className="h-8 w-8 bg-blue-600 rounded-3xl"></button>
          <h4>{user}</h4>
          <button className="text-2xl font-semibold text-white">
            {descView ? <MdExpandLess /> : <MdExpandMore />}
          </button>
        </span>
        <h3>{descView ? caption : caption.slice(0, 30) + "....."}</h3>
        <p className={`text-sm ${descView ? "" : "hidden"}`}>{desc}</p>
        {descView && (
          <button className="text-2xl font-semibold text-white">
            {descView ? <MdExpandLess /> : <MdExpandMore />}
          </button>
        )}
      </div>

      <div className="w-full flex flex-col justify-center">
        <div
          className={`w-full ${
            cmtView ? "h-full" : ""
          } p-3 pt-0 bg-yellow-700 rounded-md `}
          onClick={() => {
            setCmtView(!cmtView);
            setDescView(false);
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
                <p>{cmtView ? comment : comment.slice(0, 50) + "....."}</p>
               
              </div>
            );
          })}
          {cmtView && (
                  <div className="w-full ">
                    <CommentForm />
                  </div>
                )}
        </div>
        
      </div>
      <div></div>
    </div>
  );
};

export default Comment;

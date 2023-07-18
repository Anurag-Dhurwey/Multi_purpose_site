"use client";
import React, { useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import CommentForm from "./miniComps/CommentForm";
import { useSession } from "next-auth/react";
const MetaData_with_Comment = ({ meadia_item, user }) => {
  const { caption, desc, comments, _id } = meadia_item;
  const [cmtView, setCmtView] = useState(false);
  const [descView, setDescView] = useState(false);

  const { data: session } = useSession();

  return (
    <div className={`w-[30%] h-[395px] overflow-hidden`}>
      {!cmtView && (
        <div
          className={`p-3 pb-0 mb-1 ${
            descView ? "h-full" : ""
          } bg-yellow-700 rounded-md overflow-auto`}
        >
          <span className="flex justify-start items-center gap-x-2">
            <button className="h-8 w-8 bg-blue-600 rounded-3xl"></button>
            <h4>{user}</h4>
            {/* <button className="text-2xl font-semibold text-white">
              {descView ? <MdExpandLess /> : <MdExpandMore />}
            </button> */}
          </span>
          <h3>{descView ? caption : caption.slice(0, 30) + "....."}</h3>
          <p className={`text-sm ${descView ? "" : "hidden"}`}>{desc}</p>
          <span className="w-full flex justify-center sticky bottom-0">
            <button
              className="text-2xl font-semibold text-white"
              onClick={() => {
                setDescView(!descView);
                setCmtView(false);
              }}
            >
              {descView ? (
                <MdExpandLess className="p-0" />
              ) : (
                <MdExpandMore className="p-0" />
              )}
            </button>
          </span>
        </div>
      )}

      {!descView && (
        <div
          className={`w-full ${
            cmtView ? "h-full" : ""
          } rounded-md bg-yellow-700 flex flex-col justify-start overflow-auto`}
        >
          <div className={`w-full px-3 py-0  `}>
            {comments?.map((cmnt, i) => {
              const { comment, postedBy: commentBy } = cmnt;
              // const { name: user } = commentBy;
              return (
                <div
                  key={comment + i}
                  className={`flex flex-col justify-start items-start ${
                    cmtView ? " " : i == 0 ? "" : "hidden"
                  }`}
                >
                  <span className="flex justify-center items-center">
                    <button className="w-4 h-4 bg-blue-600 rounded-full"></button>
                    <p>
                      {commentBy.name ? commentBy.name : session?.user?.name}
                    </p>
                  </span>
                  <p>{cmtView ? comment : comment.slice(0, 50) + "....."}</p>
                </div>
              );
            })}
            {!comments && (
              <p className="w-full text-center font-medium">No comments yet!</p>
            )}
          </div>

          <span
            className={`w-full ${
              cmtView ? "pt-[80%]" : ""
            } flex flex-col items-center justify-center sticky bottom-0`}
          >
            {cmtView && (
              <div className="w-full ">
                <CommentForm meadia_item={meadia_item} />
              </div>
            )}
            <button
              className="text-2xl font-semibold text-white"
              onClick={() => {
                setCmtView(!cmtView);
                setDescView(false);
              }}
            >
              {descView ? (
                <MdExpandLess className="p-0" />
              ) : (
                <MdExpandMore className="p-0" />
              )}
            </button>
          </span>
        </div>
      )}
      <div></div>
    </div>
  );
};

export default MetaData_with_Comment;

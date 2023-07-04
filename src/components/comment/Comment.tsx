'use client'
import React, { useState } from 'react'

const Comment = ({comments,userName,caption,desc}) => {

const [cmtView,setCmtView]=useState(false)
const [descView,setDescView]=useState(true)


  return (
    <div className={`w-[30%] h-[395px]  overflow-auto `}>
    <div className={`p-3 mb-1 bg-yellow-700 ${descView?'':' max-h-[56px] overflow-hidden'}`} onClick={()=>{setDescView(!descView)}}>
      <span className="flex justify-start items-center gap-x-2">
        <button className="h-8 w-8 bg-blue-600 rounded-3xl"></button>
        <h4>{userName}</h4>
      </span>
      <h3>{caption}</h3>
      <p className="text-sm">{desc}</p>
    </div>

    <div className="w-full flex justify-center">
      {/* <Comment comments={comments} /> */}
      <div
        className={`p-3 pt-0 bg-yellow-700 ${
          cmtView ? " " : "h-14 overflow-hidden"
        }`}
        onClick={()=>{setCmtView(!cmtView)}}
      >
        {comments?.map((cmnt, i) => {
          const { comment, postedBy: commentBy } = cmnt;
          const { userName: commenter } = commentBy;
          console.log(comment, commentBy);
          return (
            <div
              key={comment + i}
              className="flex flex-col justify-start items-start"
            >
              <span className="flex justify-center items-center">
                <button className="w-4 h-4 bg-blue-600 rounded-full"></button>
                <p>{commenter}</p>
              </span>
              <p>{comment}</p>
            </div>
          );
        })}
      </div>
    </div>
    <div></div>
  </div>
  )
}

export default Comment

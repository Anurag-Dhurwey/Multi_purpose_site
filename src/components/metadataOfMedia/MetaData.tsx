"use client";
import React, { useState } from "react";
import style from "./metaData.module.css";
import TitleDesc from "./miniComps/TitleDesc";
import CommentBox from "./miniComps/CommentBox";
const MetaData_with_Comment = ({ meadia_item, user }) => {
  const { caption, desc, comments, _id } = meadia_item;
  const [cmtView, setCmtView] = useState(false);
  const [descView, setDescView] = useState(false);

  return (
    <div className={`${style.main}`}>
      <TitleDesc
        useStates={{ cmtView, descView, setCmtView, setDescView }}
        user={user}
        caption={caption}
        desc={desc}
      />
      <CommentBox
        useStates={{ cmtView, descView, setCmtView, setDescView }}
        meadia_item={meadia_item}
      />
      <div></div>
    </div>
  );
};

export default MetaData_with_Comment;
